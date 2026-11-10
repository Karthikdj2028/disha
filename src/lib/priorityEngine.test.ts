import { describe, expect, it } from "vitest";
import { Timestamp } from "firebase/firestore";
import { calculatePriority } from "./priorityEngine";
import type { Incident } from "../types/incident";

const base: Incident = { id: "i", title: "Incident", description: "Details", category: "Other Emergencies", location: "Location", peopleAffected: 0, severity: "Low", severityScore: 1, severityReason: "test", status: "Reported", createdAt: Timestamp.fromDate(new Date("2026-01-01T00:00:00Z")) };

describe("priority engine", () => {
  it("increases operational priority with elapsed time without changing severity", () => { const result = calculatePriority(base, new Date("2026-01-01T02:00:00Z")); expect(result.waitingMinutes).toBe(120); expect(result.score).toBeGreaterThan(0); expect(base.severity).toBe("Low"); });
  it("accounts for critical incidents and affected people", () => { const result = calculatePriority({ ...base, severity: "Critical", peopleAffected: 10, category: "Building Collapse" }, new Date("2026-01-01T00:30:00Z")); expect(result.rank).toBe("Immediate"); });
});
