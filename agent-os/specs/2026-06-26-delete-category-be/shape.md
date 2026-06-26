# Delete Category — Shaping Notes

## Scope

Backend endpoint to delete a category. Only the owner can delete their own category. Returns 404 (not 403) for wrong-user requests to avoid enumeration.

## Decisions

- 404 for both non-existent and wrong-user cases (mirrors note_get pattern)
- `category_get` selector handles ownership check; service delegates to it
- `APIView` not `DestroyAPIView` (project convention)
- No ORM queries directly in service or view

## Context

- **Visuals:** None
- **References:** `notes/selectors.py` (note_get), `notes/views.py` (NoteDetailView)
- **Product alignment:** N/A
