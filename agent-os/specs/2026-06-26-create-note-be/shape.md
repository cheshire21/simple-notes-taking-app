# Create Note — Shaping Notes

## Scope
POST /api/notes/ endpoint. No list/get yet.

## Decisions
- category_id is required (model changed — no nullable category)
- User ownership validated in service: Category.objects.get(id=category_id, user=user)
- 400 if category not found or belongs to another user
- Follows categories service/selector/view pattern exactly
