# Standards

## backend/services-selectors

- Selector in `selectors.py`, named `category_list` (noun_verb)
- Returns QuerySet, no ORM queries in view

## backend/serializers-views

- Thin view: call selector → serialize → respond
- `@extend_schema` with `many=True` response
