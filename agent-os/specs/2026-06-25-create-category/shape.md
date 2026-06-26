# Create Category — Shaping Notes

## Scope

Backend POST endpoint to create a category for the authenticated user. Service + serializers + view + URL.

## Decisions

- `color` included in input (optional, default "#94a3b8") and output — added to model in SIM-36 after ticket was written
- `CategoryOutputSerializer` includes color field for frontend dot rendering
- `CategoryListCreateView` named for future GET (SIM-40) — POST only for now
- No tests in this ticket — come in SIM-38

## Context

- **Visuals:** None
- **References:** `users/services.py`, `users/serializers.py`, `users/views.py`
- **Product alignment:** Phase 3 — Categories

## Standards Applied

- backend/services-selectors — service pattern, keyword-only args, full_clean before save
- backend/serializers-views — split input/output, thin view, ClassVar on permission_classes
