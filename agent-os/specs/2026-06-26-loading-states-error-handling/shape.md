# Loading States & Error Handling — Shaping Notes

## Scope

Upgrade the two plain-text loading states (notes grid, sidebar categories) to animated skeleton UIs. Add retry buttons to fetch error states.

## Decisions

- Skeleton uses Tailwind animate-pulse + brown/15 background to match the app's color palette
- NoteCardSkeleton mirrors NoteCard dimensions exactly (h-[246px], border-radius 11px)
- Sidebar skeleton items mirror CategoryItem layout (dot + label)
- 6 skeleton cards in the notes grid (matches a typical 2-row view)
- 4 skeleton items in the sidebar (matches typical category count)
- No changes to NoteModal, NoteCard delete, CategoryItem delete — their mutation pending/error states are already adequate

## Context

- Visuals: None
- References: NoteCard (components/ui/NoteCard.tsx), CategoryItem (features/categories/components/CategoryItem.tsx)
- Product alignment: Phase 5 Polish milestone
