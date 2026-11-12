import { describe, it, expect } from 'vitest';
import {
  generateDubaiRoadRoute,
  interpolateRoutePosition,
  calculateBearing,
  getNearbyDubaiTaxis,
} from '../src/utils/dubaiRouting';
import { DUBAI_LOCATIONS } from '../src/data/seedData';

describe('Dubai Road Routing & Vehicle Interpolation', () => {
  it('generates road-following waypoints along highway corridors', () => {
    const pickup = DUBAI_LOCATIONS.find((l) => l.id === 'burj-khalifa')!;
    const destination = DUBAI_LOCATIONS.find((l) => l.id === 'dxb-airport')!;

    const route = generateDubaiRoadRoute([pickup.lng, pickup.lat], [destination.lng, destination.lat]);

    // Should contain multiple intermediate highway coordinates, not just 2 points
    expect(route.length).toBeGreaterThan(4);
    expect(route[0]).toEqual([pickup.lng, pickup.lat]);
    expect(route[route.length - 1]).toEqual([destination.lng, destination.lat]);

    // Verify all coordinates are within realistic Dubai geographic boundary
    route.forEach(([lng, lat]) => {
      expect(lng).toBeGreaterThan(55.0);
      expect(lng).toBeLessThan(55.5);
      expect(lat).toBeGreaterThan(25.0);
      expect(lat).toBeLessThan(25.4);
    });
  });

  it('calculates realistic compass bearings between waypoints', () => {
    // Due North
    const bearingNorth = calculateBearing([55.0, 25.0], [55.0, 25.1]);
    expect(Math.round(bearingNorth)).toBe(0);

    // Due East
    const bearingEast = calculateBearing([55.0, 25.0], [55.1, 25.0]);
    expect(Math.round(bearingEast)).toBe(90);
  });

  it('interpolates vehicle coordinates and bearing smoothly along route', () => {
    const coords: [number, number][] = [
      [55.2744, 25.1972], // Burj Khalifa
      [55.2810, 25.2105], // DIFC
      [55.3657, 25.2532], // DXB
    ];

    // At 0% progress, vehicle is at the start
    const start = interpolateRoutePosition(coords, 0);
    expect(start.lng).toBeCloseTo(55.2744, 3);
    expect(start.lat).toBeCloseTo(25.1972, 3);

    // At 50% progress, vehicle is midway
    const mid = interpolateRoutePosition(coords, 50);
    expect(mid.lng).toBeGreaterThan(55.2744);
    expect(mid.lat).toBeGreaterThan(25.1972);

    // At 100% progress, vehicle reaches destination
    const end = interpolateRoutePosition(coords, 100);
    expect(end.lng).toBeCloseTo(55.3657, 3);
    expect(end.lat).toBeCloseTo(25.2532, 3);
  });

  it('spawns realistic nearby chauffeur vehicle coordinates in Dubai', () => {
    const downtown = { lat: 25.1972, lng: 55.2744 };
    const taxis = getNearbyDubaiTaxis(downtown);

    expect(taxis.length).toBe(5);
    taxis.forEach((taxi) => {
      expect(['standard', 'comfort', 'xl']).toContain(taxi.tier);
      expect(taxi.plate).toMatch(/^DXB/);
      expect(Math.abs(taxi.lat - downtown.lat)).toBeLessThan(0.02);
      expect(Math.abs(taxi.lng - downtown.lng)).toBeLessThan(0.02);
    });
  });
});
