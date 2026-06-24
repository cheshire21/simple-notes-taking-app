# Django Best Practices

Complements `django-architecture.md` (folder structure + layer rules) and `drf-best-practices.md` (DRF/API layer).
Focus: how to write correct, secure, and maintainable Django code.

---

## Models

### Always Define `__str__`
Every model needs `__str__` — it's used in the admin, shell, logs, and error messages.

```python
class Note(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title
```

### ForeignKey Rules
- Always set `related_name` — explicit is better than Django's default `<model>_set`
- Always set `on_delete` explicitly — never leave it to chance
- Reference the user model via `settings.AUTH_USER_MODEL`, never `auth.User` directly

```python
class Note(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    category = models.ForeignKey(
        "notes.Category",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notes",
    )
```

### Indexes
- Add `db_index=True` on fields you filter or order by frequently
- Add `unique=True` where the DB should enforce uniqueness (not just validators)
- Use `Meta.indexes` for composite indexes

```python
class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "-created_at"]),  # most common query pattern
        ]
        ordering = ["-created_at"]  # default ordering — avoids forgetting it in selectors
```

### Field Choices
- Define choices as a class-level constant or `TextChoices` enum — never inline strings
- Use `TextChoices` for string fields (self-documenting, IDE-friendly)

```python
class Note(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
```

### Validators vs Constraints
- `clean()` / `validators` — Python-level validation, run via `full_clean()` in services
- `Meta.constraints` — DB-level enforcement, always in sync even with raw SQL or migrations

```python
class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "title"], name="unique_note_title_per_user"),
        ]

    def clean(self):
        if not self.title.strip():
            raise ValidationError({"title": "Title cannot be blank."})
```

### Properties vs Methods
- `@property` for cheap, computed values with no side effects
- Regular method for anything that takes arguments or has a cost

```python
class Note(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_recent(self):
        return (timezone.now() - self.created_at).days < 7
```

### What Belongs in a Model (and What Doesn't)
| Belongs | Does Not Belong |
|---------|----------------|
| Fields and constraints | Business logic |
| `clean()` validators | Calls to other services |
| Simple `@property` | ORM queries beyond `self` |
| `__str__` | `request` or `context` access |

---

## QuerySets

### Avoid N+1 Queries
- `select_related()` — follow ForeignKey / OneToOne in a single JOIN
- `prefetch_related()` — follow ManyToMany or reverse ForeignKey in a separate query

```python
# bad — N+1: one query per note to get category
notes = Note.objects.filter(user=user)
for note in notes:
    print(note.category.name)  # hits DB every iteration

# good — one query total
notes = Note.objects.filter(user=user).select_related("category")
```

### Fetch Only What You Need
- `only(*fields)` — fetch specific fields, defer the rest
- `defer(*fields)` — fetch all except the listed fields
- `values(*fields)` — return dicts instead of model instances (no ORM overhead)
- `values_list(*fields, flat=True)` — return flat list of a single field

```python
# only fetch what the serializer actually uses
Note.objects.filter(user=user).only("id", "title", "created_at")

# get a flat list of IDs
Note.objects.filter(user=user).values_list("id", flat=True)
```

### Prefer get_or_create Over Manual Check-Then-Save
```python
# bad — race condition between check and create
if not Category.objects.filter(user=user, name=name).exists():
    Category.objects.create(user=user, name=name)

# good — atomic
category, created = Category.objects.get_or_create(user=user, name=name)
```

### Bulk Operations for Batch Writes
```python
# bad — one INSERT per note
for title in titles:
    Note.objects.create(user=user, title=title)

# good — single INSERT
Note.objects.bulk_create([Note(user=user, title=t) for t in titles])

# good — single UPDATE
Note.objects.filter(user=user).bulk_update(notes_to_update, fields=["title"])
```

### Use update_fields on save()
Only update the columns you changed — avoids race conditions and unnecessary writes:

```python
note.title = new_title
note.save(update_fields=["title"])
```

### Annotations and Aggregations
Compute in the DB, not Python:

```python
from django.db.models import Count, Q

# count notes per category in one query
categories = Category.objects.filter(user=user).annotate(
    note_count=Count("notes"),
    published_count=Count("notes", filter=Q(notes__status="published")),
)
```

---

## Migrations

- **Always review generated migration files** before running `migrate` — auto-detector isn't perfect
- **Never hand-edit** generated migrations unless you know exactly what you're doing; use `RunPython` or `RunSQL` instead
- **Data migrations** for transforming existing data — never do it in `post_migrate` signals or `manage.py` commands

```python
# migrations/0005_backfill_note_status.py
from django.db import migrations

def set_default_status(apps, schema_editor):
    Note = apps.get_model("notes", "Note")
    Note.objects.filter(status="").update(status="draft")

def reverse_status(apps, schema_editor):
    pass  # irreversible — acceptable, document it

class Migration(migrations.Migration):
    dependencies = [("notes", "0004_note_status")]

    operations = [
        migrations.RunPython(set_default_status, reverse_status),
    ]
```

- **Zero-downtime migrations**: add nullable columns before making them required; drop columns in a separate release after code no longer references them
- Keep migrations small and focused — one conceptual change per migration

---

## Settings

### Split by Environment
```
core/settings/
├── base.py      # shared across all environments
├── dev.py       # DEBUG=True, local DB, relaxed CORS
└── prod.py      # DEBUG=False, strict security, real DB
```

### Environment Variables with python-decouple
```python
# core/settings/base.py
from decouple import config, Csv

SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=Csv())

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST", default="localhost"),
        "PORT": config("DB_PORT", default="5432"),
    }
}
```

