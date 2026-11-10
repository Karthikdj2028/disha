import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, type Unsubscribe } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { NewResponseTeam, ResponseTeam } from "../types/responseTeam";

const teams = collection(db, "responseTeams");

export async function createResponseTeam(input: NewResponseTeam): Promise<string> {
  const existing = await getDocs(query(teams, where("teamCode", "==", input.teamCode.trim())));
  if (!existing.empty) throw new Error("That team code is already in use.");
  const result = await addDoc(teams, { teamCode: input.teamCode.trim(), teamName: input.teamName.trim(), responseCategories: input.responseCategories, availabilityStatus: input.availabilityStatus, assignedIncidentId: input.assignedIncidentId ?? null, ...(input.currentLocation ? { currentLocation: input.currentLocation, lastLocationUpdate: serverTimestamp() } : {}), ...(input.memberCount !== undefined ? { memberCount: input.memberCount } : {}), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return result.id;
}

export async function getResponseTeams(): Promise<ResponseTeam[]> {
  const snapshot = await getDocs(query(teams, orderBy("teamName")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as ResponseTeam[];
}

export function subscribeToResponseTeams(onData: (teams: ResponseTeam[]) => void, onError: (message: string) => void): Unsubscribe {
  return onSnapshot(query(teams, orderBy("teamName")), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as ResponseTeam[]), (error) => onError(`responseTeams read failed: ${error.message}`));
}

export function updateResponseTeam(id: string, changes: Partial<NewResponseTeam>): Promise<void> {
  if (changes.assignedIncidentId !== undefined) return Promise.reject(new Error("Team assignments must use the transactional assignment workflow."));
  if (changes.availabilityStatus === "Busy") return Promise.reject(new Error("Teams become Busy only through a confirmed assignment."));
  return updateDoc(doc(db, "responseTeams", id), { ...changes, ...(changes.currentLocation ? { lastLocationUpdate: serverTimestamp() } : {}), updatedAt: serverTimestamp() });
}

export function deleteResponseTeam(id: string): Promise<void> { return deleteDoc(doc(db, "responseTeams", id)); }
