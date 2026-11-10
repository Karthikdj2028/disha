import type { Incident } from "../types/incident";
import type { TeamRecommendation } from "../types/assignment";
import type { ResponseTeam } from "../types/responseTeam";
import { haversineDistanceMeters, isValidGeoPoint, metersToKilometers } from "./distanceCalculator";

export interface MatchingWeights { capability: number; travel: number; capacity: number; freshness: number; }
export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = { capability: 0.4, travel: 0.35, capacity: 0.15, freshness: 0.1 };

function requiredCapabilities(category: Incident["category"]): string[] {
  if (category === "Fire Emergency") return ["Fire", "General Emergency"];
  if (category === "Medical Emergency") return ["Medical", "General Emergency"];
  if (category === "Building Collapse") return ["Rescue", "General Emergency"];
  if (category === "Flood") return ["Flood Rescue", "Rescue", "General Emergency"];
  return ["Rescue", "General Emergency"];
}

export function matchTeamCapabilities(incident: Incident, team: ResponseTeam): boolean {
  const required = requiredCapabilities(incident.category);
  return required.some((capability) => team.responseCategories.includes(capability as ResponseTeam["responseCategories"][number]));
}

export function recommendTeamsForIncident(incident: Incident, teams: ResponseTeam[], now = new Date(), weights = DEFAULT_MATCHING_WEIGHTS): TeamRecommendation[] {
  if (!incident.coordinates) return [];
  return teams.filter((team) => team.availabilityStatus === "Available" && isValidGeoPoint(team.currentLocation) && matchTeamCapabilities(incident, team)).map((team) => {
    const distanceMeters = haversineDistanceMeters(incident.coordinates!, team.currentLocation!);
    const capabilityScore = 1;
    const travelScore = 1 / (1 + distanceMeters / 10000);
    const capacityScore = Math.min(1, (team.memberCount ?? 1) / Math.max(1, incident.peopleAffected));
    const ageMinutes = team.lastLocationUpdate ? Math.max(0, (now.getTime() - team.lastLocationUpdate.toDate().getTime()) / 60000) : 120;
    const freshnessScore = Math.max(0, 1 - ageMinutes / 120);
    const recommendationScore = Math.round((capabilityScore * weights.capability + travelScore * weights.travel + capacityScore * weights.capacity + freshnessScore * weights.freshness) * 100);
    return { team, distanceMeters, distanceKilometers: metersToKilometers(distanceMeters), recommendationScore, capabilityScore, travelScore, capacityScore, freshnessScore, scoreExplanation: `Capability 40%; straight-line travel proximity 35%; capacity 15%; location freshness 10%. Road distance and ETA are unavailable until a routing service is configured.` };
  }).sort((left, right) => right.recommendationScore - left.recommendationScore);
}