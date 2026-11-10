import type { GeoPoint } from "firebase/firestore";

const EARTH_RADIUS_METERS = 6_371_000;

export function haversineDistanceMeters(from: GeoPoint, to: GeoPoint): number {
  const latitudeDelta = (to.latitude - from.latitude) * Math.PI / 180;
  const longitudeDelta = (to.longitude - from.longitude) * Math.PI / 180;
  const fromLatitude = from.latitude * Math.PI / 180;
  const toLatitude = to.latitude * Math.PI / 180;
  const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function isValidGeoPoint(point: GeoPoint | undefined): point is GeoPoint {
  return Boolean(point && Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Math.abs(point.latitude) <= 90 && Math.abs(point.longitude) <= 180);
}

export function metersToKilometers(meters: number): number { return meters / 1000; }