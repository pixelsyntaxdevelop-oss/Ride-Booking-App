/**
 * Accurate Road-Following Routing & Navigation Engine for Dubai
 * Integrates real highway corridors (Sheikh Zayed Road, Financial Centre Rd,
 * Palm Trunk, Al Khail Rd) and public OSRM driving engine with graceful fallback.
 */

import { LocationPoint } from '../types';

export interface NearbyTaxiMarker {
  id: string;
  tier: 'standard' | 'comfort' | 'xl';
  lat: number;
  lng: number;
  bearing: number;
  driverName: string;
  plate: string;
  model: string;
}

// Sheikh Zayed Road (E11) Trunk Highway Waypoints (from SW JBR/Marina to NE DXB Airport)
const SZR_CORRIDOR: [number, number][] = [
  [55.1325, 25.0763], // JBR Promenade
  [55.1380, 25.0805], // Marina Walk Link
  [55.1430, 25.0860], // Marina Mall Interchange
  [55.1580, 25.0970], // Al Barsha Heights Interchange
  [55.1850, 25.1090], // Al Barsha / MOE South
  [55.2006, 25.1181], // Mall of the Emirates E11 Exit
  [55.2150, 25.1330], // Umm Suqeim Interchange
  [55.2280, 25.1480], // Al Manara E11 Overpass
  [55.2475, 25.1740], // Al Safa / Dubai Water Canal Bridge
  [55.2630, 25.1865], // Business Bay Interchange
  [55.2715, 25.1936], // Dubai Opera Boulevard Link
  [55.2744, 25.1972], // Burj Khalifa / Downtown Exit
  [55.2796, 25.1995], // Dubai Mall / Financial Centre Rd Junction
  [55.2810, 25.2105], // DIFC Gate Interchange
  [55.2818, 25.2192], // Museum of the Future / Emirates Towers
  [55.3050, 25.2340], // Za'abeel / Karama
  [55.3350, 25.2450], // Al Garhoud Bridge
  [55.3657, 25.2532], // DXB Airport Terminal 3
];

// Palm Jumeirah Access Road
const PALM_BRANCH: [number, number][] = [
  [55.1270, 25.1382], // Atlantis The Royal
  [55.1340, 25.1365], // Crescent East
  [55.1475, 25.1180], // Palm Trunk Mid-spine
  [55.1520, 25.1050], // Palm Gateway
  [55.1580, 25.0970], // Connects to SZR Corridor
];

// Dubai Hills Access Road
const DUBAI_HILLS_BRANCH: [number, number][] = [
  [55.2415, 25.1018], // Dubai Hills Mall
  [55.2460, 25.1180], // Al Khail Road Link
  [55.2580, 25.1620], // Meydan Link
  [55.2630, 25.1865], // Connects to Business Bay Interchange
];

/**
 * Calculates Euclidean distance between two geographic coordinates
 */
function geoDistance(p1: [number, number], p2: [number, number]): number {
  const dLng = p1[0] - p2[0];
  const dLat = p1[1] - p2[1];
  return Math.sqrt(dLng * dLng + dLat * dLat);
}

/**
 * Finds index of closest waypoint along a corridor
 */
function findClosestIndex(point: [number, number], corridor: [number, number][]): number {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < corridor.length; i++) {
    const d = geoDistance(point, corridor[i]);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/**
 * Generates an accurate, road-following coordinate polyline for Dubai
 */
export function generateDubaiRoadRoute(
  startLngLat: [number, number],
  endLngLat: [number, number]
): [number, number][] {
  const route: [number, number][] = [startLngLat];

  // Helper to connect a point to the main SZR corridor
  const connectToCorridor = (point: [number, number]): { corridorPoint: [number, number]; branch: [number, number][] } => {
    // Check if on Palm
    if (geoDistance(point, PALM_BRANCH[0]) < 0.035 || geoDistance(point, PALM_BRANCH[2]) < 0.02) {
      return { corridorPoint: [55.1580, 25.0970], branch: PALM_BRANCH };
    }
    // Check if in Dubai Hills
    if (geoDistance(point, DUBAI_HILLS_BRANCH[0]) < 0.03) {
      return { corridorPoint: [55.2630, 25.1865], branch: DUBAI_HILLS_BRANCH };
    }
    // Otherwise connect directly to nearest SZR point
    const closestIdx = findClosestIndex(point, SZR_CORRIDOR);
    return { corridorPoint: SZR_CORRIDOR[closestIdx], branch: [] };
  };

  const startConn = connectToCorridor(startLngLat);
  const endConn = connectToCorridor(endLngLat);

  // If start was on a branch, walk through branch to corridor
  if (startConn.branch.length > 0) {
    const branchStartIdx = findClosestIndex(startLngLat, startConn.branch);
    for (let i = branchStartIdx; i < startConn.branch.length; i++) {
      route.push(startConn.branch[i]);
    }
  }

  // Find start and end on SZR Corridor
  const startIdx = findClosestIndex(startConn.corridorPoint, SZR_CORRIDOR);
  const endIdx = findClosestIndex(endConn.corridorPoint, SZR_CORRIDOR);

  if (startIdx <= endIdx) {
    for (let i = startIdx; i <= endIdx; i++) {
      route.push(SZR_CORRIDOR[i]);
    }
  } else {
    for (let i = startIdx; i >= endIdx; i--) {
      route.push(SZR_CORRIDOR[i]);
    }
  }

  // If destination is on a branch, walk through branch to destination
  if (endConn.branch.length > 0) {
    const branchEndIdx = findClosestIndex(endLngLat, endConn.branch);
    for (let i = endConn.branch.length - 1; i >= branchEndIdx; i--) {
      route.push(endConn.branch[i]);
    }
  }

  route.push(endLngLat);

  // Deduplicate adjacent points
  const cleanRoute: [number, number][] = [];
  for (let i = 0; i < route.length; i++) {
    if (i === 0 || geoDistance(route[i], cleanRoute[cleanRoute.length - 1]) > 0.0001) {
      cleanRoute.push(route[i]);
    }
  }

  return cleanRoute;
}

/**
 * Fetches turn-by-turn road route via OSRM with instant, reliable local corridor fallback.
 */
export async function fetchDubaiRoadRoute(
  pickup: LocationPoint,
  destination: LocationPoint
): Promise<[number, number][]> {
  const start: [number, number] = [pickup.lng, pickup.lat];
  const end: [number, number] = [destination.lng, destination.lat];

  const localFallback = generateDubaiRoadRoute(start, end);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
        return data.routes[0].geometry.coordinates as [number, number][];
      }
    }
  } catch {
    // Graceful offline fallback
  }

  return localFallback;
}

