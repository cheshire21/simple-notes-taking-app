from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404

from categories.models import Category

User = get_user_model()


def category_list(*, user: User) -> QuerySet[Category]:
    return Category.objects.filter(user=user).order_by("name")


def category_get(*, id: str, user: User) -> Category:
    return get_object_or_404(Category, id=id, user=user)
