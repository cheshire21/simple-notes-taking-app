"use client";

import React from "react";

import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  categoryColor: string;
  onClick: () => void;
  className?: string;
}

const NoteCard = ({
  note,
  categoryColor,
  onClick,
  className = "",
}: NoteCardProps): React.JSX.Element => {
  const noteDate = new Date(note.created_at);
  const formattedDate = noteDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(noteDate.getFullYear() !== new Date().getFullYear() && { year: "numeric" }),
  });

  return (
    <div
      className={`rounded-2xl p-5 cursor-pointer border border-brown/20 ${className}`}
      style={{ backgroundColor: categoryColor }}
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
        <span className="font-bold">{formattedDate}</span>
        <span>{note.category.name}</span>
      </div>
      <div className="note-title mt-1 mb-2">{note.title}</div>
      <div className="note-body line-clamp-3">{note.content}</div>
    </div>
  );
};

export default NoteCard;
