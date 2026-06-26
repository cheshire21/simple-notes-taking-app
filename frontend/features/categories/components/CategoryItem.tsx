"use client";

import { Trash2 } from "lucide-react";
import { useState, type JSX } from "react";

import { Button } from "@/components/ui/button";
import useDeleteCategory from "@/features/categories/hooks/useDeleteCategory";
import type { Category } from "@/features/categories/types";

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

const CategoryItem = ({ category, isActive, onClick, count }: CategoryItemProps): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useDeleteCategory();

  return (
    <li className="group/item flex flex-col">
      <div className="flex items-center gap-2 w-full">
        <button
          type="button"
          onClick={onClick}
          className={`flex items-center gap-2 flex-1 text-left ${isActive ? "font-bold" : "font-normal"}`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-xs text-black">{category.name}</span>
          {count !== undefined && <span className="ml-auto text-xs text-black">{count}</span>}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Delete category"
          disabled={isPending}
          onClick={() => mutate(category.id, { onError: () => setError("Failed to delete") })}
          className="opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0"
        >
          <Trash2 size={12} />
        </Button>
      </div>
      {error && <p className="text-xs text-red-500 pl-5">{error}</p>}
    </li>
  );
};

export default CategoryItem;
