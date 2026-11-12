import React, { useState } from 'react';
import { ArrowRight, Car, CheckCircle, Clock, DollarSign, MapPin, ShieldCheck } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const OnboardingScreen: React.FC = () => {
  const { setScreen } = useRide();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Car,
      iconColor: 'text-amber-500',
      badge: 'Curated Luxury Fleet',
      title: 'Standard, Comfort & VIP XL Taxis',
      description:
        'Choose from electric Tesla sedans, executive BMW 5-Series, or Mercedes V-Class vans with certified Dubai chauffeurs.',
      perks: ['Verified UAE Chauffeurs', 'Electric & Eco-Friendly', 'In-Car Amenities & Wi-Fi'],
    },
    {
      icon: MapPin,
      iconColor: 'text-amber-500',
      badge: '2.5D Isometric Vector Engine',
      title: 'Seamless UAE Landmark Navigation',
      description:
        'Vector map tracking along Sheikh Zayed Road, Downtown Dubai, Palm Jumeirah, DIFC, and Dubai International Airport.',
      perks: ['Zero External Map APIs', 'Live Simulated Telemetry', 'Accurate Dynamic ETAs'],
    },
    {
      icon: DollarSign,
      iconColor: 'text-amber-500',
      badge: 'Transparent Fare Engine',
      title: 'AED Pricing with Instant Receipts',
      description:
        'Real-time distance, base rates, and Salik toll calculation. Demo credit cards and wallet top-ups with zero real billing.',
      perks: ['Itemized Receipts', 'Demo Promo Codes', 'LocalStorage Persistence'],
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setScreen('guest_entry');
    }
  };

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-6 select-none">
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between pt-safe">
        <span className="text-xs font-bold text-slate-900 tracking-wider">
          Pixel Ride by <strong className="text-amber-500">Pixel Syntax</strong>
        </span>
        <button
          onClick={() => setScreen('home')}
          className="text-xs text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-100 transition font-bold"
        >
          Skip to Home
        </button>
      </div>

      {/* Slide Visual and Content */}
      <div className="my-auto py-6">
        {/* Animated Badge & Icon */}
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 mx-auto flex items-center justify-center mb-6 shadow-premium">
          <IconComponent className={`w-10 h-10 ${current.iconColor}`} />
        </div>

        <div className="text-center space-y-3 max-w-sm mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold tracking-wide">
            {current.badge}
          </span>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            {current.title}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Feature bullet pills */}
        <div className="mt-8 flex flex-col gap-2.5 max-w-xs mx-auto">
          {current.perks.map((perk, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-100 text-xs text-slate-700 shadow-xs"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-medium">{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="space-y-4 pb-safe">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-200'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-premium flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <span>{currentSlide === slides.length - 1 ? 'Enter Guest Demo' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
