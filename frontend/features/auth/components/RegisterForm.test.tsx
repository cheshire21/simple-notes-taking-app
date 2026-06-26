import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import RegisterForm from "@/features/auth/components/RegisterForm";

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
  render(<RegisterForm />, { wrapper: createWrapper() });

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  mockPush.mockClear();
});
afterAll(() => server.close());

describe("RegisterForm", () => {
  it("renders email input, password input, and submit button", () => {
    renderForm();

    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows zod validation errors for invalid field values", async () => {
    const user = userEvent.setup();
    renderForm();

    // Zod v4 + react-hook-form v7: untouched fields are `undefined`, which
    // triggers the generic type error instead of the custom schema messages.
    // Type invalid values to reach the .email() and .min() validators.
    await user.type(screen.getByPlaceholderText("Email address"), "notanemail");
    await user.type(screen.getByPlaceholderText("Password"), "short");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
      expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    });
  });

  it("shows API field errors returned from the server", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/register/", () =>
        HttpResponse.json(
          {
            email: ["A user with this email already exists."],
            password: ["This password is too common."],
          },
          { status: 400 },
        ),
      ),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "taken@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("A user with this email already exists.")).toBeInTheDocument();
      expect(screen.getByText("This password is too common.")).toBeInTheDocument();
    });
  });

  it("shows root error for general API failures", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/register/", () =>
        HttpResponse.json({ detail: "An unexpected error occurred." }, { status: 500 }),
      ),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
    });
  });

  it("disables the submit button while the mutation is pending", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/register/", async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /signing up/i })).toBeDisabled());
  });

  it("redirects to /login on success", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:8000/api/auth/register/", () =>
        HttpResponse.json({ access: "access-token", refresh: "refresh-token" }, { status: 201 }),
      ),
    );

    renderForm();

    await user.type(screen.getByPlaceholderText("Email address"), "new@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));
  });
});
