# Notes List FE — Shaping Notes

## Scope
Display user notes as a masonry grid of NoteCards. Cards show relative date, category name, title, and full content. Background = category color at 50% opacity, border = full opacity. Sidebar shows per-category note counts.

## Decisions
- CSS columns for masonry (no library needed)
- hexToRgba extracted to lib/utils.ts (shared with NoteModal)
- Note counts derived in DashboardShell from useNotes() — React Query deduplicates

## Context
- **Visuals:** Figma design shared in conversation
- **References:** NoteModal.tsx for card styling, CategoryItem.tsx for sidebar
- **Product alignment:** N/A
