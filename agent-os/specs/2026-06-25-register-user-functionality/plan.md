# Plan: SIM-28 — Register User Functionality

## Context

Public registration endpoint. Creates a new user and returns JWT tokens `{ access, refresh }` matching the shape the frontend `useRegister` hook expects. User model and UserFactory already exist (SIM-25).

## Pipeline

Task 1: Spec docs ✓ | Task 2: PM → In Progress | Task 3: django-engineer | Task 4: QA | Task 5: PM → Done

## Files to create/modify

- `users/services.py` — `user_register(*, email, password)`: sets hashed password, calls `full_clean()`, saves
- `users/serializers.py` — `UserRegisterInputSerializer` (email, password write_only), `UserOutputSerializer` (id, email)
- `users/views.py` — `UserRegisterView(APIView)`, `permission_classes = []`, returns `{ access, refresh }` via `RefreshToken.for_user(user)`, status 201
- `users/urls.py` — `POST api/auth/register/`
- `core/urls.py` — include users.urls

## Response shape

`{ "access": "...", "refresh": "..." }` — consistent with `/api/auth/token/` and matches frontend expectation.

## Password security

`set_password()` hashes before save. `write_only=True` on serializer field. Never in response.
