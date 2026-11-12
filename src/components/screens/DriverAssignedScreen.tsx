import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  FastForward,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { PremiumCityMap } from '../map/PremiumCityMap';
import { DriverChatModal } from '../common/DriverChatModal';

export const DriverAssignedScreen: React.FC = () => {
  const { currentBooking, advanceDemo, cancelBooking, setIsChatOpen, setScreen, startSimulatedCall } = useRide();
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!currentBooking || !currentBooking.driver) return null;

  const driver = currentBooking.driver;

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
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm font-black text-slate-900">Chauffeur Assigned</h2>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ETA ~2 mins
        </span>
      </div>

      {/* Vector Map */}
      <div className="flex-1 bg-[#EEF2F6] relative overflow-hidden">
        <PremiumCityMap
          pickup={currentBooking.pickup}
          destination={currentBooking.destination}
          booking={currentBooking}
        />
      </div>

      {/* Driver & Vehicle Details Dock with Spring Entrance */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="p-4 bg-white border-t border-slate-100 space-y-3 z-20 pb-safe shadow-sheet"
      >
        {/* Driver Profile Card */}
        <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={driver.photoUrl}
                alt={driver.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-amber-400 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-amber-400 font-black flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-900">{driver.name}</h3>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  {driver.rating}
                </span>
                <span>•</span>
                <span className="text-slate-400">{driver.totalTrips.toLocaleString()} trips</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">Top Rated UAE Chauffeur</span>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(true)}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-xs"
              title="Message Driver"
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

        {/* Vehicle Badge & License Plate */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <Car className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{driver.vehicleModel}</p>
              <p className="text-[10px] text-slate-400">{driver.vehicleColor}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs font-black text-slate-900 bg-amber-400 px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs tracking-wider">
              {driver.plateNumber}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
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
            className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition"
          >
            <span>Track Driver Approach →</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Driver Chat Modal */}
      <DriverChatModal />

      {/* Cancellation Modal */}
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
            <h3 className="text-base font-black text-slate-900 mb-1">Cancel Ride?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Your chauffeur {driver.name} is already en route. No cancellation fees apply in demo mode.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Keep Ride
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  cancelBooking();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
              >
                Confirm Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
