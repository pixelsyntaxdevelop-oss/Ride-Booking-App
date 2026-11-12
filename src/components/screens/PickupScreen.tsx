import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Crosshair, MapPin, Search, X } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { DUBAI_LOCATIONS } from '../../data/seedData';
import { LocationPoint } from '../../types';

export const PickupScreen: React.FC = () => {
  const { pickup, setPickup, destination, setScreen } = useRide();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tempPickup, setTempPickup] = useState<LocationPoint>(pickup || DUBAI_LOCATIONS[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Places' },
    { id: 'landmark', label: 'Landmarks' },
    { id: 'airport', label: 'Airports' },
    { id: 'business', label: 'Business' },
    { id: 'leisure', label: 'Beach & Leisure' },
  ];

  const filteredLocations = DUBAI_LOCATIONS.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || loc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelectLocation = (loc: LocationPoint) => {
    if (destination && loc.id === destination.id) {
      setErrorMessage('Pickup cannot be identical to destination.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    setErrorMessage(null);
    setTempPickup(loc);
  };

  const handleConfirm = () => {
    setPickup(tempPickup);
    setScreen('dest_select');
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
            <h2 className="text-base font-extrabold text-slate-900">Set Pickup Location</h2>
            <p className="text-xs text-slate-500">Where should your chauffeur meet you?</p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 space-y-3 bg-slate-50 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search landmarks, malls, airports in Dubai..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
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

        {/* Current Pin Quick Action */}
        <button
          onClick={() => handleSelectLocation(DUBAI_LOCATIONS[0])}
          className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99]"
        >
          <Crosshair className="w-4 h-4 text-emerald-600" />
          <span>Use Current Pin: Burj Khalifa (Downtown)</span>
        </button>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredLocations.map((loc) => {
          const isSelected = tempPickup.id === loc.id;
          const isDestination = destination?.id === loc.id;

          return (
            <motion.button
              key={loc.id}
              whileTap={isDestination ? undefined : { scale: 0.985 }}
              onClick={() => handleSelectLocation(loc)}
              disabled={isDestination}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                  : isDestination
                  ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3 truncate">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{loc.name}</p>
                    {isDestination && (
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                        Current Destination
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{loc.area}</p>
                  <p className="text-[10px] text-slate-400 truncate">{loc.description}</p>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2 shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Sticky Confirm Button */}
      <div className="p-4 bg-white border-t border-slate-100 pb-safe shadow-sheet">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Confirm Pickup: {tempPickup.name}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
