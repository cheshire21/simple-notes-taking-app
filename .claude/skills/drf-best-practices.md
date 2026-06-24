# Django REST Framework Best Practices

Complements `django-architecture.md` (folder structure + layer rules) and `django-best-practices.md` (Django core).
Focus: how to build correct, secure, and maintainable REST APIs with DRF.

---

## Serializers

### Split Input and Output — Always
Never reuse the same serializer for reading and writing. Their shapes, validation rules, and fields differ.

- **Input serializers** (`serializers.Serializer`): validate incoming data only — no representation logic
- **Output serializers** (`serializers.ModelSerializer`): represent data for the response — no validation logic

```python
# notes/serializers.py

class NoteCreateInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    category_id = serializers.IntegerField(required=False, allow_null=True)

class NoteUpdateInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)

class NoteOutputSerializer(serializers.ModelSerializer):
    category = CategoryOutputSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "category", "created_at", "updated_at"]
```

### Validation
- Field-level validation: `validate_<field>(self, value)` — runs after type coercion
- Cross-field validation: `validate(self, attrs)` — runs after all field validators pass
- Raise `serializers.ValidationError` with a clear message — DRF formats it automatically

```python
class NoteCreateInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    category_id = serializers.IntegerField(required=False, allow_null=True)

    def validate_title(self, value):
        if value.strip() == "":
            raise serializers.ValidationError("Title cannot be blank.")
        return value.strip()

    def validate(self, attrs):
        category_id = attrs.get("category_id")
        if category_id and not Category.objects.filter(id=category_id).exists():
            raise serializers.ValidationError({"category_id": "Category not found."})
        return attrs
```

### Sensitive Fields
- `write_only=True` for passwords, tokens, secrets — they must never appear in responses
- `read_only=True` for auto-set fields (`created_at`, `id`) — they must never be writable via API

```python
class RegisterInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
```

### Nested Output
- Use nested output serializers for related objects — never return raw foreign key IDs alone when the client needs the object
- Mark nested serializers `read_only=True` on output serializers

```python
class NoteOutputSerializer(serializers.ModelSerializer):
    category = CategoryOutputSerializer(read_only=True)  # nested object, not just category_id

    class Meta:
        model = Note
        fields = ["id", "title", "category", "created_at"]
```

### SerializerMethodField
Use for computed/derived values that are not model fields:

```python
class NoteOutputSerializer(serializers.ModelSerializer):
    is_recent = serializers.SerializerMethodField()

    def get_is_recent(self, obj):
        return (timezone.now() - obj.created_at).days < 7

    class Meta:
        model = Note
        fields = ["id", "title", "is_recent"]
```

---

## Views

### The Golden Rule: Views Are Thin
A view's only job: authenticate → check permissions → deserialize → call service/selector → serialize → respond.
No ORM queries, no business logic, no `if/else` domain rules in views.

```python
# notes/views.py

class NoteCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NoteCreateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = note_create(user=request.user, **serializer.validated_data)
        return Response(NoteOutputSerializer(note).data, status=status.HTTP_201_CREATED)


class NoteDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, note_id):
        note = note_get(id=note_id, user=request.user)
        return Response(NoteOutputSerializer(note).data)

    def patch(self, request, note_id):
        note = note_get(id=note_id, user=request.user)
        serializer = NoteUpdateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = note_update(note=note, **serializer.validated_data)
        return Response(NoteOutputSerializer(note).data)

    def delete(self, request, note_id):
        note = note_get(id=note_id, user=request.user)
        note_delete(note=note)
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### APIView vs ViewSet
| Use | When |
|-----|------|
| `APIView` | Non-standard actions, explicit control, service-layer pattern (preferred in this project) |
| `ViewSet` + `Router` | Standard CRUD with minimal customization — reduces URL boilerplate |
| `GenericAPIView` + mixins | Standard CRUD with some customization |

### Always Set permission_classes Explicitly
Never rely on `DEFAULT_PERMISSION_CLASSES` being correct for every view. Declare it on every view.

```python
class PublicNoteListView(APIView):
    permission_classes = []  # intentionally public — explicit, not an oversight

