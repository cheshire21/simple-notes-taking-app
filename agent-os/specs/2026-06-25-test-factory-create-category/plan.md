# Plan: SIM-38 — Test & Factory: Create Category

## Context

Adds test coverage and a factory for `category_create` (SIM-37). Also adds `unique_together = [("name", "user")]` to the Category model so the duplicate-name test is meaningful.

## Files

| File | Action |
|------|--------|
| `backend/categories/models.py` | Add `unique_together` to Meta |
| `backend/categories/migrations/0003_*` | Migration for unique_together |
| `backend/categories/tests/__init__.py` | Empty |
| `backend/categories/tests/factories.py` | `CategoryFactory` |
| `backend/categories/tests/test_services.py` | 3 service tests |
| `backend/categories/tests/test_views.py` | 4 view tests |

## Done criteria

- `python manage.py test categories` passes
- Auth, ownership, validation, happy path covered
- `ruff check . --exclude .venv` passes
