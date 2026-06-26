# References

## Similar Implementations

### useCreateCategory
- **Location:** `frontend/features/categories/hooks/useCreateCategory.ts`
- **Relevance:** `useDeleteCategory` mirrors this — `useMutation` + `invalidateQueries(["categories"])`

### CreateCategoryForm
- **Location:** `frontend/features/categories/components/CreateCategoryForm.tsx`
- **Relevance:** Lucide icons pattern (`Check`, `X` from lucide-react), inline error style (`text-xs text-red-500`)

### CategoryItem (current)
- **Location:** `frontend/features/categories/components/CategoryItem.tsx`
- **Relevance:** File being modified — currently a simple button, needs group hover + delete button added
