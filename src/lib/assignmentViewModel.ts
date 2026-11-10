import type { Incident } from "../types/incident";
import { calculatePriority } from "./priorityEngine";

export type PrioritySort = "priority" | "newest" | "oldest";

export function isAssignableIncident(incident: Incident): boolean {
  return incident.status !== "Resolved" && incident.assignmentStatus !== "Active";
}

export function filterAndSortAssignableIncidents(incidents: Incident[], search: string, category: string, severity: string, sort: PrioritySort, now = new Date()): Incident[] {
  const normalized = search.trim().toLowerCase();
  return incidents.filter((incident) => isAssignableIncident(incident)
    && (!normalized || `${incident.id} ${incident.title} ${incident.location}`.toLowerCase().includes(normalized))
    && (!category || incident.category === category)
    && (!severity || incident.severity === severity))
    .sort((left, right) => {
      if (sort === "newest") return (right.createdAt?.toMillis() ?? 0) - (left.createdAt?.toMillis() ?? 0);
      if (sort === "oldest") return (left.createdAt?.toMillis() ?? 0) - (right.createdAt?.toMillis() ?? 0);
      return calculatePriority(right, now).score - calculatePriority(left, now).score;
    });
}