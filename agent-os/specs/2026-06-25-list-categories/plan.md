# Plan: SIM-40 — List Categories Functionality

## Context

Adds GET /api/categories/. Category has no user FK — returns all categories globally. URL already wired via CategoryListCreateView.

## Files

| File | Action |
|------|--------|
| `backend/categories/selectors.py` | `category_list()` |
| `backend/categories/views.py` | Add `get()` to CategoryListCreateView |

## Done criteria

- `ruff check . --exclude .venv` passes
- GET /api/categories/ returns 200 with list
- GET /api/categories/ returns 401 if unauthenticated
- Selector named `category_list`, no ORM in view
