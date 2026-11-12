import { describe, it, expect } from 'vitest';
import {
  DUBAI_LOCATIONS,
  VEHICLE_OPTIONS,
  SEED_DRIVERS,
  PAYMENT_METHODS,
  VALID_PROMOS,
  INITIAL_USER,
} from '../src/data/seedData';

describe('Pixel Ride Seed Data & Configuration', () => {
  it('contains valid and diverse Dubai locations', () => {
    expect(DUBAI_LOCATIONS.length).toBeGreaterThanOrEqual(10);
    DUBAI_LOCATIONS.forEach((loc) => {
      expect(loc.id).toBeTruthy();
      expect(loc.name).toBeTruthy();
      expect(loc.area).toBeTruthy();
      expect(loc.x).toBeGreaterThanOrEqual(0);
      expect(loc.x).toBeLessThanOrEqual(1000);
      expect(loc.y).toBeGreaterThanOrEqual(0);
      expect(loc.y).toBeLessThanOrEqual(1000);
    });
  });

  it('contains Standard, Comfort, and XL vehicle classes', () => {
    const ids = VEHICLE_OPTIONS.map((v) => v.id);
    expect(ids).toContain('standard');
    expect(ids).toContain('comfort');
    expect(ids).toContain('xl');

    VEHICLE_OPTIONS.forEach((veh) => {
      expect(veh.passengers).toBeGreaterThanOrEqual(4);
      expect(veh.baseFareAED).toBeGreaterThan(0);
      expect(veh.perKmRateAED).toBeGreaterThan(0);
      expect(veh.features.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('provides matching dedicated drivers for each vehicle tier', () => {
    expect(SEED_DRIVERS.standard.carTier).toBe('standard');
    expect(SEED_DRIVERS.comfort.carTier).toBe('comfort');
    expect(SEED_DRIVERS.xl.carTier).toBe('xl');

    Object.values(SEED_DRIVERS).forEach((driver) => {
      expect(driver.name).toBeTruthy();
      expect(driver.rating).toBeGreaterThan(4.8);
      expect(driver.plateNumber).toContain('DXB');
    });
  });

  it('provides demo payment options without real cards', () => {
    expect(PAYMENT_METHODS.length).toBeGreaterThanOrEqual(3);
    const types = PAYMENT_METHODS.map((pm) => pm.type);
    expect(types).toContain('demo_card');
    expect(types).toContain('cash');
    expect(types).toContain('wallet');
  });

  it('provides working promo codes including PIXELSYNTAX', () => {
    const pixelSyntaxPromo = VALID_PROMOS.find((p) => p.code === 'PIXELSYNTAX');
    expect(pixelSyntaxPromo).toBeDefined();
    expect(pixelSyntaxPromo?.discountPercent).toBe(20);
  });

  it('has initial guest user profile with positive demo wallet balance', () => {
    expect(INITIAL_USER.walletBalanceAED).toBeGreaterThan(0);
    expect(INITIAL_USER.name).toBeTruthy();
    expect(INITIAL_USER.savedLocations.home).toBeDefined();
    expect(INITIAL_USER.savedLocations.work).toBeDefined();
  });
});
