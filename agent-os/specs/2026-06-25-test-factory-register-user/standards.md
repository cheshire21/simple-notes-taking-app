# Standards for Test & Factory: Register User

---

## backend/testing

Use `factory.Faker(...)` for all test data — never hardcode strings like `"test@example.com"`. One test class per view. Descriptive method names. `APITestCase` + no `force_authenticate` for public endpoints (register has no auth).

**4 required test categories for `UserRegisterView`:**
- Auth: N/A — public endpoint (`permission_classes = []`)
- Validation: missing fields → 400, invalid email → 400, duplicate email → 400
- Happy path: valid input → 201 with `{ access, refresh }` tokens
- Response shape: password never in response

**Factory pattern:**
```python
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Faker("email")
    password = factory.PostGenerationMethodCall("set_password", "testpass123")
    is_active = True
```
