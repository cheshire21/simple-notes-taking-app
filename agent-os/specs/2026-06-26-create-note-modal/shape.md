# Create Note Modal — Shaping Notes

## Decisions
- Full-page overlay (fixed inset-0 bg-cream), not a dialog
- Category select is required — Zod validates min(1)
- useCreateNote invalidates ["notes"] queryKey on success
- State (isModalOpen) lives in NotesArea
