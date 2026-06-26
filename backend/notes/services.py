from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from categories.models import Category
from notes.models import Note

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

User = get_user_model()


def note_create(*, user: AbstractUser, title: str, content: str = "", category_id: uuid.UUID) -> Note:
    try:
        category = Category.objects.get(id=category_id, user=user)
    except Category.DoesNotExist as exc:
        raise ValidationError({"category_id": ["Category not found or does not belong to you."]}) from exc

    note = Note(category=category, title=title, content=content)
    note.full_clean()
    note.save()
    return note


def note_update(
    *,
    note: Note,
    title: str | None = None,
    content: str | None = None,
    category_id: uuid.UUID | None = None,
) -> Note:
    update_fields = ["updated_at"]

    if title is not None:
        note.title = title
        update_fields.append("title")

    if content is not None:
        note.content = content
        update_fields.append("content")

    if category_id is not None:
        try:
            category = Category.objects.get(id=category_id, user=note.category.user)
        except Category.DoesNotExist as exc:
            raise ValidationError({"category_id": ["Category not found or does not belong to you."]}) from exc
        note.category = category
        update_fields.append("category")

    note.full_clean()
    note.save(update_fields=update_fields)
    return note
