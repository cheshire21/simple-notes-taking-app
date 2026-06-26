import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import NoteCard from "@/components/ui/NoteCard";
import type { Note } from "@/features/notes/types";

const makeNote = (updatedAt: string): Note => ({
  id: "note-1",
  title: "Test Note",
  content: "Test content here",
  category: { id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" },
  created_at: "2026-01-01T00:00:00Z",
  updated_at: updatedAt,
});

const todayIso = new Date().toISOString();
const yesterdayIso = (() => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString();
})();
const olderIso = "2026-06-10T10:00:00Z";

describe("NoteCard", () => {
  it("renders the note title", () => {
    render(<NoteCard note={makeNote(todayIso)} categoryColor="#e8855a" onClick={() => {}} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  it("renders the note content", () => {
    render(<NoteCard note={makeNote(todayIso)} categoryColor="#e8855a" onClick={() => {}} />);
    expect(screen.getByText("Test content here")).toBeInTheDocument();
  });

  it("renders the category name", () => {
    render(<NoteCard note={makeNote(todayIso)} categoryColor="#e8855a" onClick={() => {}} />);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("shows 'today' for today's date", () => {
    render(<NoteCard note={makeNote(todayIso)} categoryColor="#e8855a" onClick={() => {}} />);
    expect(screen.getByText("today")).toBeInTheDocument();
  });

  it("shows 'yesterday' for yesterday's date", () => {
    render(<NoteCard note={makeNote(yesterdayIso)} categoryColor="#e8855a" onClick={() => {}} />);
    expect(screen.getByText("yesterday")).toBeInTheDocument();
  });

  it("shows formatted date for older dates", () => {
    render(<NoteCard note={makeNote(olderIso)} categoryColor="#e8855a" onClick={() => {}} />);
    expect(screen.getByText("June 10")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<NoteCard note={makeNote(todayIso)} categoryColor="#e8855a" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("calls onClick on Enter key", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<NoteCard note={makeNote(todayIso)} categoryColor="#e8855a" onClick={onClick} />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("calls onClick on Space key", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<NoteCard note={makeNote(todayIso)} categoryColor="#e8855a" onClick={onClick} />);
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledOnce();
  });
});
