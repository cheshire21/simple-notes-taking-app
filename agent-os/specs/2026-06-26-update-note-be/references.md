# References

## Similar Implementations

### note_create service
- **Location:** `backend/notes/services.py`
- **Relevance:** Same pattern — validate category ownership, `full_clean()`, `save()`
- **Key patterns:** `Category.objects.get(id=category_id, user=user)` for ownership check

### NoteDetailView.get
- **Location:** `backend/notes/views.py`
- **Relevance:** `patch` method follows same structure — `note_get` → serialize → service → respond
- **Key patterns:** `DjangoValidationError` → `DRFValidationError` conversion

### NoteInputSerializer
- **Location:** `backend/notes/serializers.py`
- **Relevance:** `NoteUpdateInputSerializer` mirrors this but all fields `required=False`
