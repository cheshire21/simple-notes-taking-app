from django.contrib.auth import get_user_model

from categories.models import Category
from categories.selectors import category_get

User = get_user_model()


def category_create(*, user: User, name: str, color: str = "#94a3b8") -> Category:
    category = Category(user=user, name=name, color=color)
    category.full_clean()
    category.save()
    return category


def category_delete(*, category_id: str, user) -> None:
    category = category_get(id=category_id, user=user)
    category.delete()
