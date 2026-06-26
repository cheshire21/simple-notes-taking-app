# References for Create Category

## users/services.py

- **Location:** `backend/users/services.py`
- **Relevance:** Keyword-only args, `full_clean()` before `save()`, typed return

## users/serializers.py

- **Location:** `backend/users/serializers.py`
- **Relevance:** Input (`Serializer`) vs output (`ModelSerializer`) split, `ClassVar` on Meta.fields

## users/views.py

- **Location:** `backend/users/views.py`
- **Relevance:** `APIView` + `@extend_schema` + `permission_classes: ClassVar` + `serializer.is_valid(raise_exception=True)`

## users/urls.py

- **Location:** `backend/users/urls.py`
- **Relevance:** `path(...)` + `as_view()` + named URL pattern

## categories/models.py

- **Location:** `backend/categories/models.py`
- **Relevance:** Category fields: id (UUID), name, color, user (FK), created_at
