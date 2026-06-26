import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { JSX, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import NoteModal from "@/features/notes/components/NoteModal";

const mockCategories = [{ id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" }];

const server = setupServer(
  http.get("http://localhost:8000/api/categories/", () => HttpResponse.json(mockCategories)),
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

describe("NoteModal", () => {
  it("renders title input, content textarea, save button, and close button", () => {
    render(<NoteModal onClose={() => {}} />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText("Note Title")).toBeInTheDocument();
    expect(screen.getByText("Pour your heart out...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save note/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls onClose when X button clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<NoteModal onClose={onClose} />, { wrapper: createWrapper() });
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows validation error when title is empty", async () => {
    const user = userEvent.setup();
    render(<NoteModal onClose={() => {}} />, { wrapper: createWrapper() });
    await user.click(screen.getByRole("button", { name: /save note/i }));
    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("shows validation error when no category selected", async () => {
    const user = userEvent.setup();
    render(<NoteModal onClose={() => {}} />, { wrapper: createWrapper() });
    await user.type(screen.getByPlaceholderText("Note Title"), "My Note");
    await user.click(screen.getByRole("button", { name: /save note/i }));
    await waitFor(() => {
      expect(screen.getByText("Category is required")).toBeInTheDocument();
    });
  });

  it("calls onClose on successful submission", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/api/notes/", () =>
        HttpResponse.json(
          {
            id: "note-1",
            title: "My Note",
            content: "",
            category: mockCategories[0],
            created_at: "2026-06-26T00:00:00Z",
            updated_at: "2026-06-26T00:00:00Z",
          },
          { status: 201 },
        ),
      ),
    );
    render(<NoteModal onClose={onClose} />, { wrapper: createWrapper() });
    await user.click(screen.getByRole("button", { name: /^category/i }));
    await waitFor(() => expect(screen.getByText("Work")).toBeInTheDocument());
    await user.click(screen.getByText("Work"));
    await user.type(screen.getByPlaceholderText("Note Title"), "My Note");
    await user.click(screen.getByRole("button", { name: /save note/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it("shows API field error on title", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/api/notes/", () =>
        HttpResponse.json({ title: ["This field may not be blank."] }, { status: 400 }),
      ),
    );
    render(<NoteModal onClose={() => {}} />, { wrapper: createWrapper() });
    await user.click(screen.getByRole("button", { name: /^category/i }));
    await waitFor(() => expect(screen.getByText("Work")).toBeInTheDocument());
    await user.click(screen.getByText("Work"));
    await user.type(screen.getByPlaceholderText("Note Title"), "x");
    await user.click(screen.getByRole("button", { name: /save note/i }));
    await waitFor(() => {
      expect(screen.getByText("This field may not be blank.")).toBeInTheDocument();
    });
  });

  it("disables save button while pending", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/api/notes/", async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );
    render(<NoteModal onClose={() => {}} />, { wrapper: createWrapper() });
    await user.click(screen.getByRole("button", { name: /^category/i }));
    await waitFor(() => expect(screen.getByText("Work")).toBeInTheDocument());
    await user.click(screen.getByText("Work"));
    await user.type(screen.getByPlaceholderText("Note Title"), "My Note");
    await user.click(screen.getByRole("button", { name: /save note/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled());
  });
});
