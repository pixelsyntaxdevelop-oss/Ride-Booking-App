import React, { useEffect, useState } from 'react';
import { Mic, MicOff, PhoneOff, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const SimulatedCallModal: React.FC = () => {
  const { simulatedCallDriver, endSimulatedCall } = useRide();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!simulatedCallDriver) {
      setSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [simulatedCallDriver]);

  if (!simulatedCallDriver) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#0B1425] border border-blue-500/40 p-6 text-center shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Demo Notice Banner */}
        <div className="mb-6 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-[10px] font-semibold text-blue-300">
          Simulated Call • In-App Showcase Audio
        </div>

        {/* Driver Photo with Pulse Ring */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 animate-pulse">
            <img
              src={simulatedCallDriver.photoUrl}
              alt={simulatedCallDriver.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0B1425] flex items-center justify-center text-white text-xs">
            ✓
          </span>
        </div>

        {/* Driver Details */}
        <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
          <span>{simulatedCallDriver.name}</span>
          <ShieldCheck className="w-4 h-4 text-blue-400" />
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{simulatedCallDriver.phone}</p>
        <p className="text-[11px] text-blue-300 mt-1">
          {simulatedCallDriver.vehicleModel} • {simulatedCallDriver.plateNumber}
        </p>

        {/* Call Timer */}
        <div className="mt-4 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 font-bold">
          {formatTime(seconds)} Connected
        </div>

        {/* In-Call Controls */}
        <div className="mt-8 flex items-center justify-center gap-5 w-full">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition border ${
              isMuted
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={endSimulatedCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 active:scale-95 transition"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition border ${
              isSpeaker
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Speaker"
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 mt-6">
          This is a simulated demo call for software evaluation.
        </p>
      </div>
    </div>
  );
};
