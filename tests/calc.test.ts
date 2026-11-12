import { describe, it, expect } from 'vitest';
import { calculateSimulatedDistance, calculateEstimatedMinutes, calculateFare, generateRideId } from '../src/utils/calc';
import { DUBAI_LOCATIONS, VEHICLE_OPTIONS, VALID_PROMOS } from '../src/data/seedData';

describe('Pixel Ride Calculation Engine', () => {
  it('calculates 0 km for identical locations', () => {
    const loc = DUBAI_LOCATIONS[0];
    const dist = calculateSimulatedDistance(loc, loc);
    expect(dist).toBe(0);
  });

  it('calculates safe 0 km if location is null or undefined', () => {
    expect(calculateSimulatedDistance(null, DUBAI_LOCATIONS[0])).toBe(0);
    expect(calculateSimulatedDistance(undefined, undefined)).toBe(0);
  });

  it('calculates realistic distance between Burj Khalifa and Dubai Marina', () => {
    const burj = DUBAI_LOCATIONS.find((l) => l.id === 'burj-khalifa')!;
    const marina = DUBAI_LOCATIONS.find((l) => l.id === 'dubai-marina')!;
    const dist = calculateSimulatedDistance(burj, marina);
    expect(dist).toBeGreaterThan(15);
    expect(dist).toBeLessThan(35);
  });

  it('calculates realistic distance between Burj Khalifa and DXB Airport', () => {
    const burj = DUBAI_LOCATIONS.find((l) => l.id === 'burj-khalifa')!;
    const dxb = DUBAI_LOCATIONS.find((l) => l.id === 'dxb-airport')!;
    const dist = calculateSimulatedDistance(burj, dxb);
    expect(dist).toBeGreaterThan(10);
    expect(dist).toBeLessThan(30);
  });

  it('calculates realistic trip duration in minutes', () => {
    expect(calculateEstimatedMinutes(0)).toBe(0);
    expect(calculateEstimatedMinutes(5)).toBeGreaterThanOrEqual(6);
    expect(calculateEstimatedMinutes(24)).toBeGreaterThan(20);
  });

  it('calculates consistent vehicle fares for Standard, Comfort, XL', () => {
    const standard = VEHICLE_OPTIONS.find((v) => v.id === 'standard')!;
    const comfort = VEHICLE_OPTIONS.find((v) => v.id === 'comfort')!;
    const xl = VEHICLE_OPTIONS.find((v) => v.id === 'xl')!;

    const dist = 15.0; // 15 km trip

    const fareStd = calculateFare(standard, dist);
    const fareComf = calculateFare(comfort, dist);
    const fareXl = calculateFare(xl, dist);

    // Standard must be less than Comfort, which is less than XL
    expect(fareStd.totalAED).toBeLessThan(fareComf.totalAED);
    expect(fareComf.totalAED).toBeLessThan(fareXl.totalAED);

    // Salik toll must be applied because dist > 8 km
    expect(fareStd.salikToll).toBe(4.0);
    expect(fareComf.salikToll).toBe(4.0);
    expect(fareXl.salikToll).toBe(4.0);

    // Platform service fee must be 3.5
    expect(fareStd.serviceFee).toBe(3.5);
  });

  it('does not charge Salik toll for short trips <= 8 km', () => {
    const standard = VEHICLE_OPTIONS.find((v) => v.id === 'standard')!;
    const fareShort = calculateFare(standard, 4.2);
    expect(fareShort.salikToll).toBe(0.0);
  });

  it('applies promo code discounts and caps correctly', () => {
    const comfort = VEHICLE_OPTIONS.find((v) => v.id === 'comfort')!;
    const promo = VALID_PROMOS.find((p) => p.code === 'PIXELSYNTAX')!; // 20% off up to AED 30

    const fare = calculateFare(comfort, 25.0, promo.discountPercent, promo.maxDiscountAED);
    expect(fare.discount).toBeGreaterThan(0);
    expect(fare.discount).toBeLessThanOrEqual(promo.maxDiscountAED);
    expect(fare.totalAED).toBeLessThan(fare.baseFare + fare.distanceFare + fare.salikToll + fare.serviceFee);
  });

  it('generates unique PX- prefixed ride IDs', () => {
    const id1 = generateRideId();
    const id2 = generateRideId();
    expect(id1).toMatch(/^PX-\d{5}$/);
    expect(id2).toMatch(/^PX-\d{5}$/);
    expect(id1).not.toBe(id2);
  });
});
