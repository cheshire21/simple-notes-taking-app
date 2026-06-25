"use client";

import { createContext, type JSX, useMemo, useSyncExternalStore } from "react";

export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  isAuthenticated: false,
});

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSnapshot = () => localStorage.getItem("access_token");

const getServerSnapshot = () => null;

const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => ({ token, isAuthenticated: token !== null }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