/**
 * Calculates compass bearing (angle in degrees 0-360) between two coordinates
 */
export function calculateBearing(start: [number, number], end: [number, number]): number {
  const startLng = (start[0] * Math.PI) / 180;
  const startLat = (start[1] * Math.PI) / 180;
  const endLng = (end[0] * Math.PI) / 180;
  const endLat = (end[1] * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Interpolates vehicle position & heading along a coordinate polyline
 */
export function interpolateRoutePosition(
  coordinates: [number, number][],
  progressPercent: number
): { lng: number; lat: number; bearing: number; index: number } {
  if (!coordinates || coordinates.length === 0) {
    return { lng: 55.2744, lat: 25.1972, bearing: 0, index: 0 };
  }
  if (coordinates.length === 1) {
    return { lng: coordinates[0][0], lat: coordinates[0][1], bearing: 0, index: 0 };
  }

  // Calculate segment lengths
  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const len = geoDistance(coordinates[i], coordinates[i + 1]);
    segmentLengths.push(len);
    totalLength += len;
  }

  if (totalLength === 0) {
    return { lng: coordinates[0][0], lat: coordinates[0][1], bearing: 0, index: 0 };
  }

  const targetDist = (Math.min(100, Math.max(0, progressPercent)) / 100) * totalLength;

  let accumulated = 0;
  for (let i = 0; i < segmentLengths.length; i++) {
    const nextAcc = accumulated + segmentLengths[i];
    if (targetDist <= nextAcc || i === segmentLengths.length - 1) {
      const segFraction = segmentLengths[i] > 0 ? (targetDist - accumulated) / segmentLengths[i] : 0;
      const p1 = coordinates[i];
      const p2 = coordinates[i + 1];

      const lng = p1[0] + (p2[0] - p1[0]) * segFraction;
      const lat = p1[1] + (p2[1] - p1[1]) * segFraction;
      const bearing = calculateBearing(p1, p2);

      return { lng, lat, bearing, index: i };
    }
    accumulated = nextAcc;
  }

  const last = coordinates[coordinates.length - 1];
  const secondLast = coordinates[coordinates.length - 2];
  return {
    lng: last[0],
    lat: last[1],
    bearing: calculateBearing(secondLast, last),
    index: coordinates.length - 1,
  };
}

/**
 * Generates nearby simulated Dubai chauffeur vehicles around a geographic center
 */
export function getNearbyDubaiTaxis(center: { lat: number; lng: number }): NearbyTaxiMarker[] {
  // Deterministic realistic offsets placed along local Dubai road grid
  return [
    {
      id: 'taxi-near-1',
      tier: 'standard',
      lat: center.lat + 0.0035,
      lng: center.lng + 0.0028,
      bearing: 42,
      driverName: 'Rashid Al-Maktoum',
      plate: 'DXB - R 4829',
      model: 'Tesla Model 3',
    },
    {
      id: 'taxi-near-2',
      tier: 'comfort',
      lat: center.lat - 0.0042,
      lng: center.lng + 0.0031,
      bearing: 195,
      driverName: 'Tariq Mansoor',
      plate: 'DXB - K 1904',
      model: 'BMW 530i',
    },
    {
      id: 'taxi-near-3',
      tier: 'xl',
      lat: center.lat + 0.0021,
      lng: center.lng - 0.0045,
      bearing: 120,
      driverName: 'Jean-Luc Moreau',
      plate: 'DXB - VIP 77',
      model: 'Mercedes V-Class',
    },
    {
      id: 'taxi-near-4',
      tier: 'standard',
      lat: center.lat - 0.0028,
      lng: center.lng - 0.0032,
      bearing: 310,
      driverName: 'Fahad Al-Qasimi',
      plate: 'DXB - M 8201',
      model: 'Lexus ES 300h',
    },
    {
      id: 'taxi-near-5',
      tier: 'comfort',
      lat: center.lat + 0.0055,
      lng: center.lng - 0.0018,
      bearing: 260,
      driverName: 'Zayed Al-Nahyan',
      plate: 'DXB - S 3341',
      model: 'Audi A6 Quattro',
    },
  ];
}
