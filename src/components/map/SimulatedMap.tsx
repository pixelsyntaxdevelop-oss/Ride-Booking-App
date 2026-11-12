import React, { useMemo, useState } from 'react';
import { Compass, Layers, MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { BookingState, LocationPoint } from '../../types';

interface Props {
  pickup?: LocationPoint | null;
  destination?: LocationPoint | null;
  booking?: BookingState | null;
  interactive?: boolean;
  onSelectPoint?: (point: LocationPoint) => void;
  className?: string;
  showAllLandmarks?: boolean;
}

export const SimulatedMap: React.FC<Props> = ({
  pickup,
  destination,
  booking,
  interactive = true,
  onSelectPoint,
  className = '',
  showAllLandmarks = true,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'standard' | 'night' | 'satellite'>('night');

  // Calculate route curve points between pickup and destination
  const routePath = useMemo(() => {
    if (!pickup || !destination) return null;

    const p1 = pickup;
    const p2 = destination;

    // Build realistic road-like waypoint curve avoiding straight flight line
    // Dubai roads generally curve along Sheikh Zayed Road (SE to NW axis)
    const midX = (p1.x + p2.x) / 2 + (p1.y > p2.y ? -40 : 40);
    const midY = (p1.y + p2.y) / 2 + (p1.x > p2.x ? 30 : -30);

    return {
      d: `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`,
      start: p1,
      end: p2,
      control: { x: midX, y: midY },
    };
  }, [pickup, destination]);

  // Compute animated car coordinates along Quadratic Bezier curve based on booking.progress (0-100)
  const carPosition = useMemo(() => {
    if (!routePath || !booking) return null;

    let t = Math.max(0, Math.min(100, booking.progress)) / 100;

    // In 'arriving' state, car approaches the pickup point
    if (booking.status === 'arriving') {
      const approachStart = { x: routePath.start.x - 70, y: routePath.start.y + 40 };
      const currentX = approachStart.x + (routePath.start.x - approachStart.x) * t;
      const currentY = approachStart.y + (routePath.start.y - approachStart.y) * t;
      const angle = Math.atan2(routePath.start.y - approachStart.y, routePath.start.x - approachStart.x) * (180 / Math.PI);
      return { x: currentX, y: currentY, angle: angle + 90 };
    }

    // In 'in_progress' state, car moves along the Bezier curve
    const { start, control, end } = routePath;
    const invT = 1 - t;
    const x = invT * invT * start.x + 2 * invT * t * control.x + t * t * end.x;
    const y = invT * invT * start.y + 2 * invT * t * control.y + t * t * end.y;

    // Tangent derivative for car heading angle
    const dx = 2 * invT * (control.x - start.x) + 2 * t * (end.x - control.x);
    const dy = 2 * invT * (control.y - start.y) + 2 * t * (end.y - control.y);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return { x, y, angle: angle + 90 };
  }, [routePath, booking]);

  // Idle simulated ambient taxis driving around
  const ambientTaxis = useMemo(
    () => [
      { id: 't1', x: 420, y: 360, angle: 45, label: 'Tesla 3' },
      { id: 't2', x: 280, y: 640, angle: 135, label: 'Lexus ES' },
      { id: 't3', x: 580, y: 260, angle: -45, label: 'BMW 5' },
      { id: 't4', x: 730, y: 220, angle: 90, label: 'Merc V' },
      { id: 't5', x: 360, y: 490, angle: -120, label: 'Tesla Y' },
    ],
    []
  );

  return (
    <div
      className={`relative w-full h-full min-h-[280px] bg-[#070D18] overflow-hidden select-none ${className}`}
    >
      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 1000 900"
        className="w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: pickup ? `${pickup.x}px ${pickup.y}px` : '50% 50%',
        }}
      >
        <defs>
          {/* Persian Gulf Water Gradient */}
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="70%" y2="70%">
            <stop offset="0%" stopColor="#05192D" />
            <stop offset="70%" stopColor="#08233C" />
            <stop offset="100%" stopColor="#0B2B47" />
          </linearGradient>

          {/* Urban Land Gradient */}
          <linearGradient id="landGrad" x1="30%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1425" />
            <stop offset="50%" stopColor="#0E1A30" />
            <stop offset="100%" stopColor="#080F1C" />
          </linearGradient>

          {/* Glowing Route Gradient */}
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>

          {/* Filter glow effect */}
          <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Base Landmass */}
        <rect width="1000" height="900" fill="url(#landGrad)" />

        {/* 2. Persian Gulf Coastline (North-West) */}
        <path
          d="M 0 0 L 380 0 C 330 180 250 350 180 480 C 120 590 60 720 0 850 Z"
          fill="url(#waterGrad)"
          stroke="#0284C7"
          strokeWidth="2"
          strokeOpacity="0.4"
        />

        {/* 3. Palm Jumeirah Stylized Fronds */}
        <g opacity="0.85">
          {/* Crescent */}
          <path
            d="M 80 490 C 130 460 210 470 230 520 C 240 560 190 610 130 610 C 90 600 70 540 80 490 Z"
            fill="none"
            stroke="#0284C7"
            strokeWidth="8"
            strokeOpacity="0.4"
          />
          {/* Trunk */}
          <path d="M 120 580 L 160 550" stroke="#0284C7" strokeWidth="6" strokeOpacity="0.6" />
          {/* Fronds */}
          <path d="M 130 550 Q 110 520 90 530" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.5" />
          <path d="M 140 540 Q 150 510 170 510" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.5" />
          <path d="M 150 540 Q 180 520 200 530" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.5" />
          <path d="M 160 550 Q 190 550 205 570" stroke="#0284C7" strokeWidth="3" strokeOpacity="0.5" />
        </g>

        {/* 4. Dubai Creek / Water Canal */}
        <path
          d="M 180 480 Q 320 440 450 440 T 600 370 Q 750 300 880 260"
          fill="none"
          stroke="#075985"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 180 480 Q 320 440 450 440 T 600 370 Q 750 300 880 260"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeDasharray="12 8"
          opacity="0.4"
        />

        {/* 5. Parks & Green Reserves */}
        {/* Safa Park */}
        <rect x="360" y="420" width="55" height="40" rx="10" fill="#064E3B" opacity="0.45" stroke="#059669" strokeWidth="1" />
        <text x="388" y="445" fill="#34D399" fontSize="10" fontWeight="600" textAnchor="middle" opacity="0.7">Safa</text>

        {/* Zabeel Park */}
        <ellipse cx="620" cy="270" rx="35" ry="25" fill="#064E3B" opacity="0.45" stroke="#059669" strokeWidth="1" />
        <text x="620" y="274" fill="#34D399" fontSize="10" fontWeight="600" textAnchor="middle" opacity="0.7">Zabeel</text>

        {/* Dubai Hills Park */}
        <rect x="380" y="580" width="70" height="45" rx="12" fill="#064E3B" opacity="0.4" stroke="#059669" strokeWidth="1" />
        <text x="415" y="607" fill="#34D399" fontSize="10" fontWeight="600" textAnchor="middle" opacity="0.7">Hills Park</text>

        {/* 6. City Street Grid (Secondary Roads) */}
        <g stroke="#1E293B" strokeWidth="2.5" opacity="0.55">
          {/* Horizontal / diagonal grid */}
          <line x1="100" y1="200" x2="900" y2="200" />
          <line x1="200" y1="350" x2="950" y2="350" />
          <line x1="150" y1="500" x2="950" y2="500" />
          <line x1="150" y1="650" x2="850" y2="650" />
          <line x1="100" y1="780" x2="800" y2="780" />

          {/* Vertical / perpendicular grid */}
          <line x1="300" y1="50" x2="300" y2="850" />
          <line x1="450" y1="50" x2="450" y2="850" />
          <line x1="600" y1="50" x2="600" y2="850" />
          <line x1="750" y1="50" x2="750" y2="850" />
          <line x1="900" y1="50" x2="900" y2="850" />

          {/* Marina Loop */}
          <circle cx="230" cy="690" r="50" fill="none" stroke="#1E293B" strokeWidth="3" />
          {/* Downtown Loop */}
          <ellipse cx="490" cy="385" rx="60" ry="45" fill="none" stroke="#1E293B" strokeWidth="3" />
        </g>

        {/* 7. Arterial Highways (Al Khail E44) */}
        <path
          d="M 120 850 L 360 620 L 530 420 L 710 240 L 920 120"
          fill="none"
          stroke="#334155"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 120 850 L 360 620 L 530 420 L 710 240 L 920 120"
          fill="none"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />

        {/* 8. Sheikh Zayed Road (E11) - Iconic Major Highway */}
        <path
          d="M 160 820 L 260 680 L 480 390 L 610 260 L 850 140"
          fill="none"
          stroke="#0F172A"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 160 820 L 260 680 L 480 390 L 610 260 L 850 140"
          fill="none"
          stroke="#2563EB"
          strokeWidth="7"
          opacity="0.85"
          strokeLinecap="round"
        />
        <path
          d="M 160 820 L 260 680 L 480 390 L 610 260 L 850 140"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="1.8"
          strokeDasharray="14 10"
        />

        {/* Sheikh Zayed Road Highway label */}
        <text
          x="340"
          y="545"
          transform="rotate(-48 340 545)"
          fill="#93C5FD"
          fontSize="11"
          fontWeight="700"
          letterSpacing="2"
          opacity="0.8"
        >
          SHEIKH ZAYED RD (E11)
        </text>

        {/* 9. Ambient Scattered Taxis (Pulse) */}
        {ambientTaxis.map((tax) => (
          <g key={tax.id} transform={`translate(${tax.x}, ${tax.y}) rotate(${tax.angle})`}>
            {/* Halo pulse */}
            <circle cx="0" cy="0" r="14" fill="#2563EB" opacity="0.18" />
            {/* Tiny car icon */}
            <rect x="-5" y="-9" width="10" height="18" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.2" />
            <circle cx="-3" cy="-4" r="1.5" fill="#F8FAFC" />
            <circle cx="3" cy="-4" r="1.5" fill="#F8FAFC" />
            <circle cx="-3" cy="5" r="1.5" fill="#EF4444" />
            <circle cx="3" cy="5" r="1.5" fill="#EF4444" />
          </g>
        ))}

        {/* 10. Active Simulated Trip Route Polyline */}
        {routePath && (
          <g>
            {/* Outer neon road glow */}
            <path
              d={routePath.d}
              fill="none"
              stroke="#2563EB"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.3"
              filter="url(#superGlow)"
            />
            {/* Main vibrant path */}
            <path
              d={routePath.d}
              fill="none"
              stroke="url(#routeGlow)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Flowing animated dash pulses */}
            <path
              d={routePath.d}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10 14"
              className="animate-[dash_1s_linear_infinite]"
            />
          </g>
        )}

        {/* 11. Landmarks on Map */}
        {showAllLandmarks &&
          !pickup &&
          !destination && (
            <g>
              {/* Burj Khalifa Icon */}
              <g transform="translate(480, 380)">
                <circle cx="0" cy="0" r="8" fill="#3B82F6" opacity="0.9" />
                <path d="M 0 -18 L 4 0 L -4 0 Z" fill="#60A5FA" />
                <text x="14" y="4" fill="#F8FAFC" fontSize="12" fontWeight="700">Burj Khalifa</text>
              </g>

              {/* DXB Airport */}
              <g transform="translate(820, 190)">
                <circle cx="0" cy="0" r="7" fill="#6366F1" />
                <text x="-12" y="18" fill="#C7D2FE" fontSize="11" fontWeight="600" textAnchor="end">DXB Airport T3</text>
              </g>

              {/* Dubai Marina */}
              <g transform="translate(230, 690)">
                <circle cx="0" cy="0" r="7" fill="#06B6D4" />
                <text x="14" y="4" fill="#A5F3FC" fontSize="11" fontWeight="600">Dubai Marina</text>
              </g>
            </g>
          )}

        {/* 12. Pickup Pin (Green Halo) */}
        {pickup && (
          <g transform={`translate(${pickup.x}, ${pickup.y})`}>
            {/* Radar wave pulse */}
            <circle cx="0" cy="0" r="28" fill="#10B981" opacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="16" fill="#10B981" opacity="0.4" />
            {/* Outer rim */}
            <circle cx="0" cy="0" r="10" fill="#064E3B" stroke="#10B981" strokeWidth="3" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            {/* Floating Label */}
            <g transform="translate(0, -32)">
              <rect x="-60" y="-14" width="120" height="24" rx="6" fill="#0B1425" stroke="#10B981" strokeWidth="1.5" />
              <text x="0" y="3" fill="#10B981" fontSize="10" fontWeight="700" textAnchor="middle">
                PICKUP ZONE
              </text>
            </g>
          </g>
        )}

        {/* 13. Destination Pin (Electric Blue/Red Pin) */}
        {destination && (
          <g transform={`translate(${destination.x}, ${destination.y})`}>
            {/* Halo pulse */}
            <circle cx="0" cy="0" r="24" fill="#EF4444" opacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#EF4444" opacity="0.4" />
            {/* Pin head */}
            <path
              d="M 0 0 C -8 -8 -12 -16 -12 -22 C -12 -30 -6 -36 0 -36 C 6 -36 12 -30 12 -22 C 12 -16 8 -8 0 0 Z"
              fill="#EF4444"
              stroke="#FEE2E2"
              strokeWidth="1.5"
            />
            <circle cx="0" cy="-22" r="4.5" fill="#FFFFFF" />
            {/* Floating Label */}
            <g transform="translate(0, -50)">
              <rect x="-60" y="-14" width="120" height="24" rx="6" fill="#0B1425" stroke="#EF4444" strokeWidth="1.5" />
              <text x="0" y="3" fill="#FCA5A5" fontSize="10" fontWeight="700" textAnchor="middle">
                DESTINATION
              </text>
            </g>
          </g>
        )}

        {/* 14. Animated Moving Taxi on Route */}
        {carPosition && (
          <g
            transform={`translate(${carPosition.x}, ${carPosition.y}) rotate(${carPosition.angle})`}
            className="transition-all duration-300"
          >
            {/* Headlights beam into road */}
            <polygon
              points="0,-18 -24,-60 24,-60"
              fill="url(#routeGlow)"
              opacity="0.25"
            />
            {/* Glow backing */}
            <rect
              x="-14"
              y="-24"
              width="28"
              height="48"
              rx="9"
              fill="#2563EB"
              filter="url(#neonBlur)"
              opacity="0.8"
            />
            {/* Car body */}
            <rect
              x="-12"
              y="-22"
              width="24"
              height="44"
              rx="7"
              fill="#0F172A"
              stroke="#60A5FA"
              strokeWidth="2"
            />
            {/* Windshield */}
            <path
              d="M -8 -10 L 8 -10 L 6 -2 L -6 -2 Z"
              fill="#38BDF8"
              opacity="0.9"
            />
            {/* Rear window */}
            <path
              d="M -7 10 L 7 10 L 6 15 L -6 15 Z"
              fill="#38BDF8"
              opacity="0.7"
            />
            {/* Taxi Top Roof Light */}
            <rect x="-5" y="-1" width="10" height="4" rx="1.5" fill="#F59E0B" />
            {/* Tail lights */}
            <circle cx="-9" cy="19" r="2.5" fill="#EF4444" />
            <circle cx="9" cy="19" r="2.5" fill="#EF4444" />
            {/* Head lights */}
            <circle cx="-9" cy="-19" r="2.5" fill="#FEF08A" />
            <circle cx="9" cy="-19" r="2.5" fill="#FEF08A" />
          </g>
        )}
      </svg>

      {/* Map Overlay Badges */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B1425]/90 border border-blue-500/30 text-[11px] font-semibold text-blue-300 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Simulated Demo Route • Dubai</span>
        </div>
      </div>

      {/* Map Control Tools (Zoom & Layer toggle) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button
          onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
          aria-label="Zoom in"
          className="w-8 h-8 rounded-xl bg-[#0B1425]/90 border border-slate-700 hover:border-blue-500/50 flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
          aria-label="Zoom out"
          className="w-8 h-8 rounded-xl bg-[#0B1425]/90 border border-slate-700 hover:border-blue-500/50 flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          aria-label="Reset orientation"
          className="w-8 h-8 rounded-xl bg-[#0B1425]/90 border border-slate-700 hover:border-blue-500/50 flex items-center justify-center text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
