import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import LoginForm from "@/features/auth/components/LoginForm";

const { mockPush } = vi.hoisted(() => ({ mockPush: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }): JSX.Element => <img src={src} alt={alt} />,
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

const renderForm = (): ReturnType<typeof render> =>
  render(<LoginForm />, { wrapper: createWrapper() });

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  mockPush.mockClear();
});
afterAll(() => server.close());

describe("LoginForm", () => {
  it("renders email input, password input, and submit button", () => {
    renderForm();

    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows zod validation errors for invalid field values", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "notanemail");
    await user.type(screen.getByPlaceholderText("Password"), " ");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    });
  });

  it("shows API field errors returned from the server", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/login/", () =>
        HttpResponse.json(
          {
            email: ["No active account found with the given credentials."],
            password: ["This field may not be blank."],
          },
          { status: 401 },
        ),
      ),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "wrong@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText("No active account found with the given credentials."),
      ).toBeInTheDocument();
      expect(screen.getByText("This field may not be blank.")).toBeInTheDocument();
    });
  });

  it("shows root error for general API failures", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/login/", () =>
        HttpResponse.json({ detail: "An unexpected error occurred." }, { status: 500 }),
      ),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
    });
  });

  it("disables the submit button while the mutation is pending", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/login/", async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled());
  });

  it("redirects to /dashboard on success", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/login/", () =>
        HttpResponse.json({ access: "access-token", refresh: "refresh-token" }, { status: 200 }),
      ),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });
});
