# References

## Similar Implementations

### note_get selector
- **Location:** `backend/notes/selectors.py`
- **Relevance:** `category_get` mirrors this exactly — `get_object_or_404` then ownership check raising `Http404`

### NoteDetailView
- **Location:** `backend/notes/views.py`
- **Relevance:** `CategoryDetailView.delete` follows same APIView structure

### Existing category tests
- **Location:** `backend/categories/tests/test_views.py`
- **Relevance:** Follow `TestCategoryListCreateViewGet` pattern: `setUp`, `force_authenticate`, URL construction
