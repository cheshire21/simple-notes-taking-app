# Standards

## backend/models
- UUID primary key (uuid.uuid4, editable=False)
- ForeignKey to settings.AUTH_USER_MODEL
- ClassVar annotation on Meta lists
- from typing import ClassVar in migration files
