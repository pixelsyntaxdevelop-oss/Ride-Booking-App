import React, { useState } from 'react';
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  HelpCircle,
  Percent,
  Plus,
  Shield,
  Sparkles,
  Tag,
  Wallet,
  X,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { PAYMENT_METHODS } from '../../data/seedData';
import { calculateEstimatedMinutes, calculateFare, calculateSimulatedDistance } from '../../utils/calc';
import { PaymentMethod } from '../../types';

export const FareConfirmScreen: React.FC = () => {
  const {
    pickup,
    destination,
    selectedVehicle,
    selectedPayment,
    setSelectedPayment,
    promoInput,
    setPromoInput,
    appliedPromo,
    applyPromo,
    removePromo,
    startBooking,
    setScreen,
  } = useRide();

  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');

  if (!pickup || !destination) {
    setScreen('home');
    return null;
  }

  const distanceKm = calculateSimulatedDistance(pickup, destination);
  const estimatedMins = calculateEstimatedMinutes(distanceKm);

  const fareBreakdown = calculateFare(
    selectedVehicle,
    distanceKm,
    appliedPromo?.discountPercent || 0,
    appliedPromo?.maxDiscountAED || 0
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
  };

  const handleAddCustomDemoCard = (e: React.FormEvent) => {
    e.preventDefault();
    const last4 = newCardNumber.replace(/\D/g, '').slice(-4) || '9912';
    const customCard: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: 'demo_card',
      title: `Demo Card •••• ${last4}`,
      details: 'Active (Simulated Sandbox Card)',
      iconName: 'CreditCard',
    };
    setSelectedPayment(customCard);
    setShowAddCardModal(false);
    setNewCardNumber('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="pt-safe px-4 pb-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('vehicle_select')}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900">Review & Confirm</h2>
            <p className="text-[11px] text-slate-500">Transparent AED Fare Breakdown</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
          {selectedVehicle.name}
        </span>
      </div>

      {/* Main Breakdown Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Route Summary */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-slate-100 mt-1.5 shrink-0" />
            <div className="truncate flex-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pickup</p>
              <p className="text-xs font-bold text-slate-900 truncate">{pickup.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{pickup.area}</p>
            </div>
          </div>

          <div className="ml-1 pl-3.5 border-l-2 border-dashed border-slate-200 text-[11px] text-amber-600 font-bold py-0.5">
            {distanceKm} km • ~{estimatedMins} mins via Sheikh Zayed Rd
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100 mt-1.5 shrink-0" />
            <div className="truncate flex-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Destination</p>
              <p className="text-xs font-bold text-slate-900 truncate">{destination.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{destination.area}</p>
            </div>
          </div>
        </div>

        {/* Itemized Fare Card */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Itemized Fare Breakdown</span>
            <span className="text-[10px] font-bold text-slate-400">All prices in AED</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Fare ({selectedVehicle.name})</span>
              <span className="font-mono font-bold text-slate-800">AED {fareBreakdown.baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>
                Distance Fare ({distanceKm} km × AED {selectedVehicle.perKmRateAED.toFixed(2)})
              </span>
              <span className="font-mono font-bold text-slate-800">AED {fareBreakdown.distanceFare.toFixed(2)}</span>
            </div>
            {fareBreakdown.salikToll > 0 && (
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  Salik Toll Gate (Automated)
                  <span title="Dubai RTA Toll Gate fee">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                </span>
                <span className="font-mono font-bold text-slate-800">AED {fareBreakdown.salikToll.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Platform Booking & Safety Fee</span>
              <span className="font-mono font-bold text-slate-800">AED {fareBreakdown.serviceFee.toFixed(2)}</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-500" />
                  Promo ({appliedPromo.code} -{appliedPromo.discountPercent}%)
                </span>
                <span className="font-mono">-AED {fareBreakdown.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <p className="text-sm font-black text-slate-900">Total Estimated Fare</p>
                <p className="text-[10px] text-slate-400">Includes 5% UAE VAT & Tolls</p>
              </div>
              <span className="text-xl font-black text-slate-900 font-mono">
                AED {fareBreakdown.totalAED.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
            Promo Code
          </label>
          {appliedPromo ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercent}% off)
                </span>
              </div>
              <button
                onClick={removePromo}
                className="text-slate-400 hover:text-slate-700 p-1"
                title="Remove Promo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Try: PIXELSYNTAX or WELCOME20"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition active:scale-95"
              >
                Apply
              </button>
            </form>
          )}

          {promoMessage && (
            <p
              className={`text-[11px] font-medium ${
                promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {promoMessage.text}
            </p>
          )}
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Payment Method
            </span>
            <button
              onClick={() => setShowAddCardModal(true)}
              className="text-[11px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Demo Card
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = selectedPayment.id === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-amber-50/50 border-amber-400 shadow-xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {pm.type === 'demo_card' && <CreditCard className="w-4 h-4" />}
                      {pm.type === 'cash' && <Banknote className="w-4 h-4" />}
                      {pm.type === 'wallet' && <Wallet className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{pm.title}</p>
                      <p className="text-[10px] text-slate-500">{pm.details}</p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-amber-500 bg-amber-400' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Showcase Guarantee Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Demo Sandbox Mode:</strong> Real payment processors are completely bypassed. Tap Confirm below to simulate dispatching a chauffeur.
          </span>
        </div>
      </div>

      {/* Add Custom Demo Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                Add Demo Payment Card
              </h3>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCustomDemoCard} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Card Number (Simulated)
                </label>
                <input
                  type="text"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  placeholder="4000 1234 5678 9010"
                  maxLength={19}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Any dummy digits can be entered to test wallet/card selection.
              </p>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition active:scale-95"
              >
                Save Demo Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Sticky Book Action */}
      <div className="p-4 bg-white border-t border-slate-100 pb-safe shadow-sheet">
        <button
          onClick={startBooking}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-premium active:scale-98 transition flex items-center justify-center gap-2"
        >
          <span>Confirm & Book Pixel Ride (AED {fareBreakdown.totalAED.toFixed(2)})</span>
        </button>
      </div>
    </div>
  );
};
