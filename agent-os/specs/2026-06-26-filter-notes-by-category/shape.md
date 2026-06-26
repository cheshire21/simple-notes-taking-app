# Filter Notes by Category — Shaping Notes

## Scope
Sidebar category selection filters the notes list. Active category highlighted bold.

## Decisions
- State lives in DashboardShell (common parent of Sidebar + NotesArea)
- useActiveCategory is a thin useState wrapper
- useNotes will 404 until notes API (SIM-48+) is ready — expected
- CategoryItem replaces inline li map in Sidebar
- "All Notes" resets filter (activeCategory = null)

## Context
- Visuals: None
- References: useCategories.ts, Sidebar.tsx, DashboardShell.tsx
- Product alignment: N/A
