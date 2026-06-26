# Standards for Create Category

## backend/services-selectors

- Service: `category_create(*, user, name, color)` — keyword-only args, `full_clean()` before `save()`
- View calls service — no ORM in views

## backend/serializers-views

- Split input/output serializers — never reuse one for both directions
- `APIView` with `permission_classes: ClassVar = [IsAuthenticated]`
- `@extend_schema` for OpenAPI docs
