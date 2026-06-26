# References

## Similar Implementations

### category_delete service
- **Location:** `backend/categories/services.py`
- **Relevance:** Same pattern — fetch via selector then `.delete()`; `note_delete` is even simpler since ownership is pre-checked

### NoteDetailView (get/patch)
- **Location:** `backend/notes/views.py`
- **Relevance:** `delete` method follows the same thin-view pattern

### TestNoteDetailViewGet
- **Location:** `backend/notes/tests/test_views.py`
- **Relevance:** `TestNoteDetailViewDelete` follows same setUp/force_authenticate structure
