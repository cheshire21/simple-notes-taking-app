# Services / Selectors Architecture

All write operations live in services. All read operations live in selectors. Views call one or the other — they contain zero logic.

## Naming
- Services: `noun_verb` — `note_create`, `note_update`, `note_delete`
- Selectors: `noun_verb` — `note_list`, `note_get`, `category_list`

## Services
- Plain functions, keyword-only args (`*`), always call `full_clean()` before `save()`
- Return the model instance

```python
def note_create(*, user: User, title: str, category_id: UUID | None = None) -> Note:
    note = Note(user=user, title=title, category_id=category_id)
    note.full_clean()
    note.save()
    return note

def note_update(*, note: Note, title: str) -> Note:
    note.title = title
    note.full_clean()
    note.save(update_fields=["title"])
    return note
```

## Selectors
- Plain functions, keyword-only args, always filter by `user`
- Return `QuerySet` for lists, model instance for single objects
- Ownership enforced with `get_object_or_404(Note, id=id, user=user)` — returns 404, not 403, to avoid leaking existence

```python
def note_get(*, id: UUID, user: User) -> Note:
    return get_object_or_404(Note, id=id, user=user)

def note_list(*, user: User, category_id: UUID | None = None) -> QuerySet[Note]:
    qs = Note.objects.filter(user=user).select_related("category").order_by("-updated_at")
    if category_id:
        qs = qs.filter(category_id=category_id)
    return qs
```

## Views (thin)
Pattern: authenticate → deserialize → call service/selector → serialize → respond.

```python
class NoteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        note = note_get(id=pk, user=request.user)       # selector handles 404
        serializer = NoteUpdateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = note_update(note=note, **serializer.validated_data)
        return Response(NoteOutputSerializer(note).data)
```

## Rules
- No ORM queries in views — ever
- No business logic in views — ever
- Views call the selector first, then pass the object to the service
- Services never call selectors — they receive the object as a parameter
