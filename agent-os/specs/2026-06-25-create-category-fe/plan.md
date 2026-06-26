# Plan: SIM-39 — Create Category (Frontend)

## Context

Inline "Create Category" form in the sidebar. Backend POST /api/categories/ is live (SIM-37). GET doesn't exist yet (SIM-40) — mutation invalidates ["categories"] query key for when SIM-42 connects the list.

## Files

| File | Action |
|------|--------|
| `features/categories/types.ts` | Category, CreateCategoryPayload |
| `features/categories/api.ts` | createCategory() |
| `features/categories/schemas/createCategory.schema.ts` | zod schema |
| `features/categories/hooks/useCreateCategory.ts` | useMutation hook |
| `features/categories/components/CreateCategoryForm.tsx` | Inline form |
| `components/layout/Sidebar.tsx` | Add form + toggle |

## Done criteria

- `npm run lint` passes
- Submitting calls POST /api/categories/
- Shows error if submission fails
