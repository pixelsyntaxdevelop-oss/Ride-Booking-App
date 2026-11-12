import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

export const PixelSyntaxBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-slate-500 font-medium">
        <Terminal className="w-3.5 h-3.5 text-amber-500" />
        <span>Pixel Ride by <strong className="text-slate-900 font-semibold">Pixel Syntax</strong></span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center shadow-xs">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
          Pixel Ride by Pixel Syntax
        </h4>
      </div>
      <p className="text-[11px] text-slate-500">
        Interactive Taxi Booking Showcase • Built for prospective software development clients
      </p>
    </div>
  );
};
