# SIM-46 — Filter Notes by Category

Active category state lifted to DashboardShell, passed to Sidebar (for highlighting) and NotesArea (for filtering).

## New files
- `features/categories/hooks/useActiveCategory.ts`
- `features/categories/components/CategoryItem.tsx`
- `features/notes/types.ts`, `api.ts`, `hooks/useNotes.ts`

## Updated files
- `DashboardShell.tsx` → client component, holds state
- `Sidebar.tsx` → accepts props, adds "All Notes", uses CategoryItem
- `NotesArea.tsx` → client component, wired to useNotes
- `types/index.ts` → id: string fixes
