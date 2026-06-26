# Plan: SIM-32 — Logout User Functionality

## Context

SIM-32 adds `POST /api/auth/logout/` that blacklists the user's refresh token. `rest_framework_simplejwt.token_blacklist` is already in `INSTALLED_APPS` — migrations just need to be applied. Pattern mirrors `UserRegisterView` (APIView, explicit permission_classes, input serializer, service layer).

## Files to create/modify

| File | Action |
|------|--------|
| `users/services.py` | Add `user_logout(*, refresh_token: str) -> None` |
| `users/serializers.py` | Add `LogoutInputSerializer` |
| `users/views.py` | Add `UserLogoutView` |
| `users/urls.py` | Add `POST api/auth/logout/` |
| `users/tests/test_views.py` | Add `TestUserLogoutView` class |
| `users/tests/test_services.py` | Add `TestUserLogout` class |

## Tasks

1. Save spec docs ✓
2. PM → SIM-32 In Progress ✓
3. django-engineer implements
4. QA verifies done criteria
5. PM → Done (only if QA READY)
