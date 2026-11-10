import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, runTransaction, serverTimestamp, type Unsubscribe } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { matchTeamCapabilities, recommendTeamsForIncident as rankTeams } from "../lib/teamMatchingEngine";
import { isValidGeoPoint } from "../lib/distanceCalculator";
import type { Assignment, AssignmentEvent, TeamRecommendation } from "../types/assignment";
import type { Incident, IncidentStatus } from "../types/incident";
import type { ResponseTeam } from "../types/responseTeam";

const incidents = collection(db, "incidents");
const teams = collection(db, "responseTeams");
const assignments = collection(db, "assignments");
const assignmentEvents = collection(db, "assignmentEvents");

function adminUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Your administrator session has expired.");
  return uid;
}

export async function recommendTeamsForIncident(incidentId: string): Promise<TeamRecommendation[]> {
  const [incidentSnapshot, teamSnapshot] = await Promise.all([getDoc(doc(incidents, incidentId)), getDocs(query(teams, orderBy("teamName")))]);
  if (!incidentSnapshot.exists()) throw new Error("Incident no longer exists.");
  const incident = { id: incidentSnapshot.id, ...incidentSnapshot.data() } as Incident;
  return rankTeams(incident, teamSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as ResponseTeam[]);
}

export async function assignTeamToIncident(incidentId: string, teamId: string, recommendation: TeamRecommendation): Promise<string> {
  const uid = adminUid();
  const assignmentRef = doc(assignments);
  const eventRef = doc(assignmentEvents);
  await runTransaction(db, async (transaction) => {
    const incidentRef = doc(incidents, incidentId);
    const teamRef = doc(teams, teamId);
    const [incidentSnapshot, teamSnapshot] = await Promise.all([transaction.get(incidentRef), transaction.get(teamRef)]);
    if (!incidentSnapshot.exists()) throw new Error("Incident no longer exists.");
    if (!teamSnapshot.exists()) throw new Error("Response team no longer exists.");
    const incident = { id: incidentSnapshot.id, ...incidentSnapshot.data() } as Incident;
    const team = { id: teamSnapshot.id, ...teamSnapshot.data() } as ResponseTeam;
    if (team.availabilityStatus !== "Available") throw new Error("Assignment conflict: this team is no longer available.");
    if (incident.assignedTeamId && incident.assignmentStatus === "Active") throw new Error("Assignment conflict: this incident already has an active team.");
    if (!incident.coordinates || !isValidGeoPoint(team.currentLocation) || !matchTeamCapabilities(incident, team)) throw new Error("This team is not eligible for location-based assignment.");
    const now = serverTimestamp();
    transaction.update(teamRef, { availabilityStatus: "Busy", assignedIncidentId: incidentId, updatedAt: now });
    transaction.update(incidentRef, { assignedTeamId: teamId, assignedTeamName: team.teamName, assignedAt: now, assignmentStatus: "Active", activeAssignmentId: assignmentRef.id, status: "Assigned", updatedAt: now });
    transaction.set(assignmentRef, { incidentId, teamId, teamName: team.teamName, assignedByUid: uid, assignedAt: now, assignmentStatus: "Active", distanceMeters: recommendation.distanceMeters, recommendationScore: recommendation.recommendationScore, scoreExplanation: recommendation.scoreExplanation });
    transaction.set(eventRef, { incidentId, teamId, eventType: "TeamAssigned", actorUid: uid, timestamp: now, description: `Assigned ${team.teamName} by administrator confirmation.`, metadata: { recommendationScore: recommendation.recommendationScore, distanceMeters: recommendation.distanceMeters } });
  });
  return assignmentRef.id;
}

