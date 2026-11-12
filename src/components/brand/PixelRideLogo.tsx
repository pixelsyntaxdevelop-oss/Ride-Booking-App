import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
}

export const PixelRideLogo: React.FC<Props> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 36, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-xs' },
  };

  const { icon, text, sub } = sizeMap[size];
  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Precision Automotive Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl shadow-sm"
        style={{
          width: icon,
          height: icon,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Stylized P and R speed ribbon */}
          <path
            d="M8 26V10H18C21.3137 10 24 12.6863 24 16C24 19.3137 21.3137 22 18 22H13V26H8Z"
            fill="#FFFFFF"
          />
          <path
            d="M13 14H18C19.1046 14 20 14.8954 20 16C20 17.1046 19.1046 18 18 18H13V14Z"
            fill="#0F172A"
          />
          <path
            d="M18 21L26 26"
            stroke="#F59E0B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Signature Gold Pulse Accent */}
          <circle cx="26" cy="11" r="2.5" fill="#F59E0B" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline tracking-tight font-extrabold">
          <span className={isDark ? 'text-slate-900' : 'text-white'}>PIXEL</span>
          <span className="text-amber-500 ml-1">RIDE</span>
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-wider uppercase mt-0.5 ${sub} ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            by Pixel Syntax
          </span>
        )}
      </div>
    </div>
  );
};
