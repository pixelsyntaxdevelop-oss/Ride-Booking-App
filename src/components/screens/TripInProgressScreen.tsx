import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Compass,
  FastForward,
  Gauge,
  MapPin,
  Navigation,
  Share2,
  Shield,
  Wifi,
  Wind,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { PremiumCityMap } from '../map/PremiumCityMap';

export const TripInProgressScreen: React.FC = () => {
  const { currentBooking, advanceDemo, setScreen } = useRide();
  const [copiedShare, setCopiedShare] = useState(false);
  const [liveSpeed, setLiveSpeed] = useState(78);

  // Realistic natural speed fluctuation along highway corridor
  useEffect(() => {
    const speedTimer = setInterval(() => {
      setLiveSpeed(Math.floor(74 + Math.random() * 8));
    }, 2200);
    return () => clearInterval(speedTimer);
  }, []);

  if (!currentBooking) return null;

  const progress = Math.min(100, Math.max(0, currentBooking.progress));
  const remainingKm = Math.max(
    0.2,
    Math.round(currentBooking.distanceKm * (1 - progress / 100) * 10) / 10
  );
  const remainingMins = Math.max(
    1,
    Math.round(currentBooking.estimatedMinutes * (1 - progress / 100))
  );

  const handleShareTrip = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `I am on a Pixel Ride from ${currentBooking.pickup.name} to ${currentBooking.destination.name}. Chauffeur: ${currentBooking.driver?.name} (${currentBooking.driver?.plateNumber}). Track: https://pixelride.demo/trip/${currentBooking.id}`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none relative">
      {/* Top Header */}
      <div className="pt-safe px-4 pb-3 bg-white/95 backdrop-blur-md border-b border-slate-100 z-20 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setScreen('home')}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
            title="Minimize to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm font-black text-slate-900">Trip in Progress</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShareTrip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-bold transition"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-500" />
            <span>{copiedShare ? 'Copied Link!' : 'Share Trip'}</span>
          </motion.button>
        </div>
      </div>

      {/* Vector Map with Moving Vehicle and Camera Tracking */}
      <div className="flex-1 bg-[#EEF2F6] relative overflow-hidden">
        <PremiumCityMap
          pickup={currentBooking.pickup}
          destination={currentBooking.destination}
          booking={currentBooking}
        />

        {/* Live Telemetry Floating HUD */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute top-4 left-4 right-4 z-10"
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-md text-center shadow-premium">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">SPEED</span>
              <span className="text-sm font-mono font-black text-slate-900">{liveSpeed} km/h</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-md text-center shadow-premium">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">REMAINING</span>
              <span className="text-sm font-mono font-black text-amber-600">{remainingKm} km</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-md text-center shadow-premium">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">ARRIVAL</span>
              <span className="text-sm font-mono font-black text-emerald-700">~{remainingMins} min</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Live Trip Deck */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="p-4 bg-white border-t border-slate-100 space-y-3.5 z-20 pb-safe shadow-sheet"
      >
        {/* Route Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>En route via Sheikh Zayed Rd</span>
            <span className="font-mono text-slate-900 font-black">{progress}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-xs"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            />
          </div>
        </div>

        {/* Destination Target Banner */}
        <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Heading To</p>
              <p className="text-xs font-black text-slate-900 truncate">{currentBooking.destination.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentBooking.destination.area}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-black text-slate-900">
              AED {currentBooking.fareBreakdown.totalAED.toFixed(2)}
            </span>
            <p className="text-[10px] text-slate-400 font-medium">{currentBooking.paymentMethod.title}</p>
          </div>
        </div>

        {/* In-Car Amenities */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-amber-500" />
            Wi-Fi: <strong className="text-slate-900 font-bold">PixelRide-VIP</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            Cabin AC: <strong className="text-slate-900 font-bold">21°C</strong>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <Shield className="w-3.5 h-3.5" />
            Safe Trip Active
          </span>
        </div>

        {/* Action Button: Arrive */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={advanceDemo}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-premium flex items-center justify-center gap-2 transition"
        >
          <span>Arrive at Destination • View Receipt</span>
        </motion.button>
      </motion.div>
    </div>
  );
};
