import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpDown, Clock, MapPin, Search, X } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { DUBAI_LOCATIONS } from '../../data/seedData';
import { calculateEstimatedMinutes, calculateSimulatedDistance } from '../../utils/calc';
import { LocationPoint } from '../../types';

export const DestinationScreen: React.FC = () => {
  const { pickup, destination, setDestination, swapLocations, setScreen } = useRide();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Destinations' },
    { id: 'landmark', label: 'Landmarks' },
    { id: 'airport', label: 'Airports' },
    { id: 'business', label: 'Business' },
    { id: 'leisure', label: 'Beach & Leisure' },
  ];

  const currentPickup = pickup || DUBAI_LOCATIONS[0];

  const filteredLocations = DUBAI_LOCATIONS.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelectDestination = (loc: LocationPoint) => {
    if (loc.id === currentPickup.id) {
      setErrorMessage('Destination cannot be identical to your pickup point.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setErrorMessage(null);
    setDestination(loc);
    setScreen('vehicle_select');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-white text-slate-900 flex flex-col justify-between select-none"
    >
      {/* Top Header */}
      <div className="pt-safe px-4 pb-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Where to?</h2>
            <p className="text-xs text-slate-500">Select dropoff destination in Dubai</p>
          </div>
        </div>
      </div>

      {/* Pickup & Destination Interactive Summary Box */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          {/* Pickup Readout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                  Pickup Point
                </span>
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {currentPickup.name}
                </span>
              </div>
            </div>
            <button
              onClick={() => setScreen('pickup_select')}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold ml-2 shrink-0"
            >
              Change
            </button>
          </div>

          <div className="border-t border-slate-100 flex items-center justify-between pt-2.5">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                  Destination
                </span>
                <span className="text-xs font-bold text-slate-500 truncate block">
                  {destination ? destination.name : 'Select from list below'}
                </span>
              </div>
            </div>
            <motion.button
              whileTap={{ rotate: 180, scale: 0.9 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              onClick={swapLocations}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
              title="Swap pickup and destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination, hotel, mall, airport..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Destinations List with real-time calculated distance & ETA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredLocations.map((loc) => {
          const isSelected = destination?.id === loc.id;
          const isSameAsPickup = currentPickup.id === loc.id;
          const distKm = calculateSimulatedDistance(currentPickup, loc);
          const etaMins = calculateEstimatedMinutes(distKm);

          return (
            <motion.button
              key={loc.id}
              whileTap={isSameAsPickup ? undefined : { scale: 0.985 }}
              onClick={() => handleSelectDestination(loc)}
              disabled={isSameAsPickup}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-500 shadow-sm'
                  : isSameAsPickup
                  ? 'bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3 truncate">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{loc.name}</p>
                    {isSameAsPickup && (
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                        Current Pickup
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{loc.area}</p>
                  <p className="text-[10px] text-slate-400 truncate">{loc.description}</p>
                </div>
              </div>

              {!isSameAsPickup && (
                <div className="text-right shrink-0 ml-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-mono text-[11px] font-bold">
                    {distKm} km
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 mt-1 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>~{etaMins}m</span>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
