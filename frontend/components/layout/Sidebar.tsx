"use client";

import { useState } from "react";
import type { JSX } from "react";

import LogoutButton from "@/features/auth/components/LogoutButton";
import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";
import useCategories from "@/features/categories/hooks/useCategories";

const Sidebar = (): JSX.Element => {
  const [isAdding, setIsAdding] = useState(false);
  const { data: categories = [] } = useCategories();

  return (
    <aside className="hidden md:flex w-52 flex-col pt-8 px-6">
      <p className="text-sm font-bold text-brown mb-3">All Categories</p>
      <ul className="flex flex-col gap-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-sm text-brown">{cat.name}</span>
          </li>
        ))}
      </ul>
      {isAdding ? (
        <CreateCategoryForm
          onSuccess={() => setIsAdding(false)}
          onCancel={() => setIsAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-3 text-xs text-brown/60 hover:text-brown text-left"
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
