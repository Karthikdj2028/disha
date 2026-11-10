import type { NewIncidentInput, Severity } from "../types/incident";

const CATEGORY_WEIGHTS: Record<NewIncidentInput["category"], number> = {
  "Building Collapse": 4,
  "Fire Emergency": 3,
  "Road Accident": 2,
  "Medical Emergency": 2,
  Flood: 2,
  "Other Emergencies": 1,
};

const CRITICAL_KEYWORDS = ["trapped", "unconscious", "explosion", "multiple casualties"];
const URGENT_KEYWORDS = ["injured", "smoke", "rising water", "burning"];

export function classifySeverity(input: NewIncidentInput): {
  severity: Severity;
  severityScore: number;
  severityReason: string;
} {
  const text = `${input.title} ${input.description}`.toLowerCase();
  const categoryScore = CATEGORY_WEIGHTS[input.category];
  const peopleScore = input.peopleAffected >= 10 ? 3 : input.peopleAffected >= 5 ? 2 : input.peopleAffected >= 2 ? 1 : 0;
  const criticalMatches = CRITICAL_KEYWORDS.filter((keyword) => text.includes(keyword));
  const urgentMatches = URGENT_KEYWORDS.filter((keyword) => text.includes(keyword));
  const keywordScore = criticalMatches.length > 0 ? 2 : urgentMatches.length > 0 ? 1 : 0;
  const severityScore = categoryScore + peopleScore + keywordScore;
  const severity: Severity = severityScore >= 6 ? "Critical" : severityScore >= 4 ? "High" : severityScore >= 2 ? "Medium" : "Low";
  const keywordReason = criticalMatches.length > 0
    ? `Critical keywords: ${criticalMatches.join(", ")}`
    : urgentMatches.length > 0
      ? `Urgent keywords: ${urgentMatches.join(", ")}`
      : "No recognized urgency keywords";

  return {
    severity,
    severityScore,
    severityReason: `Category weight ${categoryScore}; ${peopleScore} points for people affected; ${keywordReason}. Preliminary software priority indicator only.`,
  };
}