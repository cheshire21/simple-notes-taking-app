"use client";

import type { JSX } from "react";

import NotesArea from "@/components/layout/NotesArea";
import Sidebar from "@/components/layout/Sidebar";
import useActiveCategory from "@/features/categories/hooks/useActiveCategory";

const DashboardShell = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useActiveCategory();
  return (
    <div className="flex flex-1 bg-cream">
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <NotesArea activeCategory={activeCategory} />
    </div>
  );
};
export default DashboardShell;
