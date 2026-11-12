import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useCallback,
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
  isLoading: boolean;
  logout(): Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return;
    }

    let stopProfile: (() => void) | undefined;

    return onAuthStateChanged(auth, (nextUser) => {
      stopProfile?.();
      setUser(nextUser);
      setRole("user");

      if (!nextUser || !db) {
        setIsLoading(false);
        return;
      }

      stopProfile = onSnapshot(
        doc(db, "users", nextUser.uid),
        (snapshot) => {
          setRole(snapshot.data()?.role === "admin" ? "admin" : "user");
          setIsLoading(false);
        },
        () => setIsLoading(false),
      );
    });
  }, []);

  const logout = useCallback(async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      isLoading,
      logout,
    }),
    [isLoading, logout, role, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth mora biti unutar AuthProvidera.");
  }

  return value;
}
