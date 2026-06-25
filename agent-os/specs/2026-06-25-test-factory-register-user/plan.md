# Plan: SIM-29 — Test & Factory: Register User

## Context

Test coverage and factory for user registration. Most work was pre-done during SIM-28. Faker was applied to all test data. No new files needed.

## Pipeline

Task 1: Spec docs ✓ | Task 2: PM → In Progress | Task 3: verify only (no code changes) | Task 4: QA | Task 5: PM → Done

## What exists (all complete)

- `users/tests/factories.py` — `UserFactory` with `factory.Faker("email")`
- `users/tests/test_services.py` — 4 tests using `fake.email()` / `fake.password(length=10)`
- `users/tests/test_views.py` — 6 tests using `fake.email()` / `fake.password(length=10)`

## Verification

```bash
cd backend && source .venv/bin/activate
ruff check . --exclude .venv
python manage.py test users
```
