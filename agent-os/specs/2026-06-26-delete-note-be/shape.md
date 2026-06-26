# Delete Note BE — Shaping Notes

## Scope

Add DELETE method to existing NoteDetailView. Service delegates deletion; selector enforces ownership.

## Decisions

- `note_delete` service accepts a `Note` instance (already fetched and ownership-checked by view)
- No URL changes needed — NoteDetailView already handles `/api/notes/<uuid:pk>/`
- 404 for both non-existent and wrong-user cases (via existing `note_get`)

## Context

- **Visuals:** None
- **References:** `notes/selectors.py` (note_get), `categories/services.py` (category_delete pattern)
- **Product alignment:** N/A
