import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Briefcase, Check, Clock, ShieldCheck, Users, Zap } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { VEHICLE_OPTIONS } from '../../data/seedData';
import { calculateEstimatedMinutes, calculateFare, calculateSimulatedDistance } from '../../utils/calc';
import { PremiumCityMap } from '../map/PremiumCityMap';
import { CarIllustration } from '../brand/CarIllustrations';

export const VehicleSelectionScreen: React.FC = () => {
  const { pickup, destination, selectedVehicle, setSelectedVehicle, setScreen } = useRide();

  if (!pickup || !destination) {
    setScreen('home');
    return null;
  }

  const distanceKm = calculateSimulatedDistance(pickup, destination);
  const estimatedMins = calculateEstimatedMinutes(distanceKm);
  const currentFareObj = calculateFare(selectedVehicle, distanceKm);

  return (
    <div className="relative w-full h-screen bg-[#F8FAFC] text-slate-900 flex flex-col overflow-hidden select-none">
      {/* 1. Full-Height 2.5D Route Map Preview */}
      <div className="absolute inset-0 z-0">
        <PremiumCityMap pickup={pickup} destination={destination} showAllLandmarks={false} />
      </div>

      {/* 2. Top Route Info Island (Floating) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 px-4 pt-safe mt-2"
      >
        <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-premium flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <button
              onClick={() => setScreen('dest_select')}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 shrink-0"
              title="Change Destination"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Selected Route
              </span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {pickup.name} → {destination.name}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 ml-2">
            <span className="font-mono text-xs font-bold text-slate-900">{distanceKm} km</span>
            <p className="text-[10px] text-slate-500 font-medium">~{estimatedMins} min</p>
          </div>
        </div>
      </motion.div>

      {/* Spacer pushing sheet to bottom */}
      <div className="flex-1" />

      {/* 3. Native Slidable Vehicle Bottom Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 bg-white rounded-t-3xl shadow-sheet border-t border-slate-100 px-5 pt-3 pb-safe space-y-4 max-h-[62vh] flex flex-col"
      >
        {/* Sheet Grabber */}
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />

        <div className="flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Choose a Ride</h3>
            <p className="text-xs text-slate-500">Curated fleet available across Dubai</p>
          </div>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            Guaranteed Fares
          </span>
        </div>

        {/* Vehicle Selection Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 no-scrollbar">
          {VEHICLE_OPTIONS.map((veh) => {
            const isSelected = selectedVehicle.id === veh.id;
            const fareObj = calculateFare(veh, distanceKm);

            return (
              <motion.div
                key={veh.id}
                whileTap={{ scale: 0.98 }}
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onClick={() => setSelectedVehicle(veh)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between relative ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Vehicle Left: Illustration & Info */}
                <div className="flex items-center gap-3">
                  {/* Bespoke Vector Illustration with floating animation when selected */}
                  <motion.div
                    animate={isSelected ? { y: [0, -3, 0], scale: 1.04 } : { y: 0, scale: 1 }}
                    transition={isSelected ? { y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }, scale: { duration: 0.2 } } : { duration: 0.2 }}
                  >
                    <CarIllustration tier={veh.id} size="lg" />
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{veh.name}</h4>
                      {veh.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white uppercase tracking-wider">
                          {veh.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{veh.models}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-semibold">
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-slate-500" />
                        {veh.passengers} seats
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Briefcase className="w-3 h-3 text-slate-500" />
                        {veh.luggage} bags
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                        <Clock className="w-3 h-3" />
                        {veh.etaMinutes}m away
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Calculated Price & Select Indicator */}
                <div className="text-right shrink-0 ml-2">
                  <motion.span
                    key={fareObj.totalAED}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-base font-extrabold text-slate-900 font-mono block"
                  >
                    AED {fareObj.totalAED.toFixed(2)}
                  </motion.span>
                  <span className="text-[10px] text-slate-400">Fixed rate</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sticky Primary Action Button */}
        <div className="pt-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => setScreen('fare_confirm')}
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm shadow-xl flex items-center justify-between px-6 transition cursor-pointer"
          >
            <span>Continue with {selectedVehicle.name}</span>
            <span className="flex items-center gap-2 font-mono text-amber-400 font-extrabold text-base">
              AED {currentFareObj.totalAED.toFixed(2)}
              <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
