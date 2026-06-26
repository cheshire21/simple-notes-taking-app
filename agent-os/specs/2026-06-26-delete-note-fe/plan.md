# Plan: SIM-61 — Delete Note FE

## Context

Backend DELETE /api/notes/{uuid}/ is live. Add a Delete button inside NoteModal (edit mode only) that deletes the note, closes the modal, and removes it from the list.

## Implementation

### `features/notes/api.ts` — add `deleteNote`
```ts
export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/api/notes/${id}/`);
};
```

### `features/notes/hooks/useDeleteNote.ts` — NEW
```ts
const useDeleteNote = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
```

### `features/notes/components/NoteModal.tsx` — add Delete button

- Call `useDeleteNote` unconditionally
- Add Delete button only when `note` prop exists, to the left of Save Note (`justify-between`)
- On click: `deleteMutate(note.id, { onSuccess: onClose })`
