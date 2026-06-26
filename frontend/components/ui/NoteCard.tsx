"use client";

import { Trash2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import useDeleteNote from "@/features/notes/hooks/useDeleteNote";
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
}: NoteCardProps): React.JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useDeleteNote();

  return (
    <div className={`relative group/card ${className}`}>
      <div
        className="p-5 cursor-pointer text-black h-[246px] overflow-hidden flex flex-col"
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
        <div
          className="note-body flex-1 overflow-hidden line-clamp-5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Delete note"
        disabled={isPending}
        onClick={(event) => {
          event.stopPropagation();
          mutate(note.id, { onError: () => setError("Failed to delete") });
        }}
        className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity text-brown hover:text-brown/70 hover:bg-transparent"
      >
        <Trash2 size={12} />
      </Button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default NoteCard;
