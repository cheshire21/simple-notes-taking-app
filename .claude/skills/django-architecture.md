# Django Architecture Rules

## Pattern: Feature-Based + Services/Selectors (HackSoft)

Every Django app represents a **feature domain**. Business logic lives in services and selectors, never in views or models.

---

## Folder Structure

Each app must follow this structure:

```
<feature>/
├── models.py         # data, constraints, validators only
├── services.py       # all write operations (create, update, delete)
├── selectors.py      # all read operations (queries)
├── serializers.py    # input validation + output representation
├── views.py          # thin — only calls services/selectors
├── urls.py           # URL routing for this feature
└── tests/
    ├── test_models.py
    ├── test_services.py
    └── test_selectors.py
```

When `services.py` or `selectors.py` grow too large, split into a folder:

```
<feature>/
├── services/
│   ├── __init__.py
│   ├── note_services.py
│   └── category_services.py
└── selectors/
    ├── __init__.py
    └── note_selectors.py
```

---

## Rules Per Layer

### Models
- Only data fields, constraints, `clean()` validators, and simple properties
- No business logic, no calls to other services
- Always reference the user model via `settings.AUTH_USER_MODEL`

```python
class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.title.strip():
            raise ValidationError("Title cannot be blank")
```

---

### Services
- Plain functions (not classes) named `noun_verb`: `note_create`, `note_update`, `note_delete`
- Keyword-only arguments enforced with `*`
- Always call `full_clean()` before `save()`
- Return the model instance

```python
# notes/services.py
def note_create(*, user: User, title: str, category_id: int | None = None) -> Note:
    note = Note(user=user, title=title, category_id=category_id)
    note.full_clean()
    note.save()
    return note

def note_update(*, note: Note, title: str) -> Note:
    note.title = title
    note.full_clean()
    note.save(update_fields=["title"])
    return note

def note_delete(*, note: Note, user: User) -> None:
    if note.user_id != user.id:
        raise PermissionError("Not your note")
    note.delete()
```

---

### Selectors
- Plain functions named `noun_verb`: `note_list`, `note_get`, `note_get_or_404`
- Return `QuerySet` for lists, model instance for single objects
- All filtering, ordering, annotations live here — never in views

```python
# notes/selectors.py
def note_list(*, user: User, category_id: int | None = None) -> QuerySet[Note]:
    qs = Note.objects.filter(user=user).select_related("category").order_by("-created_at")
    if category_id is not None:
        qs = qs.filter(category_id=category_id)
    return qs

def note_get(*, id: int, user: User) -> Note:
    return get_object_or_404(Note, id=id, user=user)
```

---

### Serializers
- Split input and output serializers — never reuse the same one for both
- Input serializers handle validation only
- Output serializers handle representation only

```python
# notes/serializers.py
class NoteCreateInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    category_id = serializers.IntegerField(required=False)

class NoteOutputSerializer(serializers.ModelSerializer):
    category = CategoryOutputSerializer()

    class Meta:
        model = Note
        fields = ["id", "title", "category", "created_at"]
```

---

### Views
- Thin — validate input, call one service or selector, return response
- No business logic, no ORM queries, no `if/else` domain rules

```python
# notes/views.py
class NoteCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NoteCreateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = note_create(user=request.user, **serializer.validated_data)
        return Response(NoteOutputSerializer(note).data, status=status.HTTP_201_CREATED)

class NoteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notes = note_list(user=request.user, category_id=request.query_params.get("category_id"))
        return Response(NoteOutputSerializer(notes, many=True).data)
```

---

## Dependency Rules

Dependencies only flow **inward**. A feature may import from `shared/` or another feature's **models only** — never from another feature's services, selectors, or views.

```
views → services / selectors
services → models, shared
selectors → models, shared
notes → users (models only, via settings.AUTH_USER_MODEL)
users → never imports from notes
```

Shared utilities go in `core/` or a `shared/` app that any feature can import from.

---

## Apps

There is no fixed list of required apps. Each app is added as the product grows. When adding a new app:

- Run `python manage.py startapp <appname>` and register it in `core/settings.py` `INSTALLED_APPS`
- Wire its URLs in `core/urls.py`
- Follow the internal structure: `models.py`, `services.py`, `selectors.py`, `serializers.py`, `views.py`, `urls.py`, `tests/`
- An app may import from `core/` or another app's **models only** — never from another app's services, selectors, or views
