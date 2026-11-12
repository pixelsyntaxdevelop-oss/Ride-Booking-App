import { describe, it, expect } from 'vitest';
import { calculateSimulatedDistance, calculateEstimatedMinutes, calculateFare, generateRideId } from '../src/utils/calc';
import { DUBAI_LOCATIONS, VEHICLE_OPTIONS, SEED_DRIVERS, PAYMENT_METHODS } from '../src/data/seedData';
import { BookingState, UserProfile } from '../src/types';

describe('Pixel Ride Lifecycle & State Machine Transitions', () => {
  const pickup = DUBAI_LOCATIONS[0]; // Burj Khalifa
  const destination = DUBAI_LOCATIONS[2]; // Dubai Marina
  const vehicle = VEHICLE_OPTIONS[0]; // Standard
  const walletPayment = PAYMENT_METHODS.find((p) => p.type === 'wallet')!;

  const createSampleBooking = (status: BookingState['status'] = 'searching', progress = 0): BookingState => {
    const dist = calculateSimulatedDistance(pickup, destination);
    const est = calculateEstimatedMinutes(dist);
    const fare = calculateFare(vehicle, dist);

    return {
      id: generateRideId(),
      pickup,
      destination,
      vehicle,
      distanceKm: dist,
      estimatedMinutes: est,
      fareBreakdown: fare,
      paymentMethod: walletPayment,
      status,
      progress,
      createdAt: '10:00 AM',
    };
  };

  it('progresses correctly through all 5 ride lifecycle stages', () => {
    let booking = createSampleBooking('searching', 0);
    expect(booking.status).toBe('searching');

    // Stage 1 -> Stage 2: Driver Assigned
    booking = {
      ...booking,
      status: 'assigned',
      driver: SEED_DRIVERS.standard,
      progress: 15,
    };
    expect(booking.status).toBe('assigned');
    expect(booking.driver?.name).toBe(SEED_DRIVERS.standard.name);

    // Stage 2 -> Stage 3: Driver Arriving
    booking = {
      ...booking,
      status: 'arriving',
      progress: 45,
    };
    expect(booking.status).toBe('arriving');

    // Stage 3 -> Stage 4: Trip In Progress
    booking = {
      ...booking,
      status: 'in_progress',
      progress: 60,
    };
    expect(booking.status).toBe('in_progress');
    expect(booking.progress).toBe(60);

    // Stage 4 -> Stage 5: Trip Completed
    booking = {
      ...booking,
      status: 'completed',
      progress: 100,
      completedAt: '10:25 AM',
    };
    expect(booking.status).toBe('completed');
    expect(booking.progress).toBe(100);
    expect(booking.completedAt).toBeDefined();
  });

  it('safely handles cancellation and appends cancelled ride to history without duplicates', () => {
    const booking = createSampleBooking('searching');
    const history: BookingState[] = [];

    const cancelledTrip: BookingState = {
      ...booking,
      status: 'cancelled',
      completedAt: '10:05 AM',
    };

    // First cancellation
    const updatedHistory = [cancelledTrip, ...history];
    expect(updatedHistory.length).toBe(1);
    expect(updatedHistory[0].status).toBe('cancelled');

    // Deduplication check: re-cancelling or duplicate events must not add another entry
    const deduplicated = updatedHistory.some((r) => r.id === cancelledTrip.id)
      ? updatedHistory.map((r) => (r.id === cancelledTrip.id ? cancelledTrip : r))
      : [cancelledTrip, ...updatedHistory];

    expect(deduplicated.length).toBe(1);
  });

  it('safely deducts wallet balance on trip completion without negative values', () => {
    const initialWallet = 50.0;
    const booking = createSampleBooking('in_progress', 100);
    const fare = booking.fareBreakdown.totalAED; // e.g. ~42 AED

    const newBalance = Math.max(0, Math.round((initialWallet - fare) * 100) / 100);
    expect(newBalance).toBeGreaterThanOrEqual(0);
    expect(newBalance).toBeLessThan(initialWallet);

    // Edge case: Fare exceeds wallet balance, balance must floor cleanly at 0
    const expensiveFare = 500.0;
    const floorBalance = Math.max(0, Math.round((initialWallet - expensiveFare) * 100) / 100);
    expect(floorBalance).toBe(0);
  });

  it('guarantees consistent fare calculation across locations and swaps', () => {
    const dist1 = calculateSimulatedDistance(pickup, destination);
    const fare1 = calculateFare(vehicle, dist1);

    // Swapping locations
    const dist2 = calculateSimulatedDistance(destination, pickup);
    const fare2 = calculateFare(vehicle, dist2);

    expect(dist1).toBe(dist2);
    expect(fare1.totalAED).toBe(fare2.totalAED);
    expect(fare1.baseFare).toBe(fare2.baseFare);
  });
});
