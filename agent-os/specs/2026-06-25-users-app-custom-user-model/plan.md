# Plan: SIM-25 — Users App Setup & Custom User Model

## Context

SIM-25 creates the Django `users` app with a custom User model using UUID as primary key and email as the username field. This is the foundation ticket for all authentication work — every other model in the app will reference `settings.AUTH_USER_MODEL`.

**Linear ticket:** SIM-25 | Parent: SIM-5

---

## Task 1: Save Spec Documentation ✓

---

## Task 2: PM Agent — Move SIM-25 to In Progress ✓

---

## Task 3: django-engineer — Create users app and custom User model

1. `python manage.py startapp users`
2. `users/models.py` — UUID PK, email USERNAME_FIELD, custom UserManager
3. `users/admin.py` — register with UserAdmin
4. `users/apps.py` — AppConfig
5. `core/settings/base.py` — add users + token_blacklist to INSTALLED_APPS, set AUTH_USER_MODEL
6. `python manage.py makemigrations users && python manage.py migrate`
7. `users/tests/test_models.py` — model tests

---

## Task 4: QA Agent — Verify Done Criteria

---

## Task 5: PM Agent — Move SIM-25 to Done
