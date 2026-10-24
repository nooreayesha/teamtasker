import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "teamtasker:user";

export const MAX_NAME_LENGTH = 40;

export interface User {
  name: string;
}

interface AuthContextValue {
  user: User | null;
  /** Returns `false` (and does nothing) when the name is blank. */
  signIn: (name: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * NOTE: this is a front-end-only demo "session". It remembers a display name in
 * localStorage and provides NO real authentication or security.
 */
function loadUser(): User | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "name" in parsed &&
      typeof parsed.name === "string" &&
      parsed.name.trim() !== ""
    ) {
      return { name: parsed.name.trim().slice(0, MAX_NAME_LENGTH) };
    }
  } catch {
    // Corrupted or unavailable storage: fall through to "signed out".
  }
  return null;
}

function saveUser(user: User | null): void {
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage may be blocked (private mode); the session just won't persist.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);

  const signIn = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed === "") return false;
    const next: User = { name: trimmed.slice(0, MAX_NAME_LENGTH) };
    setUser(next);
    saveUser(next);
    return true;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    saveUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
