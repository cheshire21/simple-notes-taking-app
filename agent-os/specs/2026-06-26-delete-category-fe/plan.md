# Plan: SIM-45 — Delete Category FE

## Context

Backend DELETE /api/categories/{uuid}/ is live. Add a trash icon to each sidebar category row that deletes it on click.

## Implementation

### `features/categories/api.ts` — add `deleteCategory`

```ts
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/categories/${id}/`);
};
```

### `features/categories/hooks/useDeleteCategory.ts` — NEW

```ts
const useDeleteCategory = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
```

### `features/categories/components/CategoryItem.tsx` — add delete button

- `useDeleteCategory` hook + local error state
- `<Trash2>` from lucide-react, hidden until hover (`group/item` + `opacity-0 group-hover/item:opacity-100`)
- `e.stopPropagation()` on delete click to avoid triggering category selection
- Inline error message on failure (`text-xs text-red-500`)
