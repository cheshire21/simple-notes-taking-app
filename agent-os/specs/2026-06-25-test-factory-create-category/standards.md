# Standards

## backend/testing

- One class per view, method names read as sentences
- `APITestCase` + `force_authenticate` for view tests
- 4 required categories: Auth, Ownership, Validation, Happy path
- Factories over fixtures; `Faker()` at module level for test methods
- Never mock the ORM — test against real DB
