# List Categories — Shaping Notes

## Scope

GET endpoint returns all categories. Ticket says "user-scoped" but Category has no user FK (removed) — returns global list.

## Decisions

- `category_list()` takes no args — no user filter possible
- Reuses `CategoryOutputSerializer(many=True)` — no new serializer needed
- Authentication still required (IsAuthenticated)
- No pagination for now — categories list is small
