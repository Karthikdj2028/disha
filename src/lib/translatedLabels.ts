import type { TFunction } from "i18next";

export function translatedStatus(t: TFunction, value: string): string { return t(`status.${value}`, { defaultValue: value }); }
export function translatedSeverity(t: TFunction, value: string): string { return t(`severity.${value}`, { defaultValue: value }); }
export function translatedCategory(t: TFunction, value: string): string { return t(`category.${value}`, { defaultValue: value }); }
export function translatedPriority(t: TFunction, value: string): string { return t(`states.${value.toLowerCase()}`, { defaultValue: value }); }
export function translatedEvent(t: TFunction, value: string): string { const labels: Record<string, string> = { TeamAssigned: "assignments.confirm", TeamReassigned: "assignments.title", TeamReleased: "assignments.active", IncidentResolved: "detail.preliminary" }; return t(labels[value] ?? "assignments.history", { defaultValue: value }); }
