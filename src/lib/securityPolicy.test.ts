import { describe, expect, it } from "vitest";
import { Timestamp } from "firebase/firestore";
import { canDeleteIncident, canManuallySetTeamAvailability, incidentDeletionBlockReason, isValidAssignmentTransition } from "./securityPolicy";
import type { Incident } from "../types/incident";
import type { ResponseTeam } from "../types/responseTeam";

const baseIncident: Incident = {
  id: "incident-1",
  title: "Test incident",
  description: "Test details",
  category: "Fire Emergency",
  location: "Test location",
  peopleAffected: 1,
  severity: "Low",
  severityScore: 1,
  severityReason: "Test",
  status: "Reported",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

const baseTeam: ResponseTeam = {
  id: "team-1",
  teamCode: "TEAM-1",
  teamName: "Test team",
  responseCategories: ["Fire"],
  availabilityStatus: "Available",
  assignedIncidentId: null,
};

describe("Firestore-aligned security policies", () => {
  it("allows deletion only for never-assigned incidents", () => {
    expect(canDeleteIncident(baseIncident)).toBe(true);
    expect(incidentDeletionBlockReason({ ...baseIncident, assignmentStatus: "Completed" })).toContain("assignment history");
    expect(canDeleteIncident({ ...baseIncident, activeAssignmentId: "assignment-1" })).toBe(false);
  });

  it("rejects manual Busy changes and changes for an assigned team", () => {
    expect(canManuallySetTeamAvailability(baseTeam, "Busy")).toBe(false);
    expect(canManuallySetTeamAvailability({ ...baseTeam, assignedIncidentId: "incident-1" }, "Available")).toBe(false);
    expect(canManuallySetTeamAvailability(baseTeam, "Unavailable")).toBe(true);
  });

  it("allows only active assignment release transitions", () => {
    expect(isValidAssignmentTransition("Active", "Released")).toBe(true);
    expect(isValidAssignmentTransition("Active", "Completed")).toBe(true);
    expect(isValidAssignmentTransition("Released", "Active")).toBe(false);
    expect(isValidAssignmentTransition("Completed", "Active")).toBe(false);
  });
});
