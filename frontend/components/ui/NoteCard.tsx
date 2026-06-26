"use client";

import React from "react";

import type { Note } from "@/features/notes/types";
import { hexToRgba } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  categoryColor: string;
  onClick: () => void;
  className?: string;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
};

const NoteCard = ({
  note,
  categoryColor,
  onClick,
  className = "",
}: NoteCardProps): React.JSX.Element => (
  <div
    className={`p-5 cursor-pointer text-black h-[246px] overflow-hidden flex flex-col ${className}`}
    style={{
      borderRadius: "11px",
      backgroundColor: hexToRgba(categoryColor, 0.5),
      border: `3px solid ${categoryColor}`,
    }}
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
  >
    <div className="note-meta flex items-center gap-2 mb-3">
      <span className="font-bold">{formatDate(note.updated_at)}</span>
      <span>{note.category.name}</span>
    </div>
    <div className="note-title mt-1 mb-2 truncate">{note.title}</div>
    <div className="note-body flex-1 overflow-hidden line-clamp-5">{note.content}</div>
  </div>
);

export default NoteCard;
