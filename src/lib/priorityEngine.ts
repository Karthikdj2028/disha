import type { Incident } from "../types/incident";

export interface PriorityWeights { severity: number; peopleAffected: number; waitingTime: number; category: number; }
export interface PriorityResult { score: number; rank: "Routine" | "Elevated" | "Urgent" | "Immediate"; explanation: string; components: { severity: number; peopleAffected: number; waitingTime: number; category: number }; waitingMinutes: number; }

export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = { severity: 0.4, peopleAffected: 0.25, waitingTime: 0.2, category: 0.15 };
const SEVERITY_VALUES: Record<Incident["severity"], number> = { Low: 0.25, Medium: 0.5, High: 0.75, Critical: 1 };
const CATEGORY_VALUES: Record<Incident["category"], number> = { "Building Collapse": 1, "Fire Emergency": 0.9, "Medical Emergency": 0.8, "Road Accident": 0.75, Flood: 0.7, "Other Emergencies": 0.4 };

function createdDate(incident: Incident): Date {
  return incident.createdAt?.toDate() ?? new Date();
}

export function calculatePriority(incident: Incident, now = new Date(), weights = DEFAULT_PRIORITY_WEIGHTS): PriorityResult {
  const waitingMinutes = Math.max(0, (now.getTime() - createdDate(incident).getTime()) / 60000);
  const severity = SEVERITY_VALUES[incident.severity];
  const peopleAffected = Math.min(1, incident.peopleAffected / 10);
  const waitingTime = Math.min(1, waitingMinutes / 120);
  const category = CATEGORY_VALUES[incident.category] ?? 0.4;
  const score = Math.round((severity * weights.severity + peopleAffected * weights.peopleAffected + waitingTime * weights.waitingTime + category * weights.category) * 100);
  const rank = score >= 80 ? "Immediate" : score >= 60 ? "Urgent" : score >= 35 ? "Elevated" : "Routine";
  return { score, rank, waitingMinutes, components: { severity, peopleAffected, waitingTime, category }, explanation: `Severity contributes ${Math.round(severity * weights.severity * 100)} points; affected people contribute ${Math.round(peopleAffected * weights.peopleAffected * 100)}; waiting time contributes ${Math.round(waitingTime * weights.waitingTime * 100)}; category contributes ${Math.round(category * weights.category * 100)}.` };
}
