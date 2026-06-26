# Plan: SIM-59 & SIM-60 — Delete Note BE + Tests

## Context

Extend `NoteDetailView` with a `delete` method. `note_get` already handles ownership/404. Service is a one-liner.

## Implementation

### `notes/services.py` — add `note_delete`
```python
def note_delete(*, note: Note) -> None:
    note.delete()
```

### `notes/views.py` — add `delete` to `NoteDetailView`
```python
def delete(self, request, pk):
    note = note_get(id=pk, user=request.user)
    note_delete(note=note)
    return Response(status=status.HTTP_204_NO_CONTENT)
```

### Tests

- `test_services.py` — `TestNoteDelete`: success case, note removed from DB
- `test_views.py` — `TestNoteDetailViewDelete`: 204 success, 401 unauth, 404 wrong user, 404 not found
