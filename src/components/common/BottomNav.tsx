import React from 'react';
import { Clock, Home, User, Wallet } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { ScreenType } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeScreen, setScreen, currentBooking } = useRide();

  // Show bottom nav only on main root tabs: home, ride_history, profile_settings.
  // Hide on modal booking steps, active in-trip screens, and splash to give maximum map presence.
  const visibleTabs: ScreenType[] = ['home', 'ride_history', 'profile_settings'];
  if (!visibleTabs.includes(activeScreen)) return null;

  const navItems = [
    {
      id: 'home' as ScreenType,
      label: 'Home',
      icon: Home,
      isActive: activeScreen === 'home',
      onClick: () => setScreen('home'),
    },
    {
      id: 'ride_history' as ScreenType,
      label: 'Activity',
      icon: Clock,
      isActive: activeScreen === 'ride_history',
      hasBadge: !!currentBooking && currentBooking.status !== 'completed',
      onClick: () => setScreen('ride_history'),
    },
    {
      id: 'profile_settings' as ScreenType,
      label: 'Account',
      icon: User,
      isActive: activeScreen === 'profile_settings',
      onClick: () => setScreen('profile_settings'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-6 pt-2 pb-safe max-w-md mx-auto shadow-sm">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-95 ${
                active ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.4px] text-slate-900' : 'stroke-[1.8px] text-slate-400'}`} />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${active ? 'text-slate-900 font-extrabold' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
