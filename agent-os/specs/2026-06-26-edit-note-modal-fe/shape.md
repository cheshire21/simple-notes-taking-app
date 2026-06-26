# Edit Note Modal — Shaping Notes

## Scope

Reuse `NoteModal` for editing by adding an optional `note` prop. Clicking a NoteCard pre-fills the modal with existing data and PATCHes on submit instead of POSTing.

## Decisions

- Both `useCreateNote` and `useUpdateNote` are always called in NoteModal (no conditional hooks)
- `onSubmit` branches on presence of `note` prop to pick create vs update mutation
- `defaultValues` set from `note` when editing so RHF pre-fills without reset
- Two independent modal renders in NotesArea (create and edit never conflict)
- NoteCard's existing `onClick` prop requires no change — NotesArea passes the handler

## Context

- **Visuals:** None
- **References:** `NoteModal.tsx` (existing create flow), `useCreateNote.ts` (mutation pattern)
- **Product alignment:** N/A
