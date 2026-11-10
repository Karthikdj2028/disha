import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { isAuthorizedAdmin, signOutAdmin } from "../services/authService";
import { AuthContext } from "./contextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [isAdmin, setIsAdmin] = useState(false); const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return; setLoading(true); setUser(currentUser); setIsAdmin(false);
      if (!currentUser) { setLoading(false); return; }
      try { const authorized = await isAuthorizedAdmin(currentUser); if (!active) return; setIsAdmin(authorized); if (!authorized) await signOutAdmin(); }
      catch (error) { console.error("Admin verification failed", error); if (active) setIsAdmin(false); }
      finally { if (active) setLoading(false); }
    });
    return () => { active = false; unsubscribe(); };
  }, []);
  return <AuthContext.Provider value={{ user, isAdmin, loading, logout: signOutAdmin }}>{children}</AuthContext.Provider>;
}

