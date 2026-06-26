"use client";

import type { JSX } from "react";

import NotesArea from "@/components/layout/NotesArea";
import Sidebar from "@/components/layout/Sidebar";
import useActiveCategory from "@/features/categories/hooks/useActiveCategory";
import useNotes from "@/features/notes/hooks/useNotes";

const DashboardShell = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useActiveCategory();
  const { data: allNotes = [] } = useNotes();
  const noteCounts = allNotes.reduce<Record<string, number>>((acc, note) => {
    acc[note.category.id] = (acc[note.category.id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-1 bg-cream">
      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        noteCounts={noteCounts}
      />
      <NotesArea activeCategory={activeCategory} />
    </div>
  );
};

export default DashboardShell;
