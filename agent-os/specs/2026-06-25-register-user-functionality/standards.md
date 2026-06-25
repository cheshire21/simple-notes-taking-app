# Standards for Register User Functionality

---

## backend/services-selectors

Services are plain functions with keyword-only args. Always call `full_clean()` before `save()`. Return the model instance. No ORM queries in views.

```python
def user_register(*, email: str, password: str) -> User:
    user = User(email=email)
    user.set_password(password)
    user.full_clean()
    user.save()
    return user
```

---

## backend/serializers-views

Split input/output serializers. Use `APIView` with explicit `permission_classes`. Use `status.HTTP_XXX` constants.

- Input: `serializers.Serializer` — validate only
- Output: `serializers.ModelSerializer` — represent data only
- `write_only=True` on password — must never appear in responses
- `permission_classes = []` for public endpoints — never rely on defaults

---

## backend/testing

(Tests are in SIM-29 — referenced here for awareness)

One class per view, descriptive method names, `APITestCase`, factories over fixtures. For a public endpoint the relevant categories are: validation (400 on bad input) and happy path (201 on success).
