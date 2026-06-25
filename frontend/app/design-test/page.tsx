"use client";

import { useState } from "react";
import type { JSX } from "react";

import Button from "@/components/ui/Button";
import CategoryDropdown from "@/components/ui/CategoryDropdown";
import Modal from "@/components/ui/Modal";
import NoteCard from "@/components/ui/NoteCard";
import type { Category, Note } from "@/types";

const categories: Category[] = [
  { id: 1, name: "Random Thoughts", color: "#E8855A" },
  { id: 2, name: "Personal", color: "#7FB5AA" },
  { id: 3, name: "School", color: "#F5D98B" },
  { id: 4, name: "Drama", color: "#B5BF8F" },
];

const sampleNote: Note = {
  id: 1,
  title: "Note Title",
  content:
    "Note content preview that gets truncated after approximately three lines of text so you can see how the line-clamp works in practice.",
  category: categories[1],
  created_at: "2026-06-24T10:00:00Z",
  updated_at: "2026-06-24T10:00:00Z",
};

const swatches = [
  { token: "cream", bg: "bg-cream", label: "cream" },
  { token: "brown", bg: "bg-brown", label: "brown" },
  { token: "salmon", bg: "bg-salmon", label: "salmon" },
  { token: "yellow-soft", bg: "bg-yellow-soft", label: "yellow-soft" },
  { token: "teal-soft", bg: "bg-teal-soft", label: "teal-soft" },
  { token: "olive-soft", bg: "bg-olive-soft", label: "olive-soft" },
];

const DesignTestPage = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="bg-cream min-h-screen p-10 space-y-12">
      {/* Color Swatches */}
      <section>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">
          Color Swatches
        </p>
        <div className="flex flex-wrap gap-4">
          {swatches.map(({ token, bg, label }) => (
            <div key={token} className="flex flex-col items-center gap-1">
              <div className={`${bg} h-16 w-16 rounded border border-brown/20`} />
              <span className="font-linter text-xs text-brown">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">
          Typography — Inria Serif
        </p>
        <h1>Heading 1 — Inria Serif 40px 700</h1>
        <h2>Heading 2 — Inria Serif 28px 700</h2>
        <h3>Heading 3 — Inria Serif 20px 600</h3>
      </section>

      <section>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">
          Typography — Inter (--font-linter)
        </p>
        <p>Paragraph text — Inter 14px, color brown</p>
        <a href="/design-test">Link text — Inter 14px underline, color brown</a>
      </section>

      {/* Button */}
      <section>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">Button</p>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>+ New Note</Button>
          <Button variant="solid">+ New Note (solid)</Button>
          <Button fullWidth>Full Width Button</Button>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        </div>
      </section>

      {/* NoteCard */}
      <section>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">NoteCard</p>
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          {categories.map((cat) => (
            <NoteCard
              key={cat.id}
              note={{ ...sampleNote, category: cat }}
              categoryColor={cat.color}
              onClick={() => setModalOpen(true)}
            />
          ))}
        </div>
      </section>

      {/* CategoryDropdown */}
      <section>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brown">
          CategoryDropdown
        </p>
        <CategoryDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />
        <p className="mt-3 font-linter text-xs text-brown/60">Selected: {selectedCategory.name}</p>
      </section>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cardColor={selectedCategory.color}
      >
        <h2>Modal Content</h2>
        <p className="mt-4">
          This modal uses the selected category color as its background. Click the overlay or × to
          close.
        </p>
        <div className="mt-6">
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </main>
  );
};

export default DesignTestPage;
