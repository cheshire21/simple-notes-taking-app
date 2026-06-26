"use client";

import type { JSX } from "react";

import type { Category } from "@/features/categories/types";

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

const CategoryItem = ({ category, isActive, onClick, count }: CategoryItemProps): JSX.Element => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 w-full text-left ${isActive ? "font-bold" : "font-normal"}`}
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: category.color }}
      />
      <span className="text-xs text-black">{category.name}</span>
      {count !== undefined && <span className="ml-auto text-xs text-black">{count}</span>}
    </button>
  </li>
);

export default CategoryItem;
