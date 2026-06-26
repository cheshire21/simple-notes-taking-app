# References

## Similar Implementations

### useDeleteCategory
- **Location:** `frontend/features/categories/hooks/useDeleteCategory.ts`
- **Relevance:** `useDeleteNote` mirrors this exactly — `useMutation` + invalidate `["notes"]`

### deleteCategory (API)
- **Location:** `frontend/features/categories/api.ts`
- **Relevance:** `deleteNote` follows same `api.delete` pattern

### NoteModal action row
- **Location:** `frontend/features/notes/components/NoteModal.tsx`
- **Relevance:** Delete button sits in the existing save row, toggled by presence of `note` prop
