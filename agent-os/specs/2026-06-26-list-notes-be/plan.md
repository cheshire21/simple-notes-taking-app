# Plan: SIM-51 + SIM-52 — List Notes BE

## Context

`GET /api/notes/` returns 405 because `NoteListCreateView` only has `post`. SIM-51 adds the list selector and view GET handler. SIM-52 adds tests. Ownership is derived via `category__user` (no direct user FK on Note).

---

## Spec folder

`agent-os/specs/2026-06-26-list-notes-be/`

---

## Files to create / modify

| File | Action |
|------|--------|
| `backend/notes/selectors.py` | NEW — `note_list` selector |
| `backend/notes/views.py` | UPDATE — add `get` method |
| `backend/notes/tests/test_selectors.py` | NEW — selector tests |
| `backend/notes/tests/test_views.py` | UPDATE — add GET test class |

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-06-26-list-notes-be/` with `plan.md`, `shape.md`, `standards.md`, `references.md`.

---

## Task 2: PM Agent — Move SIM-51 to In Progress

`project-manager` moves SIM-51 → In Progress.

---

## Task 3: django-engineer — Implement List Notes (SIM-51)

### 3a — `backend/notes/selectors.py` (NEW)

Mirror `categories/selectors.py`. Supports optional `category_id` filter:

```python
from typing import TYPE_CHECKING
from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from notes.models import Note

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

User = get_user_model()


def note_list(*, user: "AbstractUser", category_id: str | None = None) -> QuerySet[Note]:
    qs = Note.objects.filter(category__user=user).select_related("category")
    if category_id:
        qs = qs.filter(category_id=category_id)
    return qs
```

### 3b — `backend/notes/views.py` (UPDATE)

Add import for `note_list` and add `get` method before `post`:

```python
from notes.selectors import note_list

# inside NoteListCreateView:
@extend_schema(responses={200: NoteOutputSerializer(many=True)})
def get(self, request):
    category_id = request.query_params.get("category")
    notes = note_list(user=request.user, category_id=category_id)
    return Response(NoteOutputSerializer(notes, many=True).data)
```

### 3c — Lint

```bash
cd /Users/coren/Documents/Projects/simple-notes-taking-app/backend && source .venv/bin/activate && ruff check notes/selectors.py notes/views.py
```

---

## Task 4: PM Agent — Move SIM-51 to Done, SIM-52 to In Progress

`project-manager` moves SIM-51 → Done, SIM-52 → In Progress.

---

## Task 5: django-engineer — Tests (SIM-52)

### 5a — `backend/notes/tests/test_selectors.py` (NEW)

Mirror `categories/tests/test_selectors.py`:

```python
from django.test import TestCase
from faker import Faker
from categories.tests.factories import CategoryFactory
from notes.selectors import note_list
from notes.tests.factories import NoteFactory
from users.tests.factories import UserFactory

fake = Faker()

class TestNoteList(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)

    def test_returns_only_own_notes(self):
        NoteFactory(category=self.category)
        NoteFactory()  # another user's note
        result = list(note_list(user=self.user))
        self.assertEqual(len(result), 1)

    def test_returns_empty_queryset_when_no_notes(self):
        result = list(note_list(user=self.user))
        self.assertEqual(len(result), 0)

    def test_filters_by_category_id(self):
        other_category = CategoryFactory(user=self.user)
        note = NoteFactory(category=self.category)
        NoteFactory(category=other_category)
        result = list(note_list(user=self.user, category_id=str(self.category.id)))
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].id, note.id)

    def test_excludes_other_users_notes(self):
        NoteFactory()
        result = list(note_list(user=self.user))
        self.assertEqual(len(result), 0)
```

### 5b — `backend/notes/tests/test_views.py` (UPDATE)

Add `NoteFactory` import and `TestNoteListCreateViewGet` class before existing `TestNoteListCreateViewPost`:

```python
class TestNoteListCreateViewGet(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.url = "/api/notes/"

    def test_unauthenticated_returns_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_returns_only_own_notes(self):
        NoteFactory(category=self.category)
        NoteFactory()  # another user's note
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_returns_empty_list_when_no_notes(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_filters_by_category_id(self):
        other_category = CategoryFactory(user=self.user)
        NoteFactory(category=self.category)
        NoteFactory(category=other_category)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"category": str(self.category.id)})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
```

### 5c — Run tests

```bash
python manage.py test notes.tests.test_selectors notes.tests.test_views
```

---

## Task 6: QA Agent — Verify SIM-52

`qa-engineer` fetches SIM-52 and verifies:
- `test_selectors.py` exists and covers isolation + category filter
- `test_views.py` has GET test class covering 401, own-only, empty list, category filter
- All tests pass (`python manage.py test notes`)

---

## Task 7: PM Agent — Move SIM-52 to Done

`project-manager` moves SIM-52 → Done.

---

## References

- `backend/categories/selectors.py` — `category_list` pattern to mirror
- `backend/categories/views.py` — GET + POST view pattern
- `backend/categories/tests/test_selectors.py` — selector test structure
- `backend/categories/tests/test_views.py` — view GET test structure
- `backend/notes/tests/factories.py` — `NoteFactory` with `SubFactory(CategoryFactory)`
