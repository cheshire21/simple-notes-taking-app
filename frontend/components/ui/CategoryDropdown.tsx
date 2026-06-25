"use client";

import React, { useEffect, useRef, useState } from "react";

import type { Category } from "@/types";

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory: Category | null;
  onChange: (category: Category) => void;
  className?: string;
}

const CategoryDropdown = ({
  categories,
  selectedCategory,
  onChange,
  className = "",
}: CategoryDropdownProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent): void => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const handleTriggerClick = (): void => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (category: Category): void => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        className="border border-brown/30 rounded-full px-3 py-1.5 flex items-center gap-2 font-linter text-sm text-brown cursor-pointer"
        onClick={handleTriggerClick}
      >
        {selectedCategory && (
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: selectedCategory.color }}
          />
        )}
        <span>{selectedCategory ? selectedCategory.name : "Category"}</span>
        <span>▾</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-10 bg-cream rounded-xl shadow-sm border border-brown/10 min-w-full py-1">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="px-3 py-2 hover:bg-brown/5 cursor-pointer flex items-center gap-2 font-linter text-sm text-brown w-full text-left"
              onClick={() => handleOptionClick(category)}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
