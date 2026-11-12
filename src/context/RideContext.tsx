import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BookingState,
  ChatMessage,
  DriverInfo,
  LocationPoint,
  PaymentMethod,
  PromoCode,
  ScreenType,
  UserProfile,
  VehicleOption,
} from '../types';
import {
  DUBAI_LOCATIONS,
  INITIAL_USER,
  PAYMENT_METHODS,
  SAMPLE_HISTORIC_RIDES,
  SEED_DRIVERS,
  VALID_PROMOS,
  VEHICLE_OPTIONS,
} from '../data/seedData';
import { calculateEstimatedMinutes, calculateFare, calculateSimulatedDistance, generateRideId } from '../utils/calc';
import { soundManager } from '../utils/sound';

interface RideContextType {
  activeScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  topUpWallet: (amount: number) => void;
  pickup: LocationPoint | null;
  destination: LocationPoint | null;
  setPickup: (loc: LocationPoint) => void;
  setDestination: (loc: LocationPoint) => void;
  swapLocations: () => void;
  selectedVehicle: VehicleOption;
  setSelectedVehicle: (v: VehicleOption) => void;
  selectedPayment: PaymentMethod;
  setSelectedPayment: (p: PaymentMethod) => void;
  promoInput: string;
  setPromoInput: (code: string) => void;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  currentBooking: BookingState | null;
  startBooking: () => void;
  cancelBooking: () => void;
  advanceDemo: () => void;
  autoAdvanceEnabled: boolean;
  setAutoAdvanceEnabled: (val: boolean) => void;
  rateTrip: (stars: number, feedback: string[], tip: number) => void;
  rideHistory: BookingState[];
  selectedHistoryRide: BookingState | null;
  setSelectedHistoryRide: (ride: BookingState | null) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  resetDemoData: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  simulatedCallDriver: DriverInfo | null;
  startSimulatedCall: (driver: DriverInfo) => void;
  endSimulatedCall: () => void;
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Screen State
  const [activeScreen, setActiveScreenState] = useState<ScreenType>(() => {
    const saved = localStorage.getItem('pixel_ride_last_screen');
    // If user previously completed onboarding, go to home or their active booking
    return (saved as ScreenType) || 'splash';
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pixel_ride_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Selected Trip Locations
  const [pickup, setPickupLocation] = useState<LocationPoint | null>(DUBAI_LOCATIONS[0]); // Burj Khalifa
  const [destination, setDestinationLocation] = useState<LocationPoint | null>(DUBAI_LOCATIONS[2]); // Dubai Marina Walk

  // Vehicle & Payment Selections
  const [selectedVehicle, setSelectedVehicleState] = useState<VehicleOption>(VEHICLE_OPTIONS[0]);
  const [selectedPayment, setSelectedPaymentState] = useState<PaymentMethod>(PAYMENT_METHODS[0]);

  // Promo Code State
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Active Booking
  const [currentBooking, setCurrentBooking] = useState<BookingState | null>(() => {
    const saved = localStorage.getItem('pixel_ride_current_booking');
    return saved ? JSON.parse(saved) : null;
  });

  // Ride History
  const [rideHistory, setRideHistory] = useState<BookingState[]>(() => {
    const saved = localStorage.getItem('pixel_ride_history');
    return saved ? JSON.parse(saved) : (SAMPLE_HISTORIC_RIDES as unknown as BookingState[]);
  });

  const [selectedHistoryRide, setSelectedHistoryRide] = useState<BookingState | null>(null);

  // Auto Advance Demo Flag
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState<boolean>(true);

  // Driver Chat State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Salam! I have accepted your Pixel Ride request and am heading to your pickup pin.',
      time: 'Just now',
    },
  ]);

  // Audio sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Simulated In-App Call
  const [simulatedCallDriver, setSimulatedCallDriver] = useState<DriverInfo | null>(null);

  const startSimulatedCall = (driver: DriverInfo) => {
    soundManager.playChime();
    setSimulatedCallDriver(driver);
  };

  const endSimulatedCall = () => {
    soundManager.playTap();
    setSimulatedCallDriver(null);
  };

  // Save persistent state to localStorage
  useEffect(() => {
    localStorage.setItem('pixel_ride_last_screen', activeScreen);
  }, [activeScreen]);

  useEffect(() => {
    localStorage.setItem('pixel_ride_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (currentBooking) {
      localStorage.setItem('pixel_ride_current_booking', JSON.stringify(currentBooking));
    } else {
      localStorage.removeItem('pixel_ride_current_booking');
    }
  }, [currentBooking]);

  useEffect(() => {
    localStorage.setItem('pixel_ride_history', JSON.stringify(rideHistory));
  }, [rideHistory]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) soundManager.playTap();
  };

  // Developer Mode (hidden in client-facing portfolio, unlocked via ?dev=true, #dev or 5 taps on version)
  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('dev') === 'true' || window.location.hash === '#dev') return true;
      return localStorage.getItem('pixel_ride_dev_mode') === 'true';
    }
    return false;
  });

  const toggleDevMode = () => {
    soundManager.playChime();
    setIsDevMode((prev) => {
      const next = !prev;
      localStorage.setItem('pixel_ride_dev_mode', String(next));
      return next;
    });
  };

  // Browser History & Popstate integration
  const setScreen = (s: ScreenType, pushHistory = true) => {
    soundManager.playTap();
    if (pushHistory && typeof window !== 'undefined' && s !== activeScreen) {
      try {
        window.history.pushState({ screen: s }, '', window.location.pathname + window.location.search);
      } catch {
        // Safe fallback in restricted iframes
      }
    }
    setActiveScreenState(s);
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.screen) {
        setActiveScreenState(e.state.screen);
      } else {
        setActiveScreenState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));
  };

  const topUpWallet = (amount: number) => {
    soundManager.playSuccess();
    setUserProfile((prev) => ({
      ...prev,
      walletBalanceAED: Math.round((prev.walletBalanceAED + amount) * 100) / 100,
    }));
  };

  const setPickup = (loc: LocationPoint) => {
    soundManager.playTap();
    setPickupLocation(loc);
  };

  const setDestination = (loc: LocationPoint) => {
    soundManager.playTap();
    setDestinationLocation(loc);
  };

  const swapLocations = () => {
    soundManager.playTap();
    const temp = pickup;
    setPickupLocation(destination);
    setDestinationLocation(temp);
  };

  const setSelectedVehicle = (v: VehicleOption) => {
    soundManager.playTap();
    setSelectedVehicleState(v);
  };

  const setSelectedPayment = (p: PaymentMethod) => {
    soundManager.playTap();
    setSelectedPaymentState(p);
  };

  const applyPromo = (code: string) => {
    const match = VALID_PROMOS.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (match) {
      soundManager.playSuccess();
      setAppliedPromo(match);
      return { success: true, message: `Promo applied: ${match.discountPercent}% off!` };
    }
    return { success: false, message: 'Invalid promo code. Try PIXELSYNTAX or WELCOME20' };
  };

  const removePromo = () => {
    soundManager.playTap();
    setAppliedPromo(null);
    setPromoInput('');
  };

  // Start Booking Flow
  const startBooking = () => {
    if (!pickup || !destination || pickup.id === destination.id) return;

    soundManager.playSuccess();
    const distanceKm = calculateSimulatedDistance(pickup, destination);
    const estimatedMinutes = calculateEstimatedMinutes(distanceKm);
    const fareBreakdown = calculateFare(
      selectedVehicle,
      distanceKm,
      appliedPromo?.discountPercent || 0,
      appliedPromo?.maxDiscountAED || 0
    );

    const newBooking: BookingState = {
      id: generateRideId(),
      pickup,
      destination,
      vehicle: selectedVehicle,
      distanceKm,
      estimatedMinutes,
      fareBreakdown,
      paymentMethod: selectedPayment,
      status: 'searching',
      progress: 0,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentBooking(newBooking);
    setChatMessages([
      {
        id: 'msg-init',
        sender: 'driver',
        text: 'Salam! I have accepted your Pixel Ride request and am heading to your pickup pin.',
        time: 'Just now',
      },
    ]);
    setActiveScreenState('searching_driver');
  };

  // Cancel Booking
  const cancelBooking = () => {
    soundManager.playTap();
    if (currentBooking && currentBooking.status !== 'cancelled' && currentBooking.status !== 'completed') {
      const cancelledTrip: BookingState = {
        ...currentBooking,
        status: 'cancelled',
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setRideHistory((prev) => {
        if (prev.some((r) => r.id === cancelledTrip.id)) {
          return prev.map((r) => (r.id === cancelledTrip.id ? cancelledTrip : r));
        }
        return [cancelledTrip, ...prev];
      });
    }
    setCurrentBooking(null);
    setScreen('home');
  };

  // Advance Demo State Machine
  const advanceDemo = () => {
    if (!currentBooking) return;
    soundManager.playChime();

    switch (currentBooking.status) {
      case 'searching': {
        const assignedDriver = SEED_DRIVERS[currentBooking.vehicle.id] || SEED_DRIVERS.standard;
        setCurrentBooking({
          ...currentBooking,
          status: 'assigned',
          driver: assignedDriver,
          progress: 15,
        });
        setScreen('driver_assigned');
        break;
      }
      case 'assigned': {
        setCurrentBooking({
          ...currentBooking,
          status: 'arriving',
          progress: 45,
        });
        setScreen('driver_arriving');
        break;
      }
      case 'arriving': {
        setCurrentBooking({
          ...currentBooking,
          status: 'in_progress',
          progress: 10,
        });
        setScreen('trip_in_progress');
        break;
      }
      case 'in_progress': {
        if (currentBooking.status !== 'in_progress') break;
        const completedTrip: BookingState = {
          ...currentBooking,
          status: 'completed',
          progress: 100,
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setCurrentBooking(completedTrip);
        setRideHistory((prev) => {
          if (prev.some((r) => r.id === completedTrip.id)) {
            return prev.map((r) => (r.id === completedTrip.id ? completedTrip : r));
          }
          return [completedTrip, ...prev];
        });

        // Safe demo wallet deduction if paid with wallet
        if (currentBooking.paymentMethod.type === 'wallet') {
          setUserProfile((prev) => ({
            ...prev,
            walletBalanceAED: Math.max(
              0,
              Math.round((prev.walletBalanceAED - completedTrip.fareBreakdown.totalAED) * 100) / 100
            ),
            totalRides: prev.totalRides + 1,
          }));
        } else {
          setUserProfile((prev) => ({
            ...prev,
            totalRides: prev.totalRides + 1,
          }));
        }

        soundManager.playSuccess();
        setScreen('trip_completed');
        break;
      }
      case 'completed': {
        // Return to home
        setCurrentBooking(null);
        setScreen('home');
        break;
      }
      default:
        break;
    }
  };

  // Automated gentle timer progression for active ride screens
  useEffect(() => {
    if (!autoAdvanceEnabled || !currentBooking) return;

    let timer: NodeJS.Timeout;

    if (currentBooking.status === 'searching') {
      timer = setTimeout(() => {
        advanceDemo();
      }, 4200);
    } else if (currentBooking.status === 'arriving') {
      const interval = setInterval(() => {
        setCurrentBooking((prev) => {
          if (!prev || prev.status !== 'arriving') return prev;
          const nextProg = Math.min(100, prev.progress + 15);
          if (nextProg >= 100) {
            clearInterval(interval);
            setTimeout(() => advanceDemo(), 800);
          }
          return { ...prev, progress: nextProg };
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (currentBooking.status === 'in_progress') {
      const interval = setInterval(() => {
        setCurrentBooking((prev) => {
          if (!prev || prev.status !== 'in_progress') return prev;
          const nextProg = Math.min(100, prev.progress + 6);
          if (nextProg >= 100) {
            clearInterval(interval);
            setTimeout(() => advanceDemo(), 800);
          }
          return { ...prev, progress: nextProg };
        });
      }, 800);
      return () => clearInterval(interval);
    }

    return () => clearTimeout(timer);
  }, [currentBooking?.status, autoAdvanceEnabled]);

  // Rate Trip
  const rateTrip = (stars: number, feedback: string[], tip: number) => {
    soundManager.playSuccess();
    if (currentBooking) {
      const updated = {
        ...currentBooking,
        rating: stars,
        ratingFeedback: feedback,
        tipAED: tip,
      };
      setCurrentBooking(updated);
      setRideHistory((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    }
  };

  // Driver Chat
  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    soundManager.playTap();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Driver automated simulated reply
    setTimeout(() => {
      const replies = [
        'Understood! I will be waiting right at the main lobby entrance.',
        'Got it. The vehicle hazard lights are blinking in electric blue.',
        'Thanks for letting me know, see you in 1 minute!',
        'No problem at all, take your time.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      soundManager.playChime();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-drv-${Date.now()}`,
          sender: 'driver',
          text: randomReply,
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    soundManager.playSuccess();
    localStorage.removeItem('pixel_ride_last_screen');
    localStorage.removeItem('pixel_ride_profile');
    localStorage.removeItem('pixel_ride_current_booking');
    localStorage.removeItem('pixel_ride_history');
    setUserProfile(INITIAL_USER);
    setPickupLocation(DUBAI_LOCATIONS[0]);
    setDestinationLocation(DUBAI_LOCATIONS[2]);
    setSelectedVehicleState(VEHICLE_OPTIONS[0]);
    setSelectedPaymentState(PAYMENT_METHODS[0]);
    setAppliedPromo(null);
    setCurrentBooking(null);
    setRideHistory(SAMPLE_HISTORIC_RIDES as unknown as BookingState[]);
    setActiveScreenState('home');
  };

  return (
    <RideContext.Provider
      value={{
        activeScreen,
        setScreen,
        userProfile,
        updateProfile,
        topUpWallet,
        pickup,
        destination,
        setPickup,
        setDestination,
        swapLocations,
        selectedVehicle,
        setSelectedVehicle,
        selectedPayment,
        setSelectedPayment,
        promoInput,
        setPromoInput,
        appliedPromo,
        applyPromo,
        removePromo,
        currentBooking,
        startBooking,
        cancelBooking,
        advanceDemo,
        autoAdvanceEnabled,
        setAutoAdvanceEnabled,
        rateTrip,
        rideHistory,
        selectedHistoryRide,
        setSelectedHistoryRide,
        chatMessages,
        sendChatMessage,
        isChatOpen,
        setIsChatOpen,
        resetDemoData,
        soundEnabled,
        toggleSound,
        simulatedCallDriver,
        startSimulatedCall,
        endSimulatedCall,
        isDevMode,
        toggleDevMode,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};