class NoteCreateView(APIView):
    permission_classes = [IsAuthenticated]  # requires auth — explicit
```

---

## Permissions

### Baseline: IsAuthenticated
Every authenticated endpoint must have `IsAuthenticated` in `permission_classes`. No exceptions.

### Custom Object-Level Permissions
Write a `BasePermission` subclass for ownership checks — never put `if obj.user != request.user` inside a view.

```python
# notes/permissions.py

class IsNoteOwner(BasePermission):
    message = "You do not have permission to access this note."

    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id
```

```python
class NoteDetailView(APIView):
    permission_classes = [IsAuthenticated, IsNoteOwner]

    def get(self, request, note_id):
        note = get_object_or_404(Note, id=note_id)
        self.check_object_permissions(request, note)  # triggers IsNoteOwner
        return Response(NoteOutputSerializer(note).data)
```

### Read vs Write Permissions
Allow safe methods (GET, HEAD, OPTIONS) through a permission but block mutations:

```python
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user_id == request.user.id
```

### Return the Right Status
- `401 Unauthorized` — the request has no valid authentication credentials
- `403 Forbidden` — the request is authenticated but not allowed (wrong user, wrong role)

DRF handles this automatically when you raise `NotAuthenticated` vs `PermissionDenied`.

---

## Authentication

### JWT (recommended for SPAs)
Use `djangorestframework-simplejwt`:

```python
# core/settings/base.py
INSTALLED_APPS = [..., "rest_framework_simplejwt"]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
}
```

- Short-lived access tokens (15 min), longer-lived refresh tokens (7 days)
- Rotate refresh tokens on each use (`ROTATE_REFRESH_TOKENS = True`)
- Never issue non-expiring tokens in production

### Token Endpoints
Wire up simplejwt views in `core/urls.py`:

```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("api/auth/token/", TokenObtainPairView.as_view()),
    path("api/auth/token/refresh/", TokenRefreshView.as_view()),
]
```

---

## Queryset Scoping

**Always** scope querysets to the current user. This is the primary security boundary for multi-user data.

```python
# selectors.py — the right place to enforce user scoping
def note_list(*, user, category_id=None):
    qs = Note.objects.filter(user=user).select_related("category").order_by("-created_at")
    if category_id:
        qs = qs.filter(category_id=category_id)
    return qs

def note_get(*, id, user):
    return get_object_or_404(Note, id=id, user=user)  # 404 if wrong user, not 403 — don't leak existence
```

Never fetch a note by ID alone and then check ownership after — use both conditions in the query.

---

## Filtering, Search & Ordering

Use `django-filter` — never parse `request.query_params` manually in a view.

```python
# notes/filters.py
import django_filters
from .models import Note

class NoteFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name="category_id")
    created_after = django_filters.DateFilter(field_name="created_at", lookup_expr="gte")
    created_before = django_filters.DateFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Note
        fields = ["category", "created_after", "created_before"]
```

```python
class NoteListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteOutputSerializer
    filterset_class = NoteFilter
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["title"]                    # ?search=
    ordering_fields = ["created_at", "title"]   # ?ordering=-created_at
    ordering = ["-created_at"]                  # default ordering

    def get_queryset(self):
        return note_list(user=self.request.user)
```

---

## Pagination

- **Always paginate list endpoints** — returning unbounded lists will break at scale
- `PageNumberPagination` — simple, good for most cases
- `CursorPagination` — for large datasets or real-time feeds (no offset, stable under inserts)

```python
# core/pagination.py
from rest_framework.pagination import PageNumberPagination

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100
```

```python
# core/settings/base.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "core.pagination.StandardPagination",
    "PAGE_SIZE": 20,
}
```

---

## Throttling

Protect endpoints from abuse — especially auth endpoints.

```python
# core/settings/base.py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "30/minute",
        "user": "300/minute",
    },
}
```

Apply tighter throttling on auth endpoints:

```python
from rest_framework.throttling import AnonRateThrottle

