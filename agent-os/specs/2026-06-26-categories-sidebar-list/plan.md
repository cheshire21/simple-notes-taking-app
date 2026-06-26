# Plan: SIM-42 — Categories Sidebar List

## Scope
Most already implemented. Only missing: loading and error states in Sidebar.tsx.

## Files
| File | Change |
|------|--------|
| `frontend/components/layout/Sidebar.tsx` | Add isLoading + isError from useCategories |

## Done criteria
- npm run lint passes
- Categories load from API and display in sidebar
- Loading and error states handled
