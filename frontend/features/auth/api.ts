import api from "@/lib/api";

import type { AuthTokens, LoginPayload, RegisterPayload } from "./types";

export const login = async (payload: LoginPayload): Promise<AuthTokens> => {
  const res = await api.post<AuthTokens>("/api/auth/login/", payload);
  return res.data;
};

export const register = async (payload: RegisterPayload): Promise<AuthTokens> => {
  const res = await api.post<AuthTokens>("/api/auth/register/", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout/", { refresh: localStorage.getItem("refresh_token") });
};
