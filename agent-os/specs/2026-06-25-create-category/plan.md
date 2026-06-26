# Plan: SIM-37 — Create Category Functionality

## Context

Adds `POST /api/categories/` endpoint. App, model, and URL include already exist from SIM-36. Color field added to model after ticket was written — included in serializers. Pattern mirrors users/ app.

## Files to create / modify

| File | Action |
|------|--------|
| `backend/categories/services.py` | `category_create` service |
| `backend/categories/serializers.py` | `CategoryInputSerializer`, `CategoryOutputSerializer` |
| `backend/categories/views.py` | `CategoryListCreateView` (POST only) |
| `backend/categories/urls.py` | Wire `POST /api/categories/` |

## Done criteria

- `ruff check . --exclude .venv` passes
- POST /api/categories/ returns 201 with id, name, color, created_at
- POST /api/categories/ returns 401 if unauthenticated
- POST /api/categories/ returns 400 on missing name
- View is thin — no business logic, no ORM queries
- Service calls `full_clean()` before `save()`