class AuthRateThrottle(AnonRateThrottle):
    rate = "5/minute"

class LoginView(APIView):
    permission_classes = []
    throttle_classes = [AuthRateThrottle]
```

---

## Error Handling

### Let DRF Handle It
DRF's default exception handler converts `ValidationError`, `PermissionDenied`, `NotFound`, and `AuthenticationFailed` into proper JSON responses automatically. Raise these from service code — not from views.

```python
# services.py — raise, don't return error dicts
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError

def note_delete(*, note, user):
    if note.user_id != user.id:
        raise PermissionDenied("You cannot delete this note.")
    note.delete()
```

### Custom Exception Handler (when needed)
Override only when you need a custom envelope shape — and apply it globally, not per-view.

```python
# core/exceptions.py
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {"error": response.data, "status": response.status_code}
    return response
```

```python
# core/settings/base.py
REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "core.exceptions.custom_exception_handler",
}
```

**Be consistent** — never mix DRF's default shape with a custom shape in the same API.

---

## HTTP Status Codes

| Situation | Code |
|-----------|------|
| GET / PATCH success | `200 OK` |
| POST (resource created) | `201 Created` |
| DELETE success | `204 No Content` |
| Validation error | `400 Bad Request` |
| Unauthenticated | `401 Unauthorized` |
| Authenticated but not allowed | `403 Forbidden` |
| Resource not found | `404 Not Found` |
| Method not supported | `405 Method Not Allowed` |
| Rate limited | `429 Too Many Requests` |

Always use `status.HTTP_XXX` constants from `rest_framework` — never raw integers.

---

## Testing

### Test Class and Client
Use `APITestCase` and `APIClient` from DRF for all API tests.

```python
from rest_framework.test import APITestCase
from rest_framework import status

class NoteCreateTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.other_user = UserFactory()
        self.url = "/api/notes/"

    # Auth boundary
    def test_unauthenticated_returns_401(self):
        response = self.client.post(self.url, {"title": "Test"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Happy path
    def test_creates_note_and_returns_201(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"title": "My Note"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "My Note")

    # Validation
    def test_blank_title_returns_400(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"title": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
```

### What to Test Per Endpoint
For every endpoint, cover all four categories:

| Category | What |
|----------|------|
| **Auth** | Unauthenticated → 401 |
| **Ownership** | Authenticated as wrong user → 403 or 404 |
| **Validation** | Missing fields, invalid values → 400 with field errors |
| **Happy path** | Correct input → expected status code + response shape |

### Use force_authenticate, Not Tokens
`force_authenticate(user=self.user)` skips token parsing overhead — use it in all tests unless you're specifically testing auth token logic.

---

## Performance

- Apply `select_related` / `prefetch_related` in selectors (`get_queryset`) — never in serializers
- Use `only()` / `defer()` on endpoints that return large models with many unused fields
- Cache expensive aggregations — don't recompute per request

```python
# bad — N+1: serializer triggers a query per note
class NoteOutputSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name")  # hits DB per row

# good — join done upfront in the selector
def note_list(*, user):
    return Note.objects.filter(user=user).select_related("category")
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| One serializer for read and write | Split into Input + Output serializers |
| ORM queries in views | Use selectors |
| Business logic in views | Use services |
| Fetching by ID without user scope | Always filter by user in the query |
| No `permission_classes` on a view | Declare it explicitly on every view |
| Raw integers for status codes (`200`) | `status.HTTP_200_OK` constants |
| Returning unbounded lists | Paginate every list endpoint |
| Manually parsing `request.query_params` | Use `django-filter` |
| `PermissionDenied` from a view | Raise from the service; view stays thin |
