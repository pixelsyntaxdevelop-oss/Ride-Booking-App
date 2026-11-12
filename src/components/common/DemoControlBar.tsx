import React, { useState } from 'react';
import { FastForward, Play, Pause, Layers, RotateCcw, X, Sparkles, Check } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { ScreenType } from '../../types';

export const DemoControlBar: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    currentBooking,
    advanceDemo,
    autoAdvanceEnabled,
    setAutoAdvanceEnabled,
    resetDemoData,
  } = useRide();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const activeTripScreens: ScreenType[] = [
    'searching_driver',
    'driver_assigned',
    'driver_arriving',
    'trip_in_progress',
    'trip_completed',
  ];

  const isRideActive = activeTripScreens.includes(activeScreen);

  // Screen jump list for quick evaluation of all 15 screens
  const allScreens: { id: ScreenType; label: string; num: number }[] = [
    { id: 'splash', label: '1. Splash Screen', num: 1 },
    { id: 'onboarding', label: '2. Onboarding', num: 2 },
    { id: 'guest_entry', label: '3. Guest Demo Entry', num: 3 },
    { id: 'home', label: '4. Home & Map', num: 4 },
    { id: 'pickup_select', label: '5. Pickup Location', num: 5 },
    { id: 'dest_select', label: '6. Destination Select', num: 6 },
    { id: 'vehicle_select', label: '7. Vehicle Select', num: 7 },
    { id: 'fare_confirm', label: '8. Fare & Confirmation', num: 8 },
    { id: 'searching_driver', label: '9. Searching Driver', num: 9 },
    { id: 'driver_assigned', label: '10. Driver Assigned', num: 10 },
    { id: 'driver_arriving', label: '11. Driver Arriving', num: 11 },
    { id: 'trip_in_progress', label: '12. Trip In Progress', num: 12 },
    { id: 'trip_completed', label: '13. Trip Completed & Receipt', num: 13 },
    { id: 'ride_history', label: '14. Ride History', num: 14 },
    { id: 'profile_settings', label: '15. Profile & Settings', num: 15 },
  ];

  // Adjust bottom position so it floats above the bottom nav or bottom action card
  const isMainTab = ['home', 'ride_history', 'profile_settings'].includes(activeScreen);
  const bottomPositionClass = isMainTab ? 'bottom-20' : 'bottom-24';

  return (
    <>
      {/* Floating Tester FAB (Compact, Never Overlaps Header Controls) */}
      <div className={`fixed ${bottomPositionClass} right-3 z-40 sm:bottom-6 sm:right-6`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0F1E36]/95 hover:bg-blue-900/80 border border-blue-500/50 shadow-2xl backdrop-blur-md text-white text-xs font-semibold active:scale-95 transition"
          title="Open Demo Showcase Controller"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="tracking-tight">Demo Nav</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-600/60 text-[10px] font-mono">15</span>
        </button>
      </div>

      {/* Expanded Modal Drawer for Client Evaluation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0F1E36] border border-blue-500/40 p-4 shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Pixel Ride Showcase Controller</h3>
                  <p className="text-[10px] text-blue-400">15 Interactive Connected Screens</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Ride Controls (if ride is in progress) */}
            {isRideActive && (
              <div className="my-3 p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Active Ride Stage:</span>
                  <span className="font-mono text-blue-400 font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-blue-500/20">
                    {currentBooking?.status || 'Active'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      advanceDemo();
                    }}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition"
                  >
                    <FastForward className="w-3.5 h-3.5 fill-current" />
                    <span>Advance Demo Step</span>
                  </button>
                  <button
                    onClick={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
                    className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                      autoAdvanceEnabled
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                    title={autoAdvanceEnabled ? 'Pause automated timer' : 'Enable auto progression'}
                  >
                    {autoAdvanceEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{autoAdvanceEnabled ? 'Auto: ON' : 'Auto: OFF'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 15 Screens Direct Jumper */}
            <div className="flex-1 overflow-y-auto space-y-1 my-2 pr-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                Jump to Any Screen
              </span>
              {allScreens.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setScreen(s.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    activeScreen === s.id
                      ? 'bg-blue-600 text-white font-semibold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                  {activeScreen === s.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {/* Footer with Reset */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <button
                onClick={() => {
                  resetDemoData();
                  setIsOpen(false);
                }}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Sandbox
              </button>
              <span className="text-slate-400">Pixel Ride by Pixel Syntax</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
