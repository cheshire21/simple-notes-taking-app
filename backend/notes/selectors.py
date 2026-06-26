from typing import TYPE_CHECKING

from django.contrib.auth import get_user_model
from django.db.models import QuerySet

from notes.models import Note

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

User = get_user_model()


def note_list(*, user: "AbstractUser", category_id: str | None = None) -> QuerySet[Note]:
    notes = Note.objects.filter(category__user=user).select_related("category")
    if category_id:
        notes = notes.filter(category_id=category_id)
    return notes
