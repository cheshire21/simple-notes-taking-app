# Plan: SIM-53 — Notes List FE

## Context

The notes list display needs to match the Figma design: masonry-style variable-height cards with category color backgrounds (50% opacity + full border), relative date labels ("today"/"yesterday"/"Month Day"), full content (no line-clamp), and per-category note counts in the sidebar. The backend (`GET /api/notes/`) and `useNotes` hook are already working. This is purely a display layer task.

---

## Spec folder

`agent-os/specs/2026-06-26-notes-list-fe/`

---

## Files to create / modify

| File | Action |
|------|--------|
| `frontend/lib/utils.ts` | UPDATE — add `hexToRgba` helper (extract from NoteModal) |
| `frontend/components/ui/NoteCard.tsx` | UPDATE — relative date, opacity bg + full border, no line-clamp, import from features/notes/types |
| `frontend/components/layout/NotesArea.tsx` | UPDATE — CSS columns masonry layout |
| `frontend/components/layout/DashboardShell.tsx` | UPDATE — derive noteCounts from all-notes query, pass to Sidebar |
| `frontend/components/layout/Sidebar.tsx` | UPDATE — accept noteCounts prop, pass to CategoryItem |
| `frontend/features/categories/components/CategoryItem.tsx` | UPDATE — display count badge |
| `frontend/features/notes/components/NoteModal.tsx` | UPDATE — replace inline hexToRgba with shared import |

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-06-26-notes-list-fe/` with `plan.md`, `shape.md`, `standards.md`, `references.md`.

---

## Task 2: PM Agent — Move SIM-53 to In Progress

`project-manager` moves SIM-53 → In Progress.

---

## Task 3: nextjs-engineer — Implement Notes List (SIM-53)

### 3a — `frontend/lib/utils.ts` (UPDATE)

Read file first. Add `hexToRgba` after the existing `cn` function:

```ts
export const hexToRgba = (hex: string, alpha: number): string => {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};
```

### 3b — `frontend/features/notes/components/NoteModal.tsx` (UPDATE)

Read file first. Remove the inline `hexToRgba` function and replace with import:
```ts
import { hexToRgba } from "@/lib/utils";
```

### 3c — `frontend/components/ui/NoteCard.tsx` (UPDATE)

Key changes:
- Import `Note` from `@/features/notes/types` (not `@/types`)
- Import `hexToRgba` from `@/lib/utils`
- Relative date: "today" / "yesterday" / "Month Day" (based on `note.updated_at`)
- Background = `hexToRgba(categoryColor, 0.5)`
- Border = `3px solid categoryColor` (full opacity)
- Border radius = 11px (inline style)
- Remove `line-clamp-3` — show full content

```tsx
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "today";
  if (date.toDateString() === yesterday.toDateString()) return "yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
};
```

Card style:
```tsx
style={{
  borderRadius: "11px",
  backgroundColor: hexToRgba(categoryColor, 0.5),
  border: `3px solid ${categoryColor}`,
}}
```

Use `note.updated_at` for the date (matches "Last edited" semantics).

### 3d — `frontend/components/layout/NotesArea.tsx` (UPDATE)

Replace the fixed `grid grid-cols-3` with CSS columns masonry:

```tsx
<div className="columns-3 gap-4 px-6 pb-6">
  {notes.map((note) => (
    <div key={note.id} className="break-inside-avoid mb-4">
      <NoteCard
        note={note}
        categoryColor={note.category.color}
        onClick={() => {}}
      />
    </div>
  ))}
</div>
```

Remove `categoryColor={note.category?.color ?? "#94a3b8"}` — category is now non-nullable, use `note.category.color` directly.

### 3e — `frontend/components/layout/DashboardShell.tsx` (UPDATE)

Add `useNotes` to derive per-category counts and pass to Sidebar:

```tsx
import useNotes from "@/features/notes/hooks/useNotes";

// inside DashboardShell:
const { data: allNotes = [] } = useNotes();
const noteCounts = allNotes.reduce<Record<string, number>>((acc, note) => {
  acc[note.category.id] = (acc[note.category.id] ?? 0) + 1;
  return acc;
}, {});

// pass to Sidebar:
<Sidebar
  activeCategory={activeCategory}
  setActiveCategory={setActiveCategory}
  noteCounts={noteCounts}
/>
```

React Query deduplicates — no extra network request since `useNotes()` (key: `["notes", null]`) is already used by NotesArea.

### 3f — `frontend/components/layout/Sidebar.tsx` (UPDATE)

Read file first. Add `noteCounts` prop and pass to `CategoryItem`:

```tsx
interface SidebarProps {
  activeCategory: string | null;
  setActiveCategory: (id: string | null) => void;
  noteCounts: Record<string, number>;
}

// in CategoryItem:
<CategoryItem
  key={cat.id}
  category={cat}
  isActive={activeCategory === cat.id}
  onClick={() => setActiveCategory(cat.id)}
  count={noteCounts[cat.id] ?? 0}
/>
```

### 3g — `frontend/features/categories/components/CategoryItem.tsx` (UPDATE)

Read file first. Add `count` prop and display it:

```tsx
interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

// in JSX, after category name:
{count !== undefined && (
  <span className="ml-auto text-xs text-brown/60">{count}</span>
)}
```

### 3h — Lint

```bash
cd /Users/coren/Documents/Projects/simple-notes-taking-app/frontend && npm run lint
```

Fix any issues.

---

## Task 4: QA Agent — Verify SIM-53

`qa-engineer` fetches SIM-53 and verifies by reading code:
- `NoteCard.tsx` uses relative dates and hexToRgba for opacity background
- `NotesArea.tsx` uses CSS columns for masonry layout
- `DashboardShell.tsx` derives noteCounts from useNotes and passes to Sidebar
- `CategoryItem.tsx` renders the count
- `npm run lint` passes

---

## Task 5: PM Agent — Move SIM-53 to Done

`project-manager` moves SIM-53 → Done. Check if SIM-17 parent can be closed (SIM-53 is last child).

---

## References

- `frontend/components/ui/NoteCard.tsx` — existing card to update
- `frontend/features/notes/components/NoteModal.tsx` — hexToRgba + card styling pattern
- `frontend/components/layout/NotesArea.tsx` — grid to convert to columns
- `frontend/components/layout/DashboardShell.tsx` — state management hub
- `frontend/features/categories/components/CategoryItem.tsx` — count display target
