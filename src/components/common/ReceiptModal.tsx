import React, { useState } from 'react';
import { CheckCircle2, Copy, Download, MapPin, Share2, Star, X } from 'lucide-react';
import { BookingState } from '../../types';

interface Props {
  ride: BookingState | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<Props> = ({ ride, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!ride) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(ride.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Pixel Ride Receipt ${ride.id}`,
        text: `Pixel Ride Trip ${ride.id} from ${ride.pickup.name} to ${ride.destination.name}. Total: AED ${ride.fareBreakdown.totalAED}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyId();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Receipt Header */}
        <div className="bg-slate-50 p-5 text-center relative border-b border-slate-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 border border-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-600 mb-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>

          <h3 className="text-base font-black text-slate-900">Official Ride Receipt</h3>
          <p className="text-xs text-slate-500">Pixel Ride • Pixel Syntax</p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
            <span className="font-mono text-slate-900 font-bold">{ride.id}</span>
            <button
              onClick={handleCopyId}
              className="text-slate-400 hover:text-slate-700 p-0.5"
              title="Copy Ride ID"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Trip Route Details */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-3 h-3 rounded-full bg-slate-900 ring-4 ring-slate-200 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Pickup</p>
                <p className="font-bold text-slate-900">{ride.pickup.name}</p>
                <p className="text-[10px] text-slate-400">{ride.pickup.area}</p>
              </div>
            </div>

            <div className="ml-1.5 pl-3 border-l-2 border-dashed border-slate-200 text-[10px] text-slate-500 py-1 font-medium">
              <span>{ride.distanceKm} km • ~{ride.estimatedMinutes} mins</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Dropoff</p>
                <p className="font-bold text-slate-900">{ride.destination.name}</p>
                <p className="text-[10px] text-slate-400">{ride.destination.area}</p>
              </div>
            </div>
          </div>

          {/* Chauffeur and Vehicle */}
          {ride.driver && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={ride.driver.photoUrl}
                  alt={ride.driver.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-400"
                />
                <div>
                  <p className="font-bold text-slate-900 text-xs">{ride.driver.name}</p>
                  <p className="text-[10px] text-slate-500">{ride.vehicle.name} • {ride.driver.plateNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>{ride.rating || ride.driver.rating}</span>
              </div>
            </div>
          )}

          {/* Itemized Fare Breakdown */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Fare Breakdown</h4>
            <div className="flex justify-between text-slate-600">
              <span>Base Fare</span>
              <span className="font-mono font-bold text-slate-800">AED {ride.fareBreakdown.baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Distance ({ride.distanceKm} km)</span>
              <span className="font-mono font-bold text-slate-800">AED {ride.fareBreakdown.distanceFare.toFixed(2)}</span>
            </div>
            {ride.fareBreakdown.salikToll > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Salik Toll Gate</span>
                <span className="font-mono font-bold text-slate-800">AED {ride.fareBreakdown.salikToll.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Technology & Booking Fee</span>
              <span className="font-mono font-bold text-slate-800">AED {ride.fareBreakdown.serviceFee.toFixed(2)}</span>
            </div>
            {ride.fareBreakdown.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Promo Discount</span>
                <span className="font-mono">-AED {ride.fareBreakdown.discount.toFixed(2)}</span>
              </div>
            )}
            {ride.tipAED ? (
              <div className="flex justify-between text-amber-600 font-bold">
                <span>Chauffeur Tip</span>
                <span className="font-mono">AED {ride.tipAED.toFixed(2)}</span>
              </div>
            ) : null}

            <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 text-sm font-black text-slate-900">
              <span>Total Paid</span>
              <span className="text-base text-slate-900 font-mono">
                AED {(ride.fareBreakdown.totalAED + (ride.tipAED || 0)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            <span>Payment Method:</span>
            <span className="font-bold text-slate-800">{ride.paymentMethod.title}</span>
          </div>

          <div className="text-[10px] text-center text-slate-400">
            Simulated digital invoice for showcase testing. No real money charged.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition active:scale-95 shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
