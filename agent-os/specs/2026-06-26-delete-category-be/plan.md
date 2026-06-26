# Plan: SIM-43 & SIM-44 — Delete Category BE + Tests

## Context

The app lets users manage categories but has no way to delete them. SIM-43 adds `DELETE /api/categories/{uuid}/` following the same services/selectors architecture used throughout the backend. SIM-44 adds full test coverage for the service and view layers.

## Implementation

### `categories/selectors.py` — add `category_get`

```python
def category_get(*, id: str, user: AbstractUser) -> Category:
    category = get_object_or_404(Category, id=id)
    if category.user != user:
        raise Http404
    return category
```

### `categories/services.py` — add `category_delete`

```python
def category_delete(*, category_id: str, user: AbstractUser) -> None:
    category = category_get(id=category_id, user=user)
    category.delete()
```

### `categories/views.py` — add `CategoryDetailView`

```python
class CategoryDetailView(APIView):
    permission_classes: ClassVar = [IsAuthenticated]

    def delete(self, request, pk):
        category_delete(category_id=pk, user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### `categories/urls.py` — add detail route

```python
path("api/categories/<uuid:pk>/", CategoryDetailView.as_view(), name="category_detail"),
```

### Tests

- `categories/tests/test_services.py` — 3 cases: success, 404 not found, 404 wrong user
- `categories/tests/test_views.py` — 4 cases: 204 success, 401 unauth, 404 wrong user, 404 not found
