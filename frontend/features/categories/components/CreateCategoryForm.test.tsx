import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";

const server = setupServer(
  http.get("http://localhost:8000/api/categories/", () => HttpResponse.json([])),
);

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CreateCategoryForm", () => {
  it("renders name input and action buttons", () => {
    render(<CreateCategoryForm onSuccess={() => {}} onCancel={() => {}} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByPlaceholderText("Category name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add category/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows Zod validation error on empty submit", async () => {
    const user = userEvent.setup();
    render(<CreateCategoryForm onSuccess={() => {}} onCancel={() => {}} />, {
      wrapper: createWrapper(),
    });
    await user.click(screen.getByRole("button", { name: /add category/i }));
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("calls onSuccess after successful submission", async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/api/categories/", () =>
        HttpResponse.json(
          { id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" },
          { status: 201 },
        ),
      ),
    );
    render(<CreateCategoryForm onSuccess={onSuccess} onCancel={() => {}} />, {
      wrapper: createWrapper(),
    });
    await user.type(screen.getByPlaceholderText("Category name"), "Work");
    await user.click(screen.getByRole("button", { name: /add category/i }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });

  it("shows API field error on duplicate name", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/api/categories/", () =>
        HttpResponse.json({ name: ["A category with this name already exists."] }, { status: 400 }),
      ),
    );
    render(<CreateCategoryForm onSuccess={() => {}} onCancel={() => {}} />, {
      wrapper: createWrapper(),
    });
    await user.type(screen.getByPlaceholderText("Category name"), "Work");
    await user.click(screen.getByRole("button", { name: /add category/i }));
    await waitFor(() => {
      expect(screen.getByText("A category with this name already exists.")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel button clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<CreateCategoryForm onSuccess={() => {}} onCancel={onCancel} />, {
      wrapper: createWrapper(),
    });
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("disables submit button while pending", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/api/categories/", async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );
    render(<CreateCategoryForm onSuccess={() => {}} onCancel={() => {}} />, {
      wrapper: createWrapper(),
    });
    await user.type(screen.getByPlaceholderText("Category name"), "Work");
    await user.click(screen.getByRole("button", { name: /add category/i }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /add category/i })).toBeDisabled(),
    );
  });
});
