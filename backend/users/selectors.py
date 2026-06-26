from __future__ import annotations

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

User = get_user_model()


def user_get(*, id: str) -> User:
    return get_object_or_404(User, id=id)


def user_get_by_email(*, email: str) -> User:
    return get_object_or_404(User, email=email)
