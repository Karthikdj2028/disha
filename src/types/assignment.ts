import type { Timestamp } from "firebase/firestore";
import type { ResponseTeam } from "./responseTeam";

export type AssignmentStatus = "Active" | "Released" | "Completed";
export type AssignmentEventType = "TeamAssigned" | "TeamReassigned" | "TeamReleased" | "IncidentResolved";

export interface Assignment {
  id: string;
  incidentId: string;
  teamId: string;
  teamName: string;
  assignedByUid: string;
  assignedAt?: Timestamp;
  assignmentStatus: AssignmentStatus;
  distanceMeters: number;
  roadDistanceMeters?: number;
  estimatedTravelSeconds?: number;
  recommendationScore: number;
  scoreExplanation: string;
  releasedAt?: Timestamp;
}

export interface AssignmentEvent {
  id: string;
  incidentId: string;
  teamId: string;
  eventType: AssignmentEventType;
  actorUid: string;
  timestamp?: Timestamp;
  description: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface TeamRecommendation {
  team: ResponseTeam;
  distanceMeters: number;
  distanceKilometers: number;
  recommendationScore: number;
  scoreExplanation: string;
  capabilityScore: number;
  travelScore: number;
  capacityScore: number;
  freshnessScore: number;
}