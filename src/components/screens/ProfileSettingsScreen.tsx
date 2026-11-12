import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Edit2,
  ExternalLink,
  FastForward,
  HelpCircle,
  Info,
  LifeBuoy,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  User,
  Volume2,
  VolumeX,
  Wallet,
  Wrench,
  X,
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { PixelSyntaxBadge } from '../common/PixelSyntaxBadge';
import { ScreenType } from '../../types';

export const ProfileSettingsScreen: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    topUpWallet,
    resetDemoData,
    setScreen,
    soundEnabled,
    toggleSound,
    advanceDemo,
    activeScreen,
    isDevMode,
    toggleDevMode,
  } = useRide();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showDevTools, setShowDevTools] = useState(false);
  const [devTapCount, setDevTapCount] = useState(0);
  const [devToast, setDevToast] = useState<string | null>(null);

  const handleDevTap = () => {
    const next = devTapCount + 1;
    if (next >= 5) {
      toggleDevMode();
      setDevTapCount(0);
      setDevToast(isDevMode ? 'Developer Mode Disabled' : 'Developer Mode Unlocked');
      setTimeout(() => setDevToast(null), 2500);
    } else {
      setDevTapCount(next);
      setTimeout(() => setDevTapCount(0), 3000);
    }
  };

  const screensList: { id: ScreenType; label: string }[] = [
    { id: 'splash', label: '1. Splash Screen' },
    { id: 'onboarding', label: '2. Onboarding' },
    { id: 'guest_entry', label: '3. Guest Demo Entry' },
    { id: 'home', label: '4. Home Dashboard' },
    { id: 'pickup_select', label: '5. Pickup Location' },
    { id: 'dest_select', label: '6. Destination Selection' },
    { id: 'vehicle_select', label: '7. Vehicle Selection' },
    { id: 'fare_confirm', label: '8. Fare & Confirmation' },
    { id: 'searching_driver', label: '9. Searching Driver' },
    { id: 'driver_assigned', label: '10. Driver Assigned' },
    { id: 'driver_arriving', label: '11. Driver Arriving' },
    { id: 'trip_in_progress', label: '12. Trip In Progress' },
    { id: 'trip_completed', label: '13. Trip Completed & Receipt' },
    { id: 'ride_history', label: '14. Ride History' },
    { id: 'profile_settings', label: '15. Profile & Settings' },
  ];

  const faqs = [
    {
      q: 'Is Pixel Ride a live commercial ride-hailing service?',
      a: 'Pixel Ride is an interactive software demonstration application engineered by Pixel Syntax. It showcases the full passenger booking journey, 2.5D vector map tracking, transparent AED fares, and digital receipts for software development clients.',
    },
    {
      q: 'How does the map work without paid Google Maps API keys?',
      a: 'We integrated MapLibre GL JS with OpenFreeMap liberty vector tiles, rendering real Dubai street geography, building footprints, and highway corridors (Sheikh Zayed Road, Financial Centre Rd, Palm Jumeirah) with zero commercial API fees, road-following navigation, and smooth WebGL hardware acceleration.',
    },
    {
      q: 'Are any credit cards or payments processed?',
      a: 'No. All fares, payments, and invoices are 100% simulated sandbox mockups. No real money or payment gateways are connected.',
    },
    {
      q: 'How do I install the application on mobile as a PWA?',
      a: 'Pixel Ride is a Progressive Web App. On Android / Chromium browsers, tap "Install App" above. On iOS Safari, tap Share → "Add to Home Screen" to install it with standalone launch icon, splash screen, and offline support.',
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || userProfile.name,
      email: editEmail.trim() || userProfile.email,
      phone: editPhone.trim() || userProfile.phone,
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between pb-24 select-none">
      {/* Top Header */}
      <div className="pt-safe px-4 pb-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:text-slate-900 transition active:scale-95"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900">Profile & Settings</h2>
            <p className="text-[11px] text-slate-500">Passenger preferences & showcase tools</p>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 transition active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Passenger Profile Card */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 space-y-3 relative shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 p-0.5 shadow-sm flex items-center justify-center">
                <span className="font-black text-lg text-amber-400">
                  {userProfile.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">{userProfile.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    VIP Guest
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {userProfile.email}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {userProfile.phone}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditName(userProfile.name);
                setEditEmail(userProfile.email);
                setEditPhone(userProfile.phone);
                setIsEditingProfile(true);
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* Passenger Statistics Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">TOTAL RIDES</span>
              <span className="text-base font-mono font-black text-slate-900">{userProfile.totalRides}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">MEMBER TIER</span>
              <span className="text-xs font-black text-amber-600">Pixel Elite Gold</span>
            </div>
          </div>
        </div>

        {/* Demo Wallet Section */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-600 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pixel Demo Wallet
              </h4>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              Active Credits
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black font-mono text-slate-900">
                AED {userProfile.walletBalanceAED.toFixed(2)}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Usable at checkout for zero real cost</p>
            </div>
            <button
              onClick={() => topUpWallet(100)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs active:scale-95 transition"
            >
              + Top Up 100 AED
            </button>
          </div>
        </div>

        {/* PWA & System Settings */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Application Preferences
          </h4>

          {/* Sound FX Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Sound Effects (Web Audio)</p>
                <p className="text-[10px] text-slate-500">Subtle chimes for booking, dispatch & arrival</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-amber-400' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* PWA Installation Card */}
          <PWAInstallButton variant="full" />
        </div>

        {/* Developer & Showcase Inspector - Hidden in Client-Facing Portfolio Mode, only shown in explicit Dev Mode */}
        {isDevMode && (
          <div className="rounded-3xl bg-white border border-amber-300 shadow-xs overflow-hidden">
            <button
              onClick={() => setShowDevTools(!showDevTools)}
              className="w-full p-4 flex items-center justify-between text-left bg-amber-50/40 hover:bg-amber-50/80 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4 text-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Developer Tools & Screen Inspector
                    </h4>
                    <span className="text-[9px] font-black uppercase bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                      DEV MODE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">Jump directly to any of the 15 screens or trigger transitions</p>
                </div>
              </div>
              {showDevTools ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {showDevTools && (
              <div className="p-4 pt-2 border-t border-amber-200 space-y-3 bg-amber-50/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Advance Active Demo Flow</span>
                  <button
                    onClick={advanceDemo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black shadow-xs active:scale-95 transition"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Advance Demo Step</span>
                  </button>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">
                    Direct Screen Navigation (15 Screens):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {screensList.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setScreen(s.id)}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                          activeScreen === s.id
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Center & Showcase FAQ */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Showcase FAQ & Technology
              </h4>
            </div>
            <button
              onClick={() => setShowSupportModal(true)}
              className="text-[11px] text-amber-600 font-bold hover:text-amber-700"
            >
              Demo Support Desk
            </button>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-3 text-left text-xs font-bold text-slate-900 flex items-center justify-between"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer Attribution Card & Hidden Dev Unlock Trigger */}
        <PixelSyntaxBadge />

        <div className="text-center pt-1 pb-2">
          <button
            onClick={handleDevTap}
            className="text-[10px] text-slate-400 hover:text-slate-600 transition font-mono tracking-tight select-none focus:outline-none"
            title="Tap 5 times to toggle development mode"
          >
            Pixel Ride Build 2.4 • Pixel Syntax {isDevMode && '• [Dev Mode Active]'}
          </button>
        </div>

        {devToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xl border border-amber-400 animate-in fade-in zoom-in-95">
            {devToast}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-500" />
                Edit Passenger Profile
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Demo Mobile Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-rose-200 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Reset All Demo Data?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              This will clear active bookings, custom profile updates, and restore default seeded Dubai trip records.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  resetDemoData();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Chat Demo Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900">Pixel 24/7 Support Desk</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-900">Live Support Simulation</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                In an enterprise deployment, this module connects to live customer dispatch desks via WebSockets, Zendesk, or custom support systems.
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                Support Chauffeur Hotline: <strong className="text-slate-900">+971 800-PIXEL</strong>
              </div>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
