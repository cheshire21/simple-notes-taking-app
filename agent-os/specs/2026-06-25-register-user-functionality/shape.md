# Register User Functionality — Shaping Notes

## Scope

Registration endpoint that creates a new user and returns JWT tokens. Public endpoint (no auth required). Part of Phase 1: Authentication.

## Decisions

- **Response shape returns tokens only** — `{ access, refresh }` — consistent with `/api/auth/token/` and matching what `useRegister` on the frontend expects
- **`UserOutputSerializer` included** but not used directly in register response — available for future user-detail endpoints
- **No tests in this ticket** — SIM-29 covers test & factory for this endpoint
- **`permission_classes = []`** — public endpoint, overrides the global `IsAuthenticated` default
- **JWT generated via `RefreshToken.for_user(user)`** — standard SimpleJWT pattern, no custom token views needed
- **Service calls `full_clean()`** — validates email uniqueness and format before `save()`

## Context

- **Visuals:** None — backend API only
- **References:** `users/models.py` (User model, UUID pk, email unique), `users/tests/factories.py` (UserFactory pattern), standards files
- **Product alignment:** Phase 1 Authentication — prerequisite for Register Page (SIM-30)
