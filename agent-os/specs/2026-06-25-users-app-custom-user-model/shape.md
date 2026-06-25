# Users App Setup — Shaping Notes

## Scope

Create a custom Django User model as the auth foundation. UUID primary key, email as username, no username field. This unblocks all other backend auth tickets.

## Decisions

- AbstractBaseUser + PermissionsMixin (not AbstractUser) — gives full control over fields
- UUID primary key — consistent with project standards, no sequential ID exposure
- Email as USERNAME_FIELD, REQUIRED_FIELDS = [] — email-only auth
- Add token_blacklist to INSTALLED_APPS now — needed for logout endpoint (SIM-26)

## Context

- **Visuals:** None
- **References:** core/settings/base.py (INSTALLED_APPS, simplejwt config already present)
- **Product alignment:** Users register/login with email only — no username

## Standards Applied

- django-best-practices — UUID PK, __str__, full_clean pattern
- django-architecture — app-per-feature, services/selectors (model-only ticket, no service needed)
