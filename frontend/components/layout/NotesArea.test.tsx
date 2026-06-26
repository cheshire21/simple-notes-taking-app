import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { JSX } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import NotesArea from "@/components/layout/NotesArea";
import type { Note } from "@/features/notes/types";

const { mockUseNotes } = vi.hoisted(() => ({
  mockUseNotes: vi.fn(),
}));

vi.mock("@/features/notes/hooks/useNotes", () => ({
  default: mockUseNotes,
}));

vi.mock("@/components/NoteCard", () => ({
  default: ({ note }: { note: Note }): JSX.Element => <div>{note.title}</div>,
}));

vi.mock("@/features/notes/components/NoteModal", () => ({
  default: (): null => null,
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string; src: string }): JSX.Element => <img alt={alt} />,
}));

const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "First Note",
    content: "Some content",
    category: { id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" },
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "note-2",
    title: "Second Note",
    content: "More content",
    category: { id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" },
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  },
];

afterEach(() => {
  vi.clearAllMocks();
});

describe("NotesArea", () => {
  it("renders skeleton cards while loading", () => {
    mockUseNotes.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    const { container } = render(<NotesArea />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders the error message on fetch failure", () => {
    mockUseNotes.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(<NotesArea />);
    expect(screen.getByText("Failed to load notes.")).toBeInTheDocument();
  });

  it("calls refetch when the retry button is clicked after an error", async () => {
    const refetch = vi.fn().mockResolvedValue({ data: [] });
    const user = userEvent.setup();
    mockUseNotes.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch,
    });

    render(<NotesArea />);
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it("renders note cards when notes are loaded", () => {
    mockUseNotes.mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<NotesArea />);
    expect(screen.getByText("First Note")).toBeInTheDocument();
    expect(screen.getByText("Second Note")).toBeInTheDocument();
  });

  it("renders the empty state when there are no notes", () => {
    mockUseNotes.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<NotesArea />);
    expect(screen.getByAltText("No notes yet")).toBeInTheDocument();
    expect(screen.getByText(/I'm just here waiting for your charming notes/i)).toBeInTheDocument();
  });

  it("renders a New Note button", () => {
    mockUseNotes.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<NotesArea />);
    expect(screen.getByRole("button", { name: /new note/i })).toBeInTheDocument();
  });
});
