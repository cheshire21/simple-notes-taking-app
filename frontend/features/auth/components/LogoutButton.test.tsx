import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import LogoutButton from "@/features/auth/components/LogoutButton";

const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

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

const renderButton = (): ReturnType<typeof render> =>
  render(<LogoutButton />, { wrapper: createWrapper() });

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  localStorage.setItem("access_token", "test-access-token");
  localStorage.setItem("refresh_token", "test-refresh-token");
});
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  mockPush.mockClear();
});
afterAll(() => server.close());

describe("LogoutButton", () => {
  it("renders the Logout button", () => {
    renderButton();

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls POST /api/auth/logout/ with the refresh token on click", async () => {
    const user = userEvent.setup();
    let capturedBody: unknown;

    server.use(
      http.post("http://localhost:8000/api/auth/logout/", async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.text("", { status: 204 });
      }),
    );

    renderButton();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => expect(capturedBody).toEqual({ refresh: "test-refresh-token" }));
  });

  it("removes both tokens from localStorage and calls router.push('/login') on success", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/logout/", () =>
        HttpResponse.text("", { status: 204 }),
      ),
    );

    renderButton();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });

  it("shows 'Logging out…' and disables the button while pending", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/logout/", async () => {
        await delay("infinite");
        return HttpResponse.text("", { status: 204 });
      }),
    );

    renderButton();

    await user.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /logging out/i })).toBeDisabled(),
    );
  });
});
