# Delete Category FE — Shaping Notes

## Scope

Trash icon on each sidebar category row. Hover to reveal, click to delete, inline error if it fails.

## Decisions

- Trash icon hidden by default, revealed on row hover (progressive disclosure)
- `stopPropagation` on delete click prevents also selecting the category
- Error shown inline below the row (not a toast) — matches CreateCategoryForm pattern
- No confirmation dialog — direct delete

## Context

- **Visuals:** User specified trash icon
- **References:** `useCreateCategory.ts` (mutation pattern), `CreateCategoryForm.tsx` (lucide icons, error style)
- **Product alignment:** N/A
