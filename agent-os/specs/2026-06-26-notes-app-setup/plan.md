# SIM-47 — Notes App Setup & Model

Setup ticket: model, admin, INSTALLED_APPS, URL placeholder, migration.

## Model fields
- id: UUID pk
- user: FK → AUTH_USER_MODEL (CASCADE)
- category: FK → categories.Category (SET_NULL, nullable)
- title: CharField(255)
- content: TextField(blank=True)
- created_at: auto_now_add
- updated_at: auto_now
- Meta.ordering: ["-updated_at"]
