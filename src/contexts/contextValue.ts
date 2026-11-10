import { createContext } from "react";
import type { User } from "firebase/auth";

export interface AuthContextValue { user: User | null; isAdmin: boolean; loading: boolean; logout: () => Promise<void>; }
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);