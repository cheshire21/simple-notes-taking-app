# Delete Note FE — Shaping Notes

## Scope

Delete button inside NoteModal, visible only in edit mode. Deletes the note, closes modal, cache invalidation removes it from the grid.

## Decisions

- `useDeleteNote` called unconditionally (Rules of Hooks); conditional rendering handles visibility
- Button placed in the action row: Delete (left) / Save Note (right) via `justify-between`
- No confirmation dialog — direct delete (same pattern as category delete)
- `onSuccess: onClose` passed at call site rather than in hook, so hook stays reusable

## Context

- **Visuals:** None
- **References:** `useDeleteCategory.ts`, `features/categories/api.ts`
- **Product alignment:** N/A