### Security Settings for Production
```python
# core/settings/prod.py
DEBUG = False
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## Security

- **Never hardcode secrets** — `SECRET_KEY`, DB passwords, API keys must come from environment
- **`ALLOWED_HOSTS`** must be set in production — `*` is never acceptable in prod
- **Use Django's auth system** — never roll custom password hashing or session logic
- **CSRF** — enabled by default; only disable for API endpoints that use token auth (DRF handles this with `SessionAuthentication`)
- **SQL injection** — use ORM methods; if you must write raw SQL, use parameterized queries — never string-format user input into a query

```python
# bad — SQL injection vulnerability
Note.objects.raw(f"SELECT * FROM notes_note WHERE title = '{user_input}'")

# good — parameterized
Note.objects.raw("SELECT * FROM notes_note WHERE title = %s", [user_input])
```

---

## Transactions

Wrap multiple writes that must succeed or fail together in `transaction.atomic()`:

```python
from django.db import transaction

# as a context manager
with transaction.atomic():
    note = note_create(user=user, title=title)
    audit_log_create(user=user, action="note_created", object_id=note.id)

# as a decorator on a service function
@transaction.atomic
def note_create_with_audit(*, user, title):
    note = note_create(user=user, title=title)
    audit_log_create(user=user, action="note_created", object_id=note.id)
    return note
```

### select_for_update
Lock rows you're about to update in a transaction to prevent race conditions:

```python
with transaction.atomic():
    note = Note.objects.select_for_update().get(id=note_id, user=user)
    note.title = new_title
    note.save(update_fields=["title"])
```

---

## Signals

Signals couple apps implicitly and make code hard to trace. Use them sparingly.

| Use signals for | Avoid signals for |
|----------------|-------------------|
| Third-party app hooks you can't change | Business logic between your own apps |
| Cross-cutting concerns (audit logging) | Chaining service calls |
| Post-save side effects that truly can't be in the service | Anything testable in a service |

When you do use signals, keep the receiver thin — call a service function, don't put logic in the receiver.

```python
# bad — logic in the receiver
@receiver(post_save, sender=Note)
def on_note_saved(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(user=instance.user, message="Note created")

# good — receiver delegates to a service
@receiver(post_save, sender=Note)
def on_note_saved(sender, instance, created, **kwargs):
    if created:
        notification_create(user=instance.user, note=instance)
```

---

## Admin

Register every model in the admin — it's the fastest internal tool you'll ever have.

```python
# notes/admin.py
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "category", "created_at"]
    list_filter = ["category", "created_at"]
    search_fields = ["title", "user__email"]
    raw_id_fields = ["user", "category"]  # avoids loading full dropdowns on large tables
    readonly_fields = ["created_at", "updated_at"]
```

---

## Testing

### TestCase vs SimpleTestCase
- `TestCase` — wraps each test in a transaction; use for anything that hits the DB
- `SimpleTestCase` — no DB; use for pure logic (validators, utilities, serializer field logic)
- `TransactionTestCase` — needed only when testing DB-level transaction behavior

### Use Factories, Not Fixtures
Fixtures go stale as models change. Use `factory_boy`:

```python
# users/factories.py
import factory
from django.contrib.auth import get_user_model

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    password = factory.PostGenerationMethodCall("set_password", "password")

# notes/factories.py
class NoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Note

    user = factory.SubFactory(UserFactory)
    title = factory.Sequence(lambda n: f"Note {n}")
```

### What to Test at Each Layer
| Layer | Test |
|-------|------|
| **Model** | `clean()` validators, constraints, `__str__`, properties |
| **Service** | Create/update/delete success; raises on invalid input; enforces ownership |
| **Selector** | Returns correct rows; filters work; user scoping is enforced |
| **API (DRF)** | See `drf-best-practices.md` |

### Test the Unhappy Paths
Happy-path tests give you confidence. Unhappy-path tests give you security.

```python
class NoteServiceTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.other_user = UserFactory()

    def test_create_note_success(self):
        note = note_create(user=self.user, title="My Note")
        self.assertEqual(note.title, "My Note")
        self.assertEqual(note.user, self.user)

    def test_create_note_blank_title_raises(self):
        with self.assertRaises(ValidationError):
            note_create(user=self.user, title="")

    def test_delete_note_wrong_user_raises(self):
        note = NoteFactory(user=self.user)
        with self.assertRaises(PermissionError):
            note_delete(note=note, user=self.other_user)
```

---

## Logging

Configure structured logging in production — never rely on `print()`:

```python
# core/settings/prod.py
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {"()": "pythonjsonlogger.jsonlogger.JsonFormatter"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "json"},
    },
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "django": {"handlers": ["console"], "level": "WARNING", "propagate": False},
    },
}
```

Use module-level loggers, not the root logger:

```python
import logging
logger = logging.getLogger(__name__)

def note_create(*, user, title):
    note = Note(user=user, title=title)
    note.full_clean()
    note.save()
    logger.info("Note created", extra={"note_id": note.id, "user_id": user.id})
    return note
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Business logic in `views.py` | Move to services |
| ORM queries in views | Move to selectors |
| Missing `related_name` | Set it on every FK |
| `auth.User` directly | `settings.AUTH_USER_MODEL` |
| Hardcoded secrets | `python-decouple` + env file |
| No `update_fields` on save | `save(update_fields=[...])` |
| N+1 in loops | `select_related` / `prefetch_related` |
| Manual check-then-create | `get_or_create` / `update_or_create` |
| Logic in signal receivers | Delegate to a service function |
| `print()` for debugging | `logging.getLogger(__name__)` |
