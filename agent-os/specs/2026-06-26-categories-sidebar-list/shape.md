# Categories Sidebar List — Shaping Notes

## Scope
useCategories hook, listCategories API, and Sidebar rendering were already done.
Only loading/error states remain.

## Decisions
- No separate CategoryList.tsx needed — inline in Sidebar is sufficient
- Simple text indicators for loading/error (not skeletons)
