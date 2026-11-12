import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  FastForward,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { PremiumCityMap } from '../map/PremiumCityMap';
import { DriverChatModal } from '../common/DriverChatModal';

export const DriverArrivingScreen: React.FC = () => {
  const { currentBooking, advanceDemo, setIsChatOpen, sendChatMessage, setScreen, startSimulatedCall } = useRide();
  const [quickSent, setQuickSent] = useState<string | null>(null);

  if (!currentBooking || !currentBooking.driver) return null;

  const driver = currentBooking.driver;

  const handleQuickSend = (text: string) => {
    sendChatMessage(text);
    setQuickSent(text);
    setTimeout(() => setQuickSent(null), 2500);
  };

  const progressPercent = currentBooking.progress || 0;
  const etaText = progressPercent > 80 ? 'ARRIVING NOW' : progressPercent > 40 ? '~1 MIN' : '~2 MINS';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none relative">
      {/* Top Banner */}
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
            <h2 className="text-sm font-black text-slate-900">Chauffeur Arriving</h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black font-mono shadow-xs">
          <span>{etaText}</span>
        </div>
      </div>

      {/* Vector Map with Moving Vehicle */}
      <div className="flex-1 bg-[#EEF2F6] relative overflow-hidden">
        <PremiumCityMap
          pickup={currentBooking.pickup}
          destination={currentBooking.destination}
          booking={currentBooking}
        />

        {/* Floating Arrival Indicator */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute top-4 left-4 right-4 z-10"
        >
          <div className="p-3.5 rounded-3xl bg-white/95 border border-slate-200 shadow-premium backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-600">
                <Car className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Pulling up to Pickup Zone</p>
                <p className="text-[10px] text-slate-500">Look for {driver.vehicleModel}</p>
              </div>
            </div>
            <span className="font-mono text-xs font-black text-slate-900 bg-amber-400 px-2.5 py-1 rounded-lg shadow-xs">
              {driver.plateNumber}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Chauffeur Control Deck */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="p-4 bg-white border-t border-slate-100 space-y-3 z-20 pb-safe shadow-sheet"
      >
        {/* Quick Message Chips to Driver */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickSend("I'm heading down to the lobby now")}
            className="shrink-0 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3.5 py-1.5 rounded-full border border-slate-200 transition"
          >
            👋 Heading down now
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickSend('Waiting right at Main Entrance')}
            className="shrink-0 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3.5 py-1.5 rounded-full border border-slate-200 transition"
          >
            📍 Waiting at Entrance
          </motion.button>
        </div>

        {quickSent && (
          <p className="text-[11px] text-emerald-600 font-bold animate-in fade-in">
            ✓ Sent to {driver.name}: &ldquo;{quickSent}&rdquo;
          </p>
        )}

        {/* Driver Summary */}
        <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={driver.photoUrl}
              alt={driver.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-400"
            />
            <div>
              <p className="text-xs font-black text-slate-900">{driver.name}</p>
              <p className="text-[10px] text-slate-500">{driver.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(true)}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => startSimulatedCall(driver)}
              className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-center transition shadow-xs"
              title="Call Driver"
            >
              <Phone className="w-4 h-4 text-amber-400" />
            </motion.button>
          </div>
        </div>

        {/* Action Button: Start Trip */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={advanceDemo}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow-premium flex items-center justify-center gap-2 transition"
        >
          <span>Passenger Boarded • Start Trip</span>
        </motion.button>
      </motion.div>

      <DriverChatModal />
    </div>
  );
};
