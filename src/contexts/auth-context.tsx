import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { auth, db } from "@/lib/firebase";

export type UserRole = "user" | "admin";
type AuthContextValue = {
  user: User | null;
  role: UserRole;
  loading: boolean;
  logout(): Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(Boolean(auth));
  useEffect(() => {
    if (!auth) return;
    let stopProfile: (() => void) | undefined;
    return onAuthStateChanged(auth, (nextUser) => {
      stopProfile?.();
      setUser(nextUser);
      setRole("user");
      if (!nextUser || !db) {
        setLoading(false);
        return;
      }
      stopProfile = onSnapshot(
        doc(db, "users", nextUser.uid),
        (snapshot) => {
          setRole(snapshot.data()?.role === "admin" ? "admin" : "user");
          setLoading(false);
        },
        () => setLoading(false),
      );
    });
  }, []);
  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      logout: async () => {
        if (auth) await signOut(auth);
      },
    }),
    [loading, role, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth mora biti unutar AuthProvidera.");
  return value;
}
