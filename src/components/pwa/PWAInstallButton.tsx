import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

interface Props {
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide or show installed badge
  if (isInstalled) {
    if (variant === 'full') {
      return (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Pixel Ride is running standalone (PWA)</span>
        </div>
      );
    }
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner' || variant === 'full') {
      return (
        <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-900 shrink-0 shadow-sm font-black">
              <Download className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Install Pixel Ride App</p>
              <p className="text-[11px] text-slate-500">Quick launch, fullscreen & offline PWA</p>
            </div>
          </div>
          <button
            onClick={install}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs active:scale-95 transition"
          >
            Install
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-3.5 py-2 text-xs font-bold shadow-xs active:scale-95 transition"
      >
        <Download className="w-4 h-4 text-amber-400" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center justify-between w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition"
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-amber-500" />
            <span>Install on iPhone / iPad (Add to Home)</span>
          </div>
          <span className="text-[11px] text-amber-600 font-bold">Guide →</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-500" />
                  Install on iOS
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                  <p>Tap the <strong>Share icon</strong> (square with up arrow) in Safari toolbar.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                  <p>Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                  <p>Tap <strong>Add</strong> in the top-right corner to launch Pixel Ride standalone.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-black transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop/unprompted state - show info badge if requested
  if (variant === 'full') {
    return (
      <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-500">
        <span className="flex items-center gap-2 font-medium">
          <Smartphone className="w-4 h-4 text-amber-500" />
          Progressive Web App Ready
        </span>
        <span className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">Enabled</span>
      </div>
    );
  }

  return null;
};
