"use client";

import { createContext, type JSX, useMemo, useState } from "react";

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
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  );
  const value = useMemo(() => ({ token, isAuthenticated: token !== null, setToken }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
