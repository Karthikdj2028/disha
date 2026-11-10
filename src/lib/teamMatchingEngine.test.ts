import { describe, expect, it } from "vitest";
import { GeoPoint, Timestamp } from "firebase/firestore";
import { recommendTeamsForIncident } from "./teamMatchingEngine";
import type { Incident } from "../types/incident";
import type { ResponseTeam } from "../types/responseTeam";

const incident: Incident = { id: "incident-1", title: "Fire", description: "Smoke visible", category: "Fire Emergency", location: "Central", peopleAffected: 3, severity: "High", severityScore: 4, severityReason: "test", status: "Reported", coordinates: new GeoPoint(13, 80), createdAt: Timestamp.fromDate(new Date(Date.now() - 60_000)) };
const team = (overrides: Partial<ResponseTeam> = {}): ResponseTeam => ({ id: "team-1", teamCode: "FIRE-01", teamName: "Fire Unit", responseCategories: ["Fire"], currentLocation: new GeoPoint(13, 80.01), availabilityStatus: "Available", assignedIncidentId: null, lastLocationUpdate: Timestamp.fromDate(new Date()), ...overrides });

describe("team matching engine", () => {
  it("matches capabilities and ranks available located teams", () => { const result = recommendTeamsForIncident(incident, [team(), team({ id: "team-2", availabilityStatus: "Busy" }), team({ id: "team-3", responseCategories: ["Medical"] })]); expect(result).toHaveLength(1); expect(result[0].team.id).toBe("team-1"); });
  it("returns no location-based candidates without incident coordinates", () => expect(recommendTeamsForIncident({ ...incident, coordinates: undefined }, [team()])).toEqual([]));
  it("prefers the closer otherwise equal team", () => { const result = recommendTeamsForIncident(incident, [team({ id: "near" }), team({ id: "far", currentLocation: new GeoPoint(13.5, 80.5) })]); expect(result[0].team.id).toBe("near"); });
});
