export type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'guest_entry'
  | 'home'
  | 'pickup_select'
  | 'dest_select'
  | 'vehicle_select'
  | 'fare_confirm'
  | 'searching_driver'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'trip_in_progress'
  | 'trip_completed'
  | 'ride_history'
  | 'profile_settings';

export interface LocationPoint {
  id: string;
  name: string;
  area: string;
  description: string;
  category: 'landmark' | 'airport' | 'business' | 'leisure' | 'hotel';
  lat: number;
  lng: number;
  // 0-1000 coordinate space for backwards compatibility and fallback
  x: number;
  y: number;
  popular?: boolean;
}

export type VehicleTier = 'standard' | 'comfort' | 'xl';

export interface VehicleOption {
  id: VehicleTier;
  name: string;
  subtitle: string;
  models: string;
  passengers: number;
  luggage: number;
  rateMultiplier: number;
  baseFareAED: number;
  perKmRateAED: number;
  etaMinutes: number;
  image: string;
  badge?: string;
  features: string[];
}

export interface DriverInfo {
  id: string;
  name: string;
  rating: number;
  totalTrips: number;
  photoUrl: string;
  phone: string;
  vehicleModel: string;
  vehicleColor: string;
  plateNumber: string;
  carTier: VehicleTier;
}

export type PaymentType = 'cash' | 'demo_card' | 'wallet';

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  title: string;
  details: string;
  iconName: string;
  isDefault?: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscountAED: number;
  description: string;
}

export interface BookingState {
  id: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  vehicle: VehicleOption;
  distanceKm: number;
  estimatedMinutes: number;
  fareBreakdown: {
    baseFare: number;
    distanceFare: number;
    salikToll: number;
    serviceFee: number;
    discount: number;
    totalAED: number;
  };
  paymentMethod: PaymentMethod;
  status:
    | 'searching'
    | 'assigned'
    | 'arriving'
    | 'in_progress'
    | 'completed'
    | 'cancelled';
  driver?: DriverInfo;
  progress: number; // 0 to 100
  createdAt: string;
  completedAt?: string;
  rating?: number;
  ratingFeedback?: string[];
  tipAED?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  walletBalanceAED: number;
  totalRides: number;
  savedLocations: {
    home?: LocationPoint;
    work?: LocationPoint;
  };
  soundEffects: boolean;
  currency: 'AED' | 'USD' | 'EUR';
}

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'user';
  text: string;
  time: string;
}
