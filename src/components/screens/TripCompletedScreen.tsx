import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Download,
  FileText,
  Heart,
  Home,
  MapPin,
  RotateCcw,
  Share2,
  Star,
  Users,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { ReceiptModal } from '../common/ReceiptModal';

export const TripCompletedScreen: React.FC = () => {
  const { currentBooking, rateTrip, setScreen } = useRide();
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedTip, setSelectedTip] = useState<number>(10);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Clean Car', 'Smooth Driving']);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!currentBooking) return null;

  const compliments = [
    'Clean Car',
    'Smooth Driving',
    'Polite Chauffeur',
    'Great Music',
    'Comfortable AC',
    'Punctual',
  ];

  const tipOptions = [0, 5, 10, 20];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFinish = () => {
    rateTrip(rating, selectedTags, selectedTip);
    setScreen('home');
  };

  const totalWithTip = currentBooking.fareBreakdown.totalAED + selectedTip;
  const activeRating = hoveredStar !== null ? hoveredStar : rating;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="pt-safe px-4 pb-3 bg-white border-b border-slate-100 flex items-center justify-between shadow-xs">
        <h2 className="text-base font-black text-slate-900">Trip Completed</h2>
        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          {currentBooking.id}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Celebration Destination Banner with Success Scale Spring */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="text-center py-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs relative overflow-hidden"
        >
          {/* Subtle Celebration Ripple */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center mb-3 shadow-xs">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 350, damping: 15 }}
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
          </div>
          <h3 className="text-xl font-black text-slate-900">Arrived at Destination</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            You have safely reached {currentBooking.destination.name}
          </p>
          <div className="mt-4 inline-flex items-baseline gap-1.5 text-3xl font-black text-slate-900 font-mono">
            <span>AED {totalWithTip.toFixed(2)}</span>
            <span className="text-xs text-slate-400 font-sans font-medium">
              via {currentBooking.paymentMethod.title}
            </span>
          </div>
        </motion.div>

        {/* View Official Itemized Receipt Trigger */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowReceiptModal(true)}
          className="w-full p-4 rounded-3xl bg-white hover:bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-black text-slate-900 text-xs">View Itemized Digital Receipt</p>
              <p className="text-[10px] text-slate-500">Tolls, distance breakdown, 5% UAE VAT summary</p>
            </div>
          </div>
          <span className="text-amber-600 font-bold text-xs">Open &rarr;</span>
        </motion.button>

        {/* Driver Rating Section */}
        {currentBooking.driver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4 text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <img
                src={currentBooking.driver.photoUrl}
                alt={currentBooking.driver.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400"
              />
              <div className="text-left">
                <p className="text-xs font-black text-slate-900">Rate your chauffeur {currentBooking.driver.name}</p>
                <p className="text-[10px] text-slate-400">{currentBooking.driver.vehicleModel}</p>
              </div>
            </div>

            {/* Interactive 5-Star Row with Micro-Bounce */}
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      activeRating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Compliment Tags */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                What went well?
              </span>
              <div className="flex flex-wrap gap-1.5">
                {compliments.map((comp) => {
                  const isChecked = selectedTags.includes(comp);
                  return (
                    <motion.button
                      key={comp}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleTag(comp)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition ${
                        isChecked
                          ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {comp}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Driver Tip Options with Tactile Toggle */}
            <div className="space-y-1.5 text-left pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Add Chauffeur Tip
                </span>
                <span className="text-[10px] text-amber-600 font-bold">100% goes directly to driver</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {tipOptions.map((tip) => (
                  <motion.button
                    key={tip}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTip(tip)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedTip === tip
                        ? 'bg-amber-400 border-amber-400 text-slate-900 shadow-xs font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tip === 0 ? 'No tip' : `+AED ${tip}`}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-white border-t border-slate-100 pb-safe space-y-2 shadow-sheet">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleFinish}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-premium flex items-center justify-center gap-2 transition"
        >
          <Home className="w-4 h-4" />
          <span>Complete & Return to Home</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            rateTrip(rating, selectedTags, selectedTip);
            setScreen('ride_history');
          }}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          View in Ride History Activity
        </motion.button>
      </div>

      {/* Full Receipt Modal */}
      {showReceiptModal && (
        <ReceiptModal
          ride={{
            ...currentBooking,
            rating,
            ratingFeedback: selectedTags,
            tipAED: selectedTip,
          }}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
