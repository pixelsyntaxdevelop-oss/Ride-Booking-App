import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  ChevronRight,
  Clock,
  Compass,
  Home as HomeIcon,
  MapPin,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { DUBAI_LOCATIONS } from '../../data/seedData';
import { PremiumCityMap } from '../map/PremiumCityMap';
import { PixelRideLogo } from '../brand/PixelRideLogo';
import { CarIllustration } from '../brand/CarIllustrations';

export const HomeScreen: React.FC = () => {
  const {
    userProfile,
    pickup,
    setPickup,
    setDestination,
    setScreen,
    currentBooking,
  } = useRide();

  const [sheetExpanded, setSheetExpanded] = useState<boolean>(false);

  const handleQuickDestination = (locationId: string) => {
    const loc = DUBAI_LOCATIONS.find((l) => l.id === locationId);
    if (loc) {
      setDestination(loc);
      setScreen('vehicle_select');
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#F8FAFC] text-slate-900 flex flex-col overflow-hidden select-none">
      {/* 1. Immersive Real Dubai MapLibre City Map (Full Screen Background) */}
      <div className="absolute inset-0 z-0">
        <PremiumCityMap pickup={pickup} booking={currentBooking} showAllLandmarks={true} />
      </div>

      {/* 2. Top Header Bar (Floating Translucent Island) */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 px-4 pt-safe mt-2 flex items-center justify-between"
      >
        {/* Brand Monogram */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-premium border border-slate-100">
          <PixelRideLogo size="sm" variant="dark" showSubtitle={false} />
        </div>

        {/* Location / Profile Quick Link */}
        <div className="flex items-center gap-2">
          {/* Dubai Area Chip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-premium border border-slate-100 text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Dubai, UAE</span>
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => setScreen('profile_settings')}
            className="w-10 h-10 rounded-2xl bg-white/95 border border-slate-100 shadow-premium flex items-center justify-center font-bold text-xs text-slate-900 hover:bg-slate-50 transition active:scale-95"
            title="Profile & Settings"
          >
            {userProfile.name.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </motion.header>

      {/* 3. Active Trip Float Banner (If Ride is Active) */}
      {currentBooking && currentBooking.status !== 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-20 px-4 mt-3"
        >
          <div
            onClick={() => {
              if (currentBooking.status === 'searching') setScreen('searching_driver');
              else if (currentBooking.status === 'assigned') setScreen('driver_assigned');
              else if (currentBooking.status === 'arriving') setScreen('driver_arriving');
              else if (currentBooking.status === 'in_progress') setScreen('trip_in_progress');
            }}
            className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl cursor-pointer hover:bg-slate-800 transition flex items-center justify-between border border-slate-700 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <div>
                <p className="text-xs font-bold text-white">Active Chauffeur Booking</p>
                <p className="text-[11px] text-slate-300">
                  {currentBooking.status === 'searching' && 'Matching nearest vehicle in Dubai...'}
                  {currentBooking.status === 'assigned' && 'Driver assigned & confirmed'}
                  {currentBooking.status === 'arriving' && 'Driver arriving at your pickup'}
                  {currentBooking.status === 'in_progress' && 'Trip in progress to destination'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              Resume <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </motion.div>
      )}

      {/* Spacer pushing bottom sheet */}
      <div className="flex-1" />

      {/* 4. Native Draggable Booking Bottom Sheet with Snap Behavior */}
      <motion.div
        drag="y"
        dragConstraints={{ top: -140, bottom: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.y < -50 || info.velocity.y < -200) {
            setSheetExpanded(true);
          } else if (info.offset.y > 50 || info.velocity.y > 200) {
            setSheetExpanded(false);
          }
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 bg-white rounded-t-3xl shadow-sheet border-t border-slate-100 px-5 pt-3 pb-24 space-y-4 max-h-[62vh] overflow-y-auto no-scrollbar touch-pan-y"
      >
        {/* Subtle Sheet Grabber */}
        <div
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto cursor-grab active:cursor-grabbing transition"
        />

        {/* Current Pickup Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-semibold text-slate-900 truncate">
              {pickup?.name || 'Burj Khalifa, Downtown'}
            </span>
          </div>
          <button
            onClick={() => setScreen('pickup_select')}
            className="text-[11px] font-bold text-amber-600 hover:text-amber-700 ml-2 shrink-0"
          >
            Change
          </button>
        </div>

        {/* Prominent "Where to?" Search Bar */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setScreen('dest_select')}
          className="w-full p-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 text-left flex items-center justify-between transition group shadow-xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="block text-base font-black text-slate-900">
                Where to?
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Search Dubai destinations, landmarks, airports
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
        </motion.button>

        {/* Popular Destination Shortcuts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Popular UAE Destinations
          </span>
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleQuickDestination('dxb-airport')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left flex items-center gap-3 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                ✈️
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">DXB Airport T3</p>
                <p className="text-[10px] text-slate-500">Terminal 3 • ~14 km</p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleQuickDestination('dubai-mall')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left flex items-center gap-3 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                🛍️
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">The Dubai Mall</p>
                <p className="text-[10px] text-slate-500">Grand Atrium • ~1 km</p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleQuickDestination('dubai-marina')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left flex items-center gap-3 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                🏖️
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">Dubai Marina</p>
                <p className="text-[10px] text-slate-500">Marina Walk • ~21 km</p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleQuickDestination('difc-gate')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left flex items-center gap-3 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                🏢
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">DIFC Gate</p>
                <p className="text-[10px] text-slate-500">Financial Hub • ~4 km</p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Saved Places (Home & Work) */}
        <div className="flex gap-2 pt-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (userProfile.savedLocations.home) {
                setDestination(userProfile.savedLocations.home);
                setScreen('vehicle_select');
              }
            }}
            className="flex-1 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2.5 text-left transition"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <HomeIcon className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900">Home</p>
              <p className="text-[10px] text-slate-500 truncate">
                {userProfile.savedLocations.home?.name || 'Burj Khalifa'}
              </p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (userProfile.savedLocations.work) {
                setDestination(userProfile.savedLocations.work);
                setScreen('vehicle_select');
              }
            }}
            className="flex-1 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-2.5 text-left transition"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900">Work</p>
              <p className="text-[10px] text-slate-500 truncate">
                {userProfile.savedLocations.work?.name || 'DIFC Gate Building'}
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
