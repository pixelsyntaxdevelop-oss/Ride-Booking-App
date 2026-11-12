import { LocationPoint, VehicleOption } from '../types';

/**
 * Calculates simulated real-world kilometers between two UAE points.
 * Calibrated so typical trips across Dubai range between 5 km and 32 km.
 */
export function calculateSimulatedDistance(p1?: LocationPoint | null, p2?: LocationPoint | null): number {
  if (!p1 || !p2 || p1.id === p2.id) return 0;
  const dx = (p1.x - p2.x) * 0.055;
  const dy = (p1.y - p2.y) * 0.055;
  const euclidean = Math.sqrt(dx * dx + dy * dy);
  // Add road network curvature factor (1.28x) plus minimum urban trip distance of 3.8 km
  const roadDistance = Math.max(3.5, euclidean * 1.28 + 2.5);
  return Math.round(roadDistance * 10) / 10;
}

/**
 * Calculates estimated trip duration in minutes given distance in km.
 * Takes into account typical Dubai urban & highway traffic speeds (approx 45-60 km/h average).
 */
export function calculateEstimatedMinutes(distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  const baseMinutes = Math.round((distanceKm / 48) * 60);
  // Minimum trip duration is 6 mins
  return Math.max(6, baseMinutes + 3);
}

/**
 * Calculates full transparent AED fare breakdown.
 */
export function calculateFare(
  vehicle: VehicleOption,
  distanceKm: number,
  discountPercentage: number = 0,
  maxDiscountAED: number = 0
) {
  const baseFare = vehicle.baseFareAED;
  const distanceFare = Math.round(distanceKm * vehicle.perKmRateAED * 100) / 100;
  // Dubai Salik toll simulation (AED 4 on trips > 8 km)
  const salikToll = distanceKm > 8 ? 4.0 : 0.0;
  const serviceFee = 3.5; // Booking & technology fee

  const subtotal = baseFare + distanceFare + salikToll + serviceFee;

  let rawDiscount = 0;
  if (discountPercentage > 0) {
    rawDiscount = (subtotal * discountPercentage) / 100;
    if (maxDiscountAED > 0 && rawDiscount > maxDiscountAED) {
      rawDiscount = maxDiscountAED;
    }
  }
  const discount = Math.round(rawDiscount * 100) / 100;
  const totalAED = Math.max(15, Math.round((subtotal - discount) * 100) / 100);

  return {
    baseFare,
    distanceFare,
    salikToll,
    serviceFee,
    discount,
    totalAED,
  };
}

export function generateRideId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PX-${randomNum}`;
}
