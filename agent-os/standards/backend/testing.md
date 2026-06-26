# Testing Conventions

## Structure

- One test class per view
- Test method names read as sentences: `test_unauthenticated_returns_401`, `test_creates_note_and_returns_201`
- Use `APITestCase` + `force_authenticate` (not tokens) for all view tests

```python
# notes/tests/test_views.py

class NoteCreateViewTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.other_user = UserFactory()
        self.url = "/api/notes/"

    # Auth
    def test_unauthenticated_returns_401(self):
        response = self.client.post(self.url, {"title": "Test"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Validation
    def test_blank_title_returns_400(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"title": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    # Happy path
    def test_creates_note_and_returns_201(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"title": "My Note"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "My Note")


class NoteDetailViewTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.other_user = UserFactory()
        self.note = NoteFactory(user=self.user)
        self.url = f"/api/notes/{self.note.id}/"

    # Auth
    def test_unauthenticated_returns_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # Ownership
    def test_other_user_returns_404(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Happy path
    def test_returns_note_for_owner(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(self.note.id))
```

## 4 Required Categories per Endpoint

| Category | What to test |
|----------|-------------|
| **Auth** | Unauthenticated request → 401 |
| **Ownership** | Authenticated as wrong user → 404 (not 403 — don't leak existence) |
| **Validation** | Missing/invalid fields → 400 with field errors |
| **Happy path** | Correct input → expected status code + response shape |

Not every endpoint has all four (e.g. a public endpoint has no auth test). Include the ones that apply.

## Factories over Fixtures

Use `factory.Faker(...)` by default — produces realistic, varied data. Use `factory.Sequence` only when you need guaranteed uniqueness for ordering/numbering logic.

```python
# users/tests/factories.py
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Faker("email")
    password = factory.PostGenerationMethodCall("set_password", "testpass123")
    is_active = True

# notes/tests/factories.py
class NoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Note

    user = factory.SubFactory(UserFactory)
    title = factory.Faker("sentence", nb_words=5)
    content = factory.Faker("paragraph")
```

## Password in factories

Always use `PostGenerationMethodCall("set_password", ...)` — never assign a plain string to `password`.

`set_password()` runs PBKDF2 hashing. A plain string is stored unhashed and `authenticate()` silently fails in any test that checks login.

## Faker in test methods

`factory.Faker()` is lazy — it only works as a factory field declaration. For one-off values inside test methods, use `fake = Faker()` at module level:

```python
from faker import Faker
fake = Faker()  # module-level

class UserRegisterViewTests(APITestCase):
    def test_valid_registration(self):
        response = self.client.post(self.url, {
            "email": fake.email(),
            "password": fake.password(length=10),
        })
```

**Exception:** hardcode values that must be intentionally invalid (e.g. `"not-an-email"` for format validation tests).

## Rules

- `setUp` for mutable objects (recreated before each test)
- `setUpTestData` for read-only shared objects (created once per class — faster)
- Never assert on global counts — control all data within the test
- Never mock the ORM — test services and selectors against a real DB
- Mock only external calls: email, HTTP APIs, storage, tasks
