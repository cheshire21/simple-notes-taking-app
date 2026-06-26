# Notes App Setup — Shaping Notes

## Scope
Create notes Django app. Model only — no services/selectors/views.

## Decisions
- category FK is nullable (SET_NULL) — note can exist without a category
- ordering by -updated_at (most recently edited first)
- content is blank=True (note can have title only)
