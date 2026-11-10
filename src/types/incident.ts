import type { GeoPoint, Timestamp } from "firebase/firestore";

export const CATEGORIES = [
  "Fire Emergency",
  "Road Accident",
  "Medical Emergency",
  "Flood",
  "Building Collapse",
  "Other Emergencies",
] as const;

export const STATUSES = ["Reported", "Pending", "Assigned", "In Progress", "Resolved"] as const;
export const SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;

export type IncidentCategory = (typeof CATEGORIES)[number];
export type IncidentStatus = (typeof STATUSES)[number];
export type Severity = (typeof SEVERITIES)[number];

export interface NewIncidentInput {
  title: string;
  description: string;
  category: IncidentCategory;
  location: string;
  peopleAffected: number;
  contactInfo?: string;
  coordinates?: GeoPoint;
  latitude?: number;
  longitude?: number;
}

export interface Incident extends NewIncidentInput {
  id: string;
  severity: Severity;
  severityScore: number;
  severityReason: string;
  status: IncidentStatus;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedAt?: Timestamp;
  assignmentStatus?: "Active" | "Released" | "Completed";
  activeAssignmentId?: string;
}