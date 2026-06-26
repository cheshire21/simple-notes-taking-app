# References

## Similar Implementations

### useCreateNote
- **Location:** `frontend/features/notes/hooks/useCreateNote.ts`
- **Relevance:** `useUpdateNote` mirrors this exactly, with `id` added to the mutation variable
- **Key patterns:** `useMutation`, invalidate `["notes"]` on success

### NoteModal (create flow)
- **Location:** `frontend/features/notes/components/NoteModal.tsx`
- **Relevance:** Edit mode adds `note?` prop and conditional mutation — all other structure stays the same
- **Key patterns:** `useForm` with `defaultValues`, `Controller` for CategoryDropdown, `setError` for API errors

### features/notes/api.ts
- **Location:** `frontend/features/notes/api.ts`
- **Relevance:** `updateNote` follows same pattern as `createNote` but uses `api.patch`
