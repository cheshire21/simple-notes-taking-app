import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { AxiosError } from "axios";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { useLogin } from "@/features/auth/hooks/useLogin";

const server = setupServer();

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

describe("useLogin", () => {
  it("writes tokens to localStorage and resolves with AuthTokens on success", async () => {
    server.use(
      http.post("http://localhost:8000/api/auth/login/", () =>
        HttpResponse.json({ access: "access-token", refresh: "refresh-token" }, { status: 200 }),
      ),
    );

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: "test@example.com", password: "password123" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      access: "access-token",
      refresh: "refresh-token",
    });
    expect(localStorage.getItem("access_token")).toBe("access-token");
    expect(localStorage.getItem("refresh_token")).toBe("refresh-token");
  });

  it("rejects with axios error on 401 failure", async () => {
    const errorBody = { detail: "No active account found with the given credentials" };

    server.use(
      http.post("http://localhost:8000/api/auth/login/", () =>
        HttpResponse.json(errorBody, { status: 401 }),
      ),
    );

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    result.current.mutate({ email: "wrong@example.com", password: "wrongpassword" });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const error = result.current.error as AxiosError<typeof errorBody>;
    expect(error.response?.data).toEqual(errorBody);
  });
});
