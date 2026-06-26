# Test & Factory: Create Category — Shaping Notes

## Scope

Factory and full test coverage for `category_create` service and `CategoryListCreateView POST`.

## Decisions

- Added `unique_together = [("name", "user")]` to model — required for "duplicate name raises" test to be meaningful
- `CategoryFactory` uses `factory.Faker("word")` for name
- Tests follow 4 categories: Auth, Validation, Happy path, Ownership

## Context

- **Visuals:** None
- **References:** `users/tests/` patterns
- **Product alignment:** Phase 3 — Categories
