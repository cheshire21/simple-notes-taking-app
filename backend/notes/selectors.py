from typing import TYPE_CHECKING

from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from django.http import Http404
from django.shortcuts import get_object_or_404

from notes.models import Note

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

User = get_user_model()


def note_list(*, user: "AbstractUser", category_id: str | None = None) -> QuerySet[Note]:
    notes = Note.objects.filter(category__user=user).select_related("category")
    if category_id:
        notes = notes.filter(category_id=category_id)
    return notes


def note_get(*, id: str, user: "AbstractUser") -> Note:
    note = get_object_or_404(Note.objects.select_related("category"), id=id)
    if note.category.user != user:
        raise Http404
    return note
