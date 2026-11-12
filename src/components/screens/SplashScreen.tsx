import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useRide } from '../../context/RideContext';
import { PixelRideLogo } from '../brand/PixelRideLogo';

export const SplashScreen: React.FC = () => {
  const { setScreen } = useRide();

  useEffect(() => {
    // Automatically transition to the real Home screen after ~1.0 second
    const timer = setTimeout(() => {
      setScreen('home');
    }, 1100);

    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Subtle ambient luxury backlight */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      {/* Animated Brand Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center z-10"
      >
        <PixelRideLogo size="xl" variant="dark" showSubtitle={true} />
        
        {/* Subtle Minimal Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-8 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            Dubai Luxury Chauffeur
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};
