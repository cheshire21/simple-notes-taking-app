# Test & Factory: Register User — Shaping Notes

## Scope

Full test coverage and factory for the user registration feature. Tests for `user_register` service and `UserRegisterView` endpoint. Factory using `factory.Faker` for realistic mock data.

## Decisions

- **`factory.Faker("email")` over `factory.Sequence`** — produces realistic data; `Sequence` only needed for ordering tests
- **`fake.password(length=10)` for passwords** — ensures minimum length passes Django's `MinimumLengthValidator` (min 8)
- **Factories live in `users/tests/factories.py`** — not at app root; test-only concern
- **Most work pre-done in SIM-28** — django-engineer wrote tests during implementation; Faker updates applied separately
- **No new files needed** — all files exist and are complete

## Context

- **Visuals:** None — backend tests only
- **References:** `users/tests/factories.py`, `users/tests/test_services.py`, `users/tests/test_views.py`
- **Product alignment:** Phase 1 Authentication — test coverage prerequisite before Register Page (SIM-30)

## Standards Applied

- `backend/testing` — `factory.Faker` for test data, one class per view, 4 required test categories, factories over fixtures
