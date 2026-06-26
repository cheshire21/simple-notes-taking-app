"use client";

import { useState } from "react";
import type { JSX } from "react";

import LogoutButton from "@/features/auth/components/LogoutButton";
import CategoryItem from "@/features/categories/components/CategoryItem";
import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";
import useCategories from "@/features/categories/hooks/useCategories";

interface SidebarProps {
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
}

const Sidebar = ({ activeCategory, setActiveCategory }: SidebarProps): JSX.Element => {
  const [isAdding, setIsAdding] = useState(false);
  const { data: categories = [], isLoading, isError } = useCategories();

  return (
    <aside className="hidden md:flex w-52 flex-col pt-8 px-6">
      <p className="text-xs font-bold text-black mb-3">All Categories</p>
      <button
        type="button"
        onClick={() => setActiveCategory(null)}
        className={`text-xs text-black text-left mb-2 ${activeCategory === null ? "font-bold" : "font-normal"}`}
      >
        All Notes
      </button>
      {isLoading && <p className="text-xs text-brown/40">Loading…</p>}
      {isError && <p className="text-xs text-red-400">Failed to load categories.</p>}
      {!isLoading && !isError && (
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </ul>
      )}
      {isAdding ? (
        <CreateCategoryForm
          onSuccess={() => setIsAdding(false)}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-3 text-xs font-bold text-black text-left"
        >
          + Add Category
        </button>
      )}
      <div className="mt-auto mb-6">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
