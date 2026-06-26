# SIM-48 — Create Note Functionality

POST /api/notes/ — creates a note for the authenticated user.

## Key constraint
Note has no user FK — ownership via category.user. category_id is required.

## Service
note_create(*, user, title, content, category_id) — validates category belongs to user, full_clean, save.

## Serializers
NoteInputSerializer: title (required), content (required), category_id (required UUID)
NoteOutputSerializer: id, title, content, category {id,name,color}, created_at, updated_at
