# References

## Similar Implementations

### note_list selector
- **Location:** `backend/notes/selectors.py`
- **Relevance:** Same ownership pattern via `category__user=user`
- **Key patterns:** `select_related("category")`, keyword-only args

### NoteListCreateView
- **Location:** `backend/notes/views.py`
- **Relevance:** Existing APIView for notes — `NoteDetailView` follows same structure
- **Key patterns:** `permission_classes: ClassVar = [IsAuthenticated]`, `extend_schema`, thin view calling selector

### TestNoteListCreateViewGet
- **Location:** `backend/notes/tests/test_views.py`
- **Relevance:** Test class structure to follow for `TestNoteDetailViewGet`
- **Key patterns:** `APITestCase`, `force_authenticate`, `setUp` with UserFactory + CategoryFactory
