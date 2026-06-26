# References for Categories App Setup

## users/models.py

- **Location:** `backend/users/models.py`
- **Relevance:** UUID pk pattern, `created_at` auto_now_add, `__str__` convention

## core/settings/base.py

- **Location:** `backend/core/settings/base.py`
- **Relevance:** INSTALLED_APPS — add `"categories"` after `"users"`

## core/urls.py

- **Location:** `backend/core/urls.py`
- **Relevance:** `path("", include("users.urls"))` pattern to replicate for categories

## users/tests/factories.py

- **Location:** `backend/users/tests/factories.py`
- **Relevance:** DjangoModelFactory + Faker pattern — use for CategoryFactory in SIM-38
