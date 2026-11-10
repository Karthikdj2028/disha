import { addDoc, collection, deleteDoc, doc, getDoc, GeoPoint, onSnapshot, orderBy, query, serverTimestamp, updateDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "../lib/firebase";
import { classifySeverity } from "../lib/severityEngine";
import type { Incident, IncidentStatus, NewIncidentInput } from "../types/incident";

const incidentsCollection = collection(db, "incidents");
export async function createIncident(input: NewIncidentInput): Promise<string> {
  const classification = classifySeverity(input);
  const coordinates = input.coordinates ?? (input.latitude !== undefined && input.longitude !== undefined ? new GeoPoint(input.latitude, input.longitude) : undefined);
  const record = { title: input.title.trim(), description: input.description.trim(), category: input.category, location: input.location.trim(), peopleAffected: input.peopleAffected, ...(input.contactInfo?.trim() ? { contactInfo: input.contactInfo.trim() } : {}), ...(coordinates ? { coordinates } : {}), ...classification, status: "Reported" as const, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  return (await addDoc(incidentsCollection, record)).id;
}
export function subscribeToIncidents(onData: (incidents: Incident[]) => void, onError: (message: string) => void): Unsubscribe {
  return onSnapshot(query(incidentsCollection, orderBy("createdAt", "desc")), (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Incident[]), (error) => onError(error.message));
}
export async function getIncidentById(id: string): Promise<Incident | null> { const snapshot = await getDoc(doc(db, "incidents", id)); return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Incident) : null; }
export function updateIncidentStatus(id: string, status: IncidentStatus): Promise<void> { return updateDoc(doc(db, "incidents", id), { status, updatedAt: serverTimestamp() }); }
export function deleteIncident(id: string): Promise<void> { return deleteDoc(doc(db, "incidents", id)); }
