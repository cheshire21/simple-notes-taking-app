import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { AxiosError } from "axios";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { useRegister } from "@/features/auth/hooks/useRegister";

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

describe("useRegister", () => {
  it("resolves with AuthTokens on success", async () => {
    server.use(
      http.post("http://localhost:8000/api/auth/register/", () =>
        HttpResponse.json({ access: "access-token", refresh: "refresh-token" }, { status: 201 }),
      ),
    );

    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

    result.current.mutate({ email: "test@example.com", password: "password123" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      access: "access-token",
      refresh: "refresh-token",
    });
  });

  it("rejects with axios error containing field errors on 422", async () => {
    const fieldErrors = {
      email: ["A user with this email already exists."],
      password: ["This password is too common."],
    };

    server.use(
      http.post("http://localhost:8000/api/auth/register/", () =>
        HttpResponse.json(fieldErrors, { status: 422 }),
      ),
    );

    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });

    result.current.mutate({ email: "taken@example.com", password: "password123" });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const error = result.current.error as AxiosError<typeof fieldErrors>;
    expect(error.response?.data).toEqual(fieldErrors);
    expect(error.response?.data.email).toEqual(["A user with this email already exists."]);
    expect(error.response?.data.password).toEqual(["This password is too common."]);
  });
});