export async function reassignTeam(incidentId: string, newTeamId: string, recommendation: TeamRecommendation, reason: string): Promise<string> {
  const uid = adminUid();
  const newAssignmentRef = doc(assignments);
  const eventRef = doc(assignmentEvents);
  await runTransaction(db, async (transaction) => {
    const incidentRef = doc(incidents, incidentId);
    const newTeamRef = doc(teams, newTeamId);
    const incidentSnapshot = await transaction.get(incidentRef);
    const newTeamSnapshot = await transaction.get(newTeamRef);
    if (!incidentSnapshot.exists() || !newTeamSnapshot.exists()) throw new Error("Incident or response team no longer exists.");
    const incident = { id: incidentSnapshot.id, ...incidentSnapshot.data() } as Incident;
    const newTeam = { id: newTeamSnapshot.id, ...newTeamSnapshot.data() } as ResponseTeam;
    if (newTeam.availabilityStatus !== "Available") throw new Error("Assignment conflict: replacement team is no longer available.");
    if (incident.assignedTeamId === newTeamId) throw new Error("This team is already assigned to the incident.");
    if (!incident.coordinates || !isValidGeoPoint(newTeam.currentLocation) || !matchTeamCapabilities(incident, newTeam)) throw new Error("This team is not eligible for location-based assignment.");
    const oldTeamRef = incident.assignedTeamId ? doc(teams, incident.assignedTeamId) : null;
    const oldAssignmentRef = incident.activeAssignmentId ? doc(assignments, incident.activeAssignmentId) : null;
    const oldAssignmentSnapshot = oldAssignmentRef ? await transaction.get(oldAssignmentRef) : null;
    const now = serverTimestamp();
    if (oldTeamRef) transaction.update(oldTeamRef, { availabilityStatus: "Available", assignedIncidentId: null, updatedAt: now });
    transaction.update(newTeamRef, { availabilityStatus: "Busy", assignedIncidentId: incidentId, updatedAt: now });
    if (oldAssignmentRef && oldAssignmentSnapshot?.exists()) transaction.update(oldAssignmentRef, { assignmentStatus: "Released", releasedAt: now });
    transaction.update(incidentRef, { assignedTeamId: newTeamId, assignedTeamName: newTeam.teamName, assignedAt: now, assignmentStatus: "Active", activeAssignmentId: newAssignmentRef.id, status: "Assigned", updatedAt: now });
    transaction.set(newAssignmentRef, { incidentId, teamId: newTeamId, teamName: newTeam.teamName, assignedByUid: uid, assignedAt: now, assignmentStatus: "Active", distanceMeters: recommendation.distanceMeters, recommendationScore: recommendation.recommendationScore, scoreExplanation: recommendation.scoreExplanation, reassignmentReason: reason });
    transaction.set(eventRef, { incidentId, teamId: newTeamId, eventType: "TeamReassigned", actorUid: uid, timestamp: now, description: reason, metadata: { recommendationScore: recommendation.recommendationScore } });
  });
  return newAssignmentRef.id;
}

export async function releaseTeam(incidentId: string, finalStatus: IncidentStatus = "Resolved"): Promise<void> {
  const uid = adminUid();
  await runTransaction(db, async (transaction) => {
    const incidentRef = doc(incidents, incidentId);
    const incidentSnapshot = await transaction.get(incidentRef);
    if (!incidentSnapshot.exists()) throw new Error("Incident no longer exists.");
    const incident = { id: incidentSnapshot.id, ...incidentSnapshot.data() } as Incident;
    if (!incident.assignedTeamId) { transaction.update(incidentRef, { status: finalStatus, updatedAt: serverTimestamp() }); return; }
    const teamRef = doc(teams, incident.assignedTeamId);
    const teamSnapshot = await transaction.get(teamRef);
    const activeAssignmentRef = incident.activeAssignmentId ? doc(assignments, incident.activeAssignmentId) : null;
    const activeAssignmentSnapshot = activeAssignmentRef ? await transaction.get(activeAssignmentRef) : null;
    const now = serverTimestamp();
    if (teamSnapshot.exists()) transaction.update(teamRef, { availabilityStatus: "Available", assignedIncidentId: null, updatedAt: now });
    if (activeAssignmentRef && activeAssignmentSnapshot?.exists()) transaction.update(activeAssignmentRef, { assignmentStatus: "Completed", releasedAt: now });
    transaction.update(incidentRef, { status: finalStatus, assignmentStatus: "Completed", activeAssignmentId: null, updatedAt: now });
    transaction.set(doc(assignmentEvents), { incidentId, teamId: incident.assignedTeamId, eventType: "IncidentResolved", actorUid: uid, timestamp: now, description: `Incident marked ${finalStatus}; assigned team released.` });
  });
}

export function subscribeToAssignments(onData: (items: Assignment[]) => void, onError: (message: string) => void): Unsubscribe {
  return onSnapshot(query(assignments, orderBy("assignedAt", "desc")), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Assignment[]), (error) => onError(`assignments read failed: ${error.message}`));
}

export function subscribeToAssignmentHistory(onData: (items: AssignmentEvent[]) => void, onError: (message: string) => void): Unsubscribe {
  return onSnapshot(query(assignmentEvents, orderBy("timestamp", "desc")), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as AssignmentEvent[]), (error) => onError(`assignmentEvents read failed: ${error.message}`));
}
