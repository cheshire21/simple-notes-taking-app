# Standards

## backend/services
- Keyword-only args, full_clean() before save
- DjangoValidationError raised from service, caught in view → DRFValidationError

## backend/views
- Thin APIView — no ORM, no business logic in view
- extend_schema decorators
