import { describe, expect, it } from "vitest";
import { GeoPoint } from "firebase/firestore";
import { haversineDistanceMeters, isValidGeoPoint, metersToKilometers } from "./distanceCalculator";

describe("distance calculator", () => {
  it("returns zero for the same point", () => expect(haversineDistanceMeters(new GeoPoint(13, 80), new GeoPoint(13, 80))).toBe(0));
  it("calculates a known short distance", () => expect(haversineDistanceMeters(new GeoPoint(0, 0), new GeoPoint(0, 1))).toBeCloseTo(111195, -1));
  it("converts meters to kilometers and validates coordinates", () => { expect(metersToKilometers(2500)).toBe(2.5); expect(isValidGeoPoint(new GeoPoint(10, 20))).toBe(true); expect(isValidGeoPoint(undefined)).toBe(false); });
});
