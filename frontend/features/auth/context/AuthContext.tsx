"use client";

import { createContext, type JSX, useCallback, useMemo, useSyncExternalStore } from "react";

type Listener = () => void;

const tokenListeners: Listener[] = [];

const subscribeToToken = (listener: Listener): (() => void) => {
  tokenListeners.push(listener);
  return () => {
    const index = tokenListeners.indexOf(listener);
    if (index > -1) tokenListeners.splice(index, 1);
  };
};

const getTokenSnapshot = (): string | null => localStorage.getItem("access_token");

const getTokenServerSnapshot = (): null => null;

export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  isAuthenticated: false,
  setToken: () => undefined,
});

const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const token = useSyncExternalStore(subscribeToToken, getTokenSnapshot, getTokenServerSnapshot);

  const setToken = useCallback((newToken: string | null): void => {
    if (newToken === null) {
      localStorage.removeItem("access_token");
    } else {
      localStorage.setItem("access_token", newToken);
    }
    tokenListeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: token !== null, setToken }),
    [token, setToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
