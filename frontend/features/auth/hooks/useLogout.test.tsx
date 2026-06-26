import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { useLogout } from "@/features/auth/hooks/useLogout";

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
beforeEach(() => {
  localStorage.setItem("access_token", "access");
  localStorage.setItem("refresh_token", "refresh");
});
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

describe("useLogout", () => {
  it("removes both tokens from localStorage and resolves on success", async () => {
    server.use(
      http.post("http://localhost:8000/api/auth/logout/", () =>
        HttpResponse.text("", { status: 204 }),
      ),
    );

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });

  it("rejects with error on 401 failure", async () => {
    server.use(
      http.post("http://localhost:8000/api/auth/logout/", () =>
        HttpResponse.json({ detail: "Token is invalid or expired" }, { status: 401 }),
      ),
    );

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
