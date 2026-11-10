import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export async function isAuthorizedAdmin(user: User): Promise<boolean> {
  const snapshot = await getDoc(doc(db, "admins", user.uid)); const data = snapshot.data();
  return snapshot.exists() && data?.role === "admin" && data?.active === true;
}

export async function signInAdmin(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  try { if (!(await isAuthorizedAdmin(credential.user))) { await signOut(auth); throw new Error("This account is not authorized as a DIASA administrator."); } return credential.user; }
  catch (error) { if (auth.currentUser?.uid === credential.user.uid) await signOut(auth); throw error; }
}

export function signOutAdmin(): Promise<void> { return signOut(auth); }

export function requestPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email.trim());
}
