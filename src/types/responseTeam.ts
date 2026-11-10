import type { GeoPoint, Timestamp } from "firebase/firestore";

export const RESPONSE_CATEGORIES = ["Fire", "Medical", "Rescue", "Flood Rescue", "General Emergency"] as const;
export const AVAILABILITY_STATUSES = ["Available", "Busy", "Unavailable"] as const;
export type ResponseCategory = (typeof RESPONSE_CATEGORIES)[number];
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

export interface ResponseTeam { id: string; teamCode: string; teamName: string; responseCategories: ResponseCategory[]; currentLocation?: GeoPoint; availabilityStatus: AvailabilityStatus; assignedIncidentId: string | null; memberCount?: number; lastLocationUpdate?: Timestamp; createdAt?: Timestamp; updatedAt?: Timestamp; }
export interface NewResponseTeam { teamCode: string; teamName: string; responseCategories: ResponseCategory[]; currentLocation?: GeoPoint; availabilityStatus: AvailabilityStatus; assignedIncidentId?: string | null; memberCount?: number; }
