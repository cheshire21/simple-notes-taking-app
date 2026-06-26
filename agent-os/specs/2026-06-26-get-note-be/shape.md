# Get Note BE — Shaping Notes

## Scope

Backend endpoint to retrieve a single note by ID. Ownership check via `note.category.user` (no direct user FK on Note model).

## Decisions

- 404 (not 403) for other user's notes — avoids user enumeration
- `select_related("category")` in selector prevents N+1 when serializer accesses `note.category.*`
- Separate `NoteDetailView(APIView)` — not added to `NoteListCreateView`
- `get_object_or_404` handles missing note; explicit `if note.category.user != user: raise Http404` handles ownership

## Context

- **Visuals:** None
- **References:** `notes/selectors.py` (note_list pattern), `categories/views.py` (APIView pattern)
- **Product alignment:** N/A
