/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence } from 'motion/react';
import { RideProvider, useRide } from './context/RideContext';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { BottomNav } from './components/common/BottomNav';
import { SimulatedCallModal } from './components/common/SimulatedCallModal';

// 15 Connected Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { GuestEntryScreen } from './components/screens/GuestEntryScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { PickupScreen } from './components/screens/PickupScreen';
import { DestinationScreen } from './components/screens/DestinationScreen';
import { VehicleSelectionScreen } from './components/screens/VehicleSelectionScreen';
import { FareConfirmScreen } from './components/screens/FareConfirmScreen';
import { SearchingDriverScreen } from './components/screens/SearchingDriverScreen';
import { DriverAssignedScreen } from './components/screens/DriverAssignedScreen';
import { DriverArrivingScreen } from './components/screens/DriverArrivingScreen';
import { TripInProgressScreen } from './components/screens/TripInProgressScreen';
import { TripCompletedScreen } from './components/screens/TripCompletedScreen';
import { RideHistoryScreen } from './components/screens/RideHistoryScreen';
import { ProfileSettingsScreen } from './components/screens/ProfileSettingsScreen';

const ScreenRouter: React.FC = () => {
  const { activeScreen } = useRide();

  return (
    <main className="w-full h-full flex-1 flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {activeScreen === 'splash' && <SplashScreen key="splash" />}
        {activeScreen === 'onboarding' && <OnboardingScreen key="onboarding" />}
        {activeScreen === 'guest_entry' && <GuestEntryScreen key="guest_entry" />}
        {activeScreen === 'home' && <HomeScreen key="home" />}
        {activeScreen === 'pickup_select' && <PickupScreen key="pickup_select" />}
        {activeScreen === 'dest_select' && <DestinationScreen key="dest_select" />}
        {activeScreen === 'vehicle_select' && <VehicleSelectionScreen key="vehicle_select" />}
        {activeScreen === 'fare_confirm' && <FareConfirmScreen key="fare_confirm" />}
        {activeScreen === 'searching_driver' && <SearchingDriverScreen key="searching_driver" />}
        {activeScreen === 'driver_assigned' && <DriverAssignedScreen key="driver_assigned" />}
        {activeScreen === 'driver_arriving' && <DriverArrivingScreen key="driver_arriving" />}
        {activeScreen === 'trip_in_progress' && <TripInProgressScreen key="trip_in_progress" />}
        {activeScreen === 'trip_completed' && <TripCompletedScreen key="trip_completed" />}
        {activeScreen === 'ride_history' && <RideHistoryScreen key="ride_history" />}
        {activeScreen === 'profile_settings' && <ProfileSettingsScreen key="profile_settings" />}
      </AnimatePresence>
    </main>
  );
};

export default function App() {
  return (
    <RideProvider>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center sm:py-6">
        {/* Mobile Device Frame Container (Smooth responsiveness from 320px to Desktop) */}
        <div className="w-full sm:max-w-md min-h-screen sm:min-h-[852px] sm:max-h-[852px] bg-white text-slate-900 flex flex-col relative sm:shadow-2xl sm:rounded-[42px] sm:border-[8px] sm:border-slate-800 overflow-hidden">
          {/* Offline Status Toast */}
          <OfflineIndicator />

          {/* Active Screen Router */}
          <ScreenRouter />

          {/* Persistent Mobile Bottom Navigation */}
          <BottomNav />

          {/* In-App Simulated Chauffeur Call Screen */}
          <SimulatedCallModal />
        </div>
      </div>
    </RideProvider>
  );
}
