import { describe, expect, it } from "vitest";
import { Timestamp } from "firebase/firestore";
import { filterAndSortAssignableIncidents } from "./assignmentViewModel";
import type { Incident } from "../types/incident";

const incident = (id: string, severity: Incident["severity"], status: Incident["status"] = "Reported"): Incident => ({ id, title: id, description: "Details", category: "Fire Emergency", location: "Central", peopleAffected: 3, severity, severityScore: severity === "Critical" ? 6 : 3, severityReason: "test", status, createdAt: Timestamp.fromDate(new Date("2026-01-01T00:00:00Z")) });

describe("assignment incident view model", () => {
  it("returns an empty result when there are no assignable incidents", () => expect(filterAndSortAssignableIncidents([incident("resolved", "High", "Resolved")], "", "", "", "priority")).toEqual([]));
  it("filters by category, severity and search", () => { const result = filterAndSortAssignableIncidents([incident("fire-1", "High"), { ...incident("medical-1", "Critical"), category: "Medical Emergency" }], "fire", "Fire Emergency", "High", "priority"); expect(result.map((item) => item.id)).toEqual(["fire-1"]); });
  it("sorts higher priority incidents first", () => { const result = filterAndSortAssignableIncidents([incident("low", "Low"), incident("critical", "Critical")], "", "", "", "priority"); expect(result[0].id).toBe("critical"); });
});