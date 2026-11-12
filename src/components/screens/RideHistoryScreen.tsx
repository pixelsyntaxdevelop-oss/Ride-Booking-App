import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Car,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { BookingState } from '../../types';
import { ReceiptModal } from '../common/ReceiptModal';

export const RideHistoryScreen: React.FC = () => {
  const { rideHistory, setScreen } = useRide();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedRide, setSelectedRide] = useState<BookingState | null>(null);

  const filteredRides = rideHistory.filter((ride) => {
    if (filter === 'completed') return ride.status === 'completed';
    if (filter === 'cancelled') return ride.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between pb-24 select-none">
      {/* Top Header */}
      <div className="pt-safe px-4 pb-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900">Ride Activity</h2>
            <p className="text-[11px] text-slate-500">Past trips & itemized invoices</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          {filteredRides.length} {filteredRides.length === 1 ? 'Trip' : 'Trips'}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 bg-white border-b border-slate-100 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          All Trips
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
            filter === 'completed'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
            filter === 'cancelled'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Rides List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredRides.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-slate-400 shadow-xs">
              <Car className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Trips Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              You haven&apos;t taken any trips matching this filter yet.
            </p>
            <button
              onClick={() => setScreen('dest_select')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition active:scale-95 shadow-xs"
            >
              Book a New Ride
            </button>
          </div>
        ) : (
          filteredRides.map((ride) => {
            const isCompleted = ride.status === 'completed';
            const total = ride.fareBreakdown.totalAED + (ride.tipAED || 0);

            return (
              <div
                key={ride.id}
                onClick={() => setSelectedRide(ride)}
                className="p-4 rounded-3xl bg-white hover:bg-slate-50 border border-slate-100 cursor-pointer transition shadow-xs group space-y-3 active:scale-[0.99]"
              >
                {/* Header Strip: ID & Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900">{ride.id}</span>
                    <span className="text-[10px] text-slate-400">• {ride.createdAt}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {ride.status}
                  </span>
                </div>

                {/* Route Points */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">{ride.pickup.name}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-bold text-slate-800 truncate">{ride.destination.name}</span>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span className="font-bold text-slate-700">{ride.vehicle.name}</span>
                    {ride.driver && (
                      <>
                        <span>•</span>
                        <span>{ride.driver.name}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 text-sm">
                      AED {total.toFixed(2)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Ride Receipt Modal */}
      {selectedRide && (
        <ReceiptModal ride={selectedRide} onClose={() => setSelectedRide(null)} />
      )}
    </div>
  );
};
