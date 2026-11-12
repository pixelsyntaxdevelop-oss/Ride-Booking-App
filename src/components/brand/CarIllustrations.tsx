import React, { useState } from 'react';
import { VehicleTier } from '../../types';

interface Props {
  tier: VehicleTier;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CarIllustration: React.FC<Props> = ({ tier, className = '', size = 'md' }) => {
  const [loadError, setLoadError] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-24 h-14',
    lg: 'w-32 h-18',
    xl: 'w-44 h-26',
  };

  const assetSrc = `/vehicles/${tier}.svg`;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {!loadError ? (
        <img
          src={assetSrc}
          alt={`Pixel ${tier.toUpperCase()}`}
          onError={() => setLoadError(true)}
          className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none transition-transform duration-300"
          loading="eager"
        />
      ) : (
        /* Fallback icon if static asset is blocked */
        <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs">
          🚗 {tier.toUpperCase()}
        </div>
      )}
    </div>
  );
};
