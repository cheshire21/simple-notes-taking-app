# List Notes BE — Shaping Notes

## Scope
Add `GET /api/notes/` endpoint returning the authenticated user's notes, with optional `?category=<id>` filtering.

## Decisions
- Ownership via `category__user` traversal (no direct user FK on Note model)
- Optional `?category=<id>` query param for filtering by category
- `select_related("category")` to avoid N+1 on serializer

## Context
- **Visuals:** None
- **References:** categories/selectors.py, categories/views.py
- **Product alignment:** N/A
