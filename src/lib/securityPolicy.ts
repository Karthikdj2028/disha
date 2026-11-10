import type { Incident } from "../types/incident";
import type { AvailabilityStatus, ResponseTeam } from "../types/responseTeam";

export function incidentDeletionBlockReason(incident: Incident): string | null {
  if (incident.assignmentStatus || incident.activeAssignmentId || incident.assignedTeamId || incident.assignedTeamName || incident.assignedAt) {
    return "This incident cannot be deleted because it has assignment history. Resolve or release the assignment first.";
  }
  return null;
}

export function canDeleteIncident(incident: Incident): boolean {
  return incidentDeletionBlockReason(incident) === null;
}

export function canManuallySetTeamAvailability(team: ResponseTeam, nextStatus: AvailabilityStatus): boolean {
  if (nextStatus === "Busy") return false;
  return team.assignedIncidentId === null;
}

export function isValidAssignmentTransition(from: "Active" | "Released" | "Completed", to: "Active" | "Released" | "Completed"): boolean {
  return from === "Active" && (to === "Released" || to === "Completed");
}
