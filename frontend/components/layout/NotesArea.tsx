"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import type { JSX } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import NoteCard from "@/components/ui/NoteCard";
import NoteModal from "@/features/notes/components/NoteModal";
import useNotes from "@/features/notes/hooks/useNotes";
import type { Note } from "@/features/notes/types";

interface NotesAreaProps {
  activeCategory?: string | null;
}

const NotesArea = ({ activeCategory }: NotesAreaProps): JSX.Element => {
  const { data: notes = [], isLoading, isError } = useNotes(activeCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const renderContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs text-brown/40">Loading…</p>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs text-red-400">Failed to load notes.</p>
        </div>
      );
    }
    if (notes.length > 0) {
      return (
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                categoryColor={note.category.color}
                onClick={() => setEditingNote(note)}
              />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16">
        <Image src="/boba-empty.png" alt="No notes yet" width={297} height={297} />
        <p className="text-brown font-sans font-normal text-2xl text-center">
          I&apos;m just here waiting for your charming notes...
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-end p-6">
        <Button variant="outline" className="gap-1.5" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          New Note
        </Button>
      </div>
      {renderContent()}
      {isModalOpen && (
        <NoteModal
          onClose={() => setIsModalOpen(false)}
          defaultCategoryId={activeCategory ?? undefined}
        />
      )}
      {editingNote && <NoteModal note={editingNote} onClose={() => setEditingNote(null)} />}
    </div>
  );
};

export default NotesArea;
