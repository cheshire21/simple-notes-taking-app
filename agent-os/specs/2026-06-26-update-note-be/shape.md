# Update Note BE — Shaping Notes

## Scope

PATCH endpoint for partial note update. Owner can update title, content, or category independently. Ownership already enforced by `note_get` before the service is called.

## Decisions

- All `NoteUpdateInputSerializer` fields are `required=False` — only send what changed
- `updated_at` always included in `update_fields` so `auto_now` fires on selective save
- Category ownership validated against `note.category.user` (not `request.user` directly — same thing but makes intent clear)
- `full_clean()` called before `save()` to enforce model constraints

## Context

- **Visuals:** None
- **References:** `note_create` service pattern, `NoteDetailView.get` view pattern
- **Product alignment:** N/A
