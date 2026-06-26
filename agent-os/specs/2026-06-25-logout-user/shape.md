# Logout User — Shaping Notes

## Scope

Build `POST /api/auth/logout/` endpoint (SIM-32). Accepts a refresh token, blacklists it, returns 204. Backend only — no frontend changes.

## Decisions

- `user_logout` service accepts refresh token string and calls `token.blacklist()` from simplejwt
- `TokenError` from simplejwt (invalid or already blacklisted token) → caught in view → 400 with field error on `refresh`
- `permission_classes = [IsAuthenticated]` — unauthenticated users get 401
- No output serializer — 204 returns no body
- Migrations needed: `python manage.py migrate` applies `token_blacklist` app migrations already in INSTALLED_APPS

## Context

- **Visuals:** None (backend only)
- **References:** `users/views.py` (UserRegisterView pattern), `users/services.py` (user_register pattern)
- **Product alignment:** Phase 1 Authentication — closes SIM-8 (User Logout epic) once all children are done

## Standards Applied

- backend/services-selectors — service function with keyword-only args
- backend/serializers-views — APIView, explicit permission_classes, input-only serializer
- backend/testing — 4 categories, APITestCase + force_authenticate, no ORM mocking
