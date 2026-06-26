"use client";

import Image from "next/image";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import NoteCard from "@/components/ui/NoteCard";
import useNotes from "@/features/notes/hooks/useNotes";

interface NotesAreaProps {
  activeCategory?: string | null;
}

const NotesArea = ({ activeCategory }: NotesAreaProps): JSX.Element => {
  const { data: notes = [] } = useNotes(activeCategory);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-end p-6">
        <Button variant="outline" className="rounded-full gap-1.5">
          + New Note
        </Button>
      </div>
      {notes.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                categoryColor={note.category?.color ?? "#94a3b8"}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-16">
          <Image src="/boba-empty.png" alt="No notes yet" width={297} height={297} />
          <p className="text-brown font-sans font-normal text-2xl text-center">
            I&apos;m just here waiting for your charming notes...
          </p>
        </div>
      )}
    </div>
  );
};

export default NotesArea;
