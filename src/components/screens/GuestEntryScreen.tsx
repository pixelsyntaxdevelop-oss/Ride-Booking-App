import React, { useState } from 'react';
import { ArrowRight, Check, CreditCard, Shield, Sparkles, User, Smartphone, UserCheck } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const GuestEntryScreen: React.FC = () => {
  const { userProfile, updateProfile, setScreen } = useRide();
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [selectedPersona, setSelectedPersona] = useState<string>('exec');

  const personas = [
    {
      id: 'exec',
      role: 'Business Executive',
      name: 'Alex Sterling',
      phone: '+971 50 123 4567',
      desc: 'Frequent Downtown & DIFC traveler',
    },
    {
      id: 'tourist',
      role: 'UAE Tourist',
      name: 'Sophia Laurent',
      phone: '+971 52 884 9201',
      desc: 'Visiting Burj Khalifa & Palm Jumeirah',
    },
    {
      id: 'resident',
      role: 'Dubai Resident',
      name: 'Omar Al-Hashimi',
      phone: '+971 55 930 1823',
      desc: 'Daily rides to Dubai Marina & Mall',
    },
  ];

  const handleApplyPersona = (p: typeof personas[0]) => {
    setSelectedPersona(p.id);
    setName(p.name);
    setPhone(p.phone);
    updateProfile({ name: p.name, phone: p.phone });
  };

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Alex Sterling',
      phone: phone.trim() || '+971 50 123 4567',
    });
    setScreen('home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-6 select-none">
      {/* Top Header */}
      <div className="pt-safe flex items-center justify-between">
        <button
          onClick={() => setScreen('home')}
          className="text-xs text-slate-500 hover:text-slate-900 font-bold"
        >
          ← Home
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Guest Persona</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="my-auto py-4 space-y-6 max-w-sm mx-auto w-full">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Passenger Profile</h2>
          <p className="text-xs text-slate-500">
            Select a preset demo persona or customize your name
          </p>
        </div>

        {/* Persona Selectors */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Quick Persona Presets
          </label>
          <div className="grid grid-cols-1 gap-2">
            {personas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPersona(p)}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition active:scale-98 ${
                  selectedPersona === p.id
                    ? 'bg-amber-50/60 border-amber-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedPersona === p.id
                      ? 'bg-amber-400 border-amber-400 text-slate-900'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedPersona === p.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleEnter} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Passenger Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Sterling"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Demo UAE Mobile
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>
        </form>

        {/* Sandbox Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-500">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Demonstration mode: Your profile preferences are stored locally on your device in localStorage. No external database or signup required.
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pb-safe">
        <button
          onClick={handleEnter}
          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm shadow-premium flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <span>Enter Showcase App</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
