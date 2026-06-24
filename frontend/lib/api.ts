import axios, { type AxiosRequestConfig } from "axios";

interface RetryableRequest extends AxiosRequestConfig {
  retried?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) return config;
  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: RetryableRequest = error.config;

    if (error.response?.status === 401 && !original.retried) {
      original.retried = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/auth/token/refresh/`,
          { refresh },
        );
        localStorage.setItem("access_token", data.access);
        const retryConfig = { ...original, headers: { Authorization: `Bearer ${data.access}` } };
        return await api(retryConfig);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
