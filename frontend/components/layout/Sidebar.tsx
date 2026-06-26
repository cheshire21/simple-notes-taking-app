"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { JSX } from "react";

import LogoutButton from "@/features/auth/components/LogoutButton";
import CategoryItem from "@/features/categories/components/CategoryItem";
import CategoryItemError from "@/features/categories/components/CategoryItem/CategoryItemError";
import CategoryItemSkeleton from "@/features/categories/components/CategoryItem/CategoryItemSkeleton";
import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";
import useCategories from "@/features/categories/hooks/useCategories";

interface SidebarProps {
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
  noteCounts: Record<string, number>;
}

const Sidebar = ({ activeCategory, setActiveCategory, noteCounts }: SidebarProps): JSX.Element => {
  const [isAdding, setIsAdding] = useState(false);
  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  return (
    <aside className="hidden md:flex w-64 flex-col pt-8 px-6">
      <button
        type="button"
        onClick={() => setActiveCategory(null)}
        className={`text-xs text-black text-left mb-2 ${activeCategory === null ? "font-bold" : "font-normal"}`}
      >
        All Categories
      </button>
      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <CategoryItemSkeleton key={idx} />
          ))}
        </div>
      )}
      {isError && (
        <CategoryItemError
          onRetry={() => {
            refetch().catch(() => undefined);
          }}
        />
      )}
      {!isLoading && !isError && (
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              count={noteCounts[cat.id] ?? 0}
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
          className="mt-3 text-xs font-bold text-black text-left flex items-center gap-1"
        >
          <Plus size={16} />
          Add Category
        </button>
      )}
      <div className="mt-auto mb-6">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Sidebar;
