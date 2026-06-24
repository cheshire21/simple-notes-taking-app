import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => localStorage.setItem("refresh_token", token),
  clearAuth: () => {
    localStorage.removeItem("refresh_token");
    set({ accessToken: null });
  },
}));

export default useAuthStore;
