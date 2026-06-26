# Categories App Setup — Shaping Notes

## Scope

Create the `categories` Django app with a UUID `Category` model. No views or API endpoints yet — those come in SIM-37+.

## Decisions

- UUID primary key (matches `users` app pattern)
- `user` ForeignKey with `on_delete=CASCADE` — deleting a user removes their categories
- `ordering = ["name"]` in Meta for consistent list ordering
- Placeholder `urls.py` wired into `core/urls.py` so future endpoints just add to it

## Context

- **Visuals:** None
- **References:** `backend/users/models.py`, `backend/core/settings/base.py`, `backend/core/urls.py`
- **Product alignment:** Phase 3 — Categories foundation

## Standards Applied

- backend/services-selectors — N/A this ticket (no views); applies from SIM-37
- backend/testing — N/A this ticket (no views); applies from SIM-38
