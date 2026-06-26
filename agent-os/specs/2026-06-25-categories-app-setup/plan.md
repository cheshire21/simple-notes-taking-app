# Plan: SIM-36 — Categories App Setup & Model

## Context

SIM-36 creates the `categories` Django app with a UUID-based `Category` model linked to the authenticated user. No views, services, or selectors yet — pure setup: model, admin, migrations, and placeholder URL wiring.

## Files to create / modify

| File | Action |
|------|--------|
| `backend/categories/` | Created via `python manage.py startapp categories` |
| `backend/categories/models.py` | `Category` model |
| `backend/categories/admin.py` | Register `Category` |
| `backend/categories/urls.py` | Empty placeholder `urlpatterns = []` |
| `backend/core/settings/base.py` | Add `"categories"` to `INSTALLED_APPS` after `"users"` |
| `backend/core/urls.py` | Add `path("", include("categories.urls"))` after users include |

## Done criteria

- `ruff check . --exclude .venv` passes
- Migration runs without errors
- Category model uses UUID primary key
