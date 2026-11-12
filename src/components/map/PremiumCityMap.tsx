import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { Compass, Layers, Navigation, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { BookingState, LocationPoint } from '../../types';
import {
  fetchDubaiRoadRoute,
  getNearbyDubaiTaxis,
  interpolateRoutePosition,
  NearbyTaxiMarker,
} from '../../utils/dubaiRouting';

type Map = maplibregl.Map;
type Marker = maplibregl.Marker;

interface GeoJSONLineFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

interface Props {
  pickup?: LocationPoint | null;
  destination?: LocationPoint | null;
  booking?: BookingState | null;
  interactive?: boolean;
  onSelectPoint?: (point: LocationPoint) => void;
  className?: string;
  showAllLandmarks?: boolean;
}

export const PremiumCityMap: React.FC<Props> = ({
  pickup,
  destination,
  booking,
  interactive = true,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Markers refs
  const pickupMarkerRef = useRef<Marker | null>(null);
  const destMarkerRef = useRef<Marker | null>(null);
  const driverMarkerRef = useRef<Marker | null>(null);
  const nearbyMarkersRef = useRef<Marker[]>([]);

  // Cached active route coordinates
  const routeCoordsRef = useRef<[number, number][]>([]);

  // 1. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fallback coordinates: Burj Khalifa / Downtown Dubai
    const initialLng = pickup?.lng || 55.2744;
    const initialLat = pickup?.lat || 25.1972;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [initialLng, initialLat],
        zoom: 14.5,
        pitch: is3DMode ? 48 : 0,
        bearing: -12,
        interactive: interactive,
        attributionControl: false, // We render a sleek custom attribution tag for OpenFreeMap
      });

      map.on('load', () => {
        setMapLoaded(true);
        setMapError(null);

        // Add 3D building extrusions if supported in liberty style
        const layers = map.getStyle().layers;
        if (layers) {
          const labelLayerId = layers.find(
            (layer: any) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']
          )?.id;

          if (!map.getLayer('3d-buildings') && map.getSource('openmaptiles')) {
            try {
              map.addLayer(
                {
                  id: '3d-buildings',
                  source: 'openmaptiles',
                  'source-layer': 'building',
                  filter: ['==', 'extrude', 'true'],
                  type: 'fill-extrusion',
                  minzoom: 14,
                  paint: {
                    'fill-extrusion-color': '#E2E8F0',
                    'fill-extrusion-height': ['get', 'render_height'],
                    'fill-extrusion-base': ['get', 'render_min_height'],
                    'fill-extrusion-opacity': 0.65,
                  },
                },
                labelLayerId
              );
            } catch {
              // Ignore if extrusion layer setup fails on specific style variant
            }
          }
        }
      });

      map.on('error', (e: any) => {
        // Only trigger critical UI error if map fails completely
        if (!mapLoaded && e?.error?.message?.includes('style')) {
          setMapError('Map tiles temporarily slow to load. Retrying...');
        }
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'WebGL or Map error';
      setMapError(msg);
    }
  }, []);

  // 2. Manage Pickup Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (pickup) {
      if (!pickupMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'pixel-marker-pickup';
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-emerald-500/25 animate-ping"></div>
            <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>
              </svg>
            </div>
          </div>
        `;
        pickupMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([pickup.lng, pickup.lat])
          .addTo(map);
      } else {
        pickupMarkerRef.current.setLngLat([pickup.lng, pickup.lat]);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }
  }, [pickup, mapLoaded]);

  // 3. Manage Destination Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (destination) {
      if (!destMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'pixel-marker-dest';
        el.innerHTML = `
          <div class="relative flex flex-col items-center">
            <div class="w-7 h-7 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-900 font-bold">
              <svg class="w-3.5 h-3.5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
              </svg>
            </div>
            <div class="w-1.5 h-2 bg-amber-600 rounded-b-sm"></div>
          </div>
        `;
        destMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([destination.lng, destination.lat])
          .addTo(map);
      } else {
        destMarkerRef.current.setLngLat([destination.lng, destination.lat]);
      }
    } else if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }
  }, [destination, mapLoaded]);

  // 4. Fetch & Draw Road-Following Route Line
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (!pickup || !destination) {
      // Clear route layers
      if (map.getLayer('route-glow')) map.removeLayer('route-glow');
      if (map.getLayer('route-line')) map.removeLayer('route-line');
      if (map.getLayer('route-traveled')) map.removeLayer('route-traveled');
      if (map.getSource('route-source')) map.removeSource('route-source');
      routeCoordsRef.current = [];
      return;
    }

    let isMounted = true;

    fetchDubaiRoadRoute(pickup, destination).then((coords) => {
      if (!isMounted || !mapRef.current) return;
      const m = mapRef.current;
      routeCoordsRef.current = coords;

      const geojson: GeoJSONLineFeature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      };

      if (!m.getSource('route-source')) {
        m.addSource('route-source', {
          type: 'geojson',
          data: geojson,
        });

        // Ambient route glow
        m.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#2563EB',
            'line-width': 10,
            'line-opacity': 0.22,
          },
        });

        // Main road highway route line
        m.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#0F172A',
            'line-width': 4.5,
          },
        });

        // Traveled gold highlight line
        m.addLayer({
          id: 'route-traveled',
          type: 'line',
          source: 'route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#F59E0B',
            'line-width': 5,
            'line-opacity': 0.95,
          },
        });
      } else {
        const src = m.getSource('route-source') as maplibregl.GeoJSONSource;
        src.setData(geojson);
      }

      // Smooth camera fit bounds to show entire Dubai road route
      const bounds = new LngLatBounds();
      coords.forEach((coord) => bounds.extend(coord));

      // In home or vehicle selection screen, pad bottom so the sheet doesn't obscure the route
      m.fitBounds(bounds, {
        padding: { top: 90, bottom: 280, left: 45, right: 45 },
        maxZoom: 15.2,
        duration: 1200,
      });
    });

    return () => {
      isMounted = false;
    };
  }, [pickup, destination, mapLoaded]);

  // 5. Manage Nearby Simulated Chauffeur Vehicles (Only when NOT on an active booked ride)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous markers
    nearbyMarkersRef.current.forEach((m) => m.remove());
    nearbyMarkersRef.current = [];

    if (booking && booking.status !== 'completed' && booking.status !== 'cancelled') {
      // Don't show generic nearby cars during active dispatch
      return;
    }

    const center = pickup ? { lat: pickup.lat, lng: pickup.lng } : { lat: 25.1972, lng: 55.2744 };
    const taxis = getNearbyDubaiTaxis(center);

    taxis.forEach((taxi) => {
      const el = document.createElement('div');
      el.className = 'pixel-nearby-taxi-marker cursor-pointer transition-transform duration-300';
      el.style.transform = `rotate(${taxi.bearing}deg)`;
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 shadow-lg flex items-center justify-center text-amber-400 hover:scale-110 transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
            <circle cx="7.5" cy="14.5" r="1.5"/>
            <circle cx="16.5" cy="14.5" r="1.5"/>
          </svg>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([taxi.lng, taxi.lat])
        .addTo(map);

      nearbyMarkersRef.current.push(marker);
    });
  }, [pickup, mapLoaded, booking?.status]);

  // 6. Manage Active Dispatch Driver Vehicle Movement & Camera Follow
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !booking) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }
      return;
    }

    const { status, progress } = booking;

    if (status === 'assigned' || status === 'arriving' || status === 'in_progress') {
      let carLng = 55.2744;
      let carLat = 25.1972;
      let bearing = 0;

      if (status === 'assigned' || status === 'arriving') {
        // Driver approaching pickup
        const pLat = pickup ? pickup.lat : 25.1972;
        const pLng = pickup ? pickup.lng : 55.2744;
        const startLat = pLat + 0.007;
        const startLng = pLng - 0.006;
        const t = Math.max(0, Math.min(100, progress)) / 100;

        carLat = startLat + (pLat - startLat) * t;
        carLng = startLng + (pLng - startLng) * t;
        bearing = 52;
      } else if (status === 'in_progress') {
        // Moving along road coordinates
        const coords = routeCoordsRef.current;
        if (coords.length > 0) {
          const interp = interpolateRoutePosition(coords, progress);
          carLng = interp.lng;
          carLat = interp.lat;
          bearing = interp.bearing;

          // Update traveled portion in map source
          if (map.getSource('route-source')) {
            const traveledSlice = coords.slice(0, interp.index + 1);
            traveledSlice.push([carLng, carLat]);
            const traveledGeoJSON: GeoJSONLineFeature = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: traveledSlice,
              },
            };
            // Note: If you want to paint only traveled or remaining, you can update layer filters or sources
          }
        }
      }

      // Create or update driver vehicle marker
      if (!driverMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'pixel-active-driver-marker';
        el.innerHTML = `
          <div class="car-marker-container relative flex items-center justify-center" style="transform: rotate(${bearing}deg); transition: transform 0.4s ease;">
            <div class="absolute w-12 h-12 rounded-full bg-amber-400/30 animate-ping"></div>
            <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 shadow-2xl flex items-center justify-center text-amber-400">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
          </div>
        `;
        driverMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([carLng, carLat])
          .addTo(map);
      } else {
        driverMarkerRef.current.setLngLat([carLng, carLat]);
        const inner = driverMarkerRef.current.getElement().querySelector('.car-marker-container') as HTMLElement;
        if (inner) {
          inner.style.transform = `rotate(${bearing}deg)`;
        }
      }

      // Smooth camera follow during active driving
      if (status === 'in_progress') {
        map.easeTo({
          center: [carLng, carLat],
          duration: 900,
          easing: (n) => n,
        });
      }
    } else {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }
    }
  }, [booking?.status, booking?.progress, mapLoaded]);

  // Camera Actions
  const handleRecenter = () => {
    const map = mapRef.current;
    if (!map) return;
    const targetLng = pickup?.lng || 55.2744;
    const targetLat = pickup?.lat || 25.1972;
    map.flyTo({
      center: [targetLng, targetLat],
      zoom: 15,
      pitch: is3DMode ? 48 : 0,
      bearing: -12,
      duration: 1000,
    });
  };

  const handleToggle3D = () => {
    const map = mapRef.current;
    if (!map) return;
    const new3D = !is3DMode;
    setIs3DMode(new3D);
    map.easeTo({
      pitch: new3D ? 48 : 0,
      duration: 600,
    });
  };

  const handleResetNorth = () => {
    const map = mapRef.current;
    if (!map) return;
    map.resetNorthPitch({ duration: 600 });
  };

  const handleZoom = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomTo(map.getZoom() + delta, { duration: 300 });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-slate-100 ${className}`}>
      {/* Actual MapLibre Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Loading & Network Error Skeleton Shield */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/85 backdrop-blur-xs">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-slate-200/80 flex items-center justify-center text-slate-800 animate-pulse">
            <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
          </div>
          <p className="mt-3 text-xs font-bold text-slate-700">Loading Dubai Street Geography...</p>
          <span className="text-[10px] text-slate-400 mt-0.5">Powered by OpenFreeMap</span>
        </div>
      )}

      {mapError && (
        <div className="absolute top-20 left-4 right-4 z-20 p-3 rounded-2xl bg-amber-50/95 border border-amber-200 text-amber-800 shadow-lg text-xs flex items-center justify-between">
          <span>{mapError}</span>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded-xl bg-amber-600 text-white font-bold text-[10px]"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Floating Map Controls Dock (Top Right) */}
      <div className="absolute right-4 top-20 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900 active:scale-95 transition"
          title="Recenter Map"
        >
          <Navigation className="w-4 h-4 text-emerald-600" />
        </button>

        <button
          onClick={handleToggle3D}
          className={`w-10 h-10 rounded-2xl backdrop-blur-md border shadow-md flex items-center justify-center transition active:scale-95 ${
            is3DMode
              ? 'bg-slate-900 text-amber-400 border-slate-800'
              : 'bg-white/95 text-slate-700 border-slate-200'
          }`}
          title="Toggle 3D View"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetNorth}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900 active:scale-95 transition"
          title="Reset Bearing"
        >
          <Compass className="w-4 h-4" />
        </button>

        <div className="flex flex-col rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md overflow-hidden">
          <button
            onClick={() => handleZoom(0.8)}
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:text-slate-900 active:bg-slate-100 transition border-b border-slate-100"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.8)}
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:text-slate-900 active:bg-slate-100 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mandatory OpenFreeMap & OSM Legal Attribution Badge */}
      <div className="absolute bottom-1 right-2 z-10 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-xs text-[9px] text-slate-500 font-medium border border-slate-200/50">
        © <a href="https://openfreemap.org" target="_blank" rel="noreferrer" className="underline hover:text-slate-700">OpenFreeMap</a> | © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-slate-700">OpenStreetMap</a>
      </div>
    </div>
  );
};
