import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Radio, Shield, Sparkles, Users, X } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { PremiumCityMap } from '../map/PremiumCityMap';

export const SearchingDriverScreen: React.FC = () => {
  const { currentBooking, advanceDemo, cancelBooking, setScreen } = useRide();
  const [elapsedSeconds, setElapsedSeconds] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);

  const statusMessages = [
    'Scanning Sheikh Zayed Road corridor...',
    'Locating nearest verified Dubai chauffeurs...',
    'Matching executive vehicle class...',
    'Confirming chauffeur dispatch...',
  ];

  // Cycling status messages
  useEffect(() => {
    const msgTimer = setInterval(() => {
      setStatusMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 1800);
    return () => clearInterval(msgTimer);
  }, [statusMessages.length]);

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentBooking) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none relative overflow-hidden">
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
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <h2 className="text-sm font-black text-slate-900">Matching Chauffeur</h2>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          Ride: {currentBooking.id}
        </span>
      </div>

      {/* Main Map with Multi-Tier Radar Sweep Effect */}
      <div className="relative flex-1 bg-[#EEF2F6] overflow-hidden">
        <PremiumCityMap
          pickup={currentBooking.pickup}
          destination={currentBooking.destination}
          booking={currentBooking}
        />

        {/* Concentric Radar Pulse Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 rounded-full border border-amber-400/20 animate-ping pointer-events-none" />
          <div className="w-52 h-52 rounded-full border-2 border-amber-500/25 animate-pulse pointer-events-none" />
          <div className="w-32 h-32 rounded-full border border-amber-400/40 animate-ping pointer-events-none [animation-delay:1s]" />
          <div className="w-16 h-16 rounded-full bg-amber-400/15 animate-ping pointer-events-none [animation-delay:0.5s]" />
        </div>
      </div>

      {/* Bottom Dispatch Card */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="p-4 bg-white border-t border-slate-100 space-y-3.5 z-20 pb-safe shadow-sheet"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-600 shadow-xs">
              <Radio className="w-5 h-5 animate-pulse text-amber-600" />
            </div>
            <div>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={statusMessageIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-black text-slate-900"
                >
                  {statusMessages[statusMessageIndex]}
                </motion.h3>
              </AnimatePresence>
              <p className="text-[11px] text-slate-500">
                Pinging {currentBooking.vehicle.name} chauffeurs in {currentBooking.pickup.area}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {elapsedSeconds}s
          </span>
        </div>

        {/* Route Details Strip */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <div className="truncate mr-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Destination</span>
            <span className="font-bold text-slate-900 truncate block">{currentBooking.destination.name}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Est. Fare</span>
            <span className="font-black text-slate-900 font-mono">
              AED {currentBooking.fareBreakdown.totalAED.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Controls: Natural Fast-Match button + Cancel */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-600 text-xs font-bold transition"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={advanceDemo}
            className="flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-premium flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Fast Match Chauffeur</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl bg-white border border-rose-200 p-6 shadow-2xl text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <X className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Cancel Ride Request?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to cancel this booking before driver pickup?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Keep Searching
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  cancelBooking();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
              >
                Yes, Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
