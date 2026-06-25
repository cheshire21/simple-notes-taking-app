# Serializers & Views

## Serializer Split — Always

Never reuse the same serializer for reading and writing. No exceptions.

| Type | Base class | Purpose |
|------|-----------|---------|
| Input | `serializers.Serializer` | Validate incoming data only |
| Output | `serializers.ModelSerializer` | Represent data in responses only |

```python
# notes/serializers.py

class NoteCreateInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    category_id = serializers.UUIDField(required=False, allow_null=True)

class NoteUpdateInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False)
    category_id = serializers.UUIDField(required=False, allow_null=True)

class NoteOutputSerializer(serializers.ModelSerializer):
    category = CategoryOutputSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "category", "created_at", "updated_at"]
```

- `write_only=True` on passwords and tokens — must never appear in responses
- `read_only=True` on auto-set fields (`id`, `created_at`) — must never be writable
- Nested output: use a nested output serializer, not just the raw FK id

## Views — Always Explicit

- Use `APIView` — not `ViewSet` or generic views (services pattern requires manual control)
- Always declare `permission_classes` on every view — never rely on defaults

```python
class NoteCreateView(APIView):
    permission_classes = [IsAuthenticated]        # explicit, not inherited from settings

    def post(self, request):
        serializer = NoteCreateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        note = note_create(user=request.user, **serializer.validated_data)
        return Response(NoteOutputSerializer(note).data, status=status.HTTP_201_CREATED)
```

## Status Codes

| Situation | Code constant |
|-----------|--------------|
| GET / PATCH success | `HTTP_200_OK` |
| POST (created) | `HTTP_201_CREATED` |
| DELETE success | `HTTP_204_NO_CONTENT` |
| Validation error | `HTTP_400_BAD_REQUEST` |
| Unauthenticated | `HTTP_401_UNAUTHORIZED` |
| Wrong user | `HTTP_403_FORBIDDEN` or `HTTP_404_NOT_FOUND` |

Always use `status.HTTP_XXX` constants — never raw integers.
