from django.contrib.auth import get_user_model
from django.db.models import QuerySet

from categories.models import Category

User = get_user_model()


def category_list(*, user: User) -> QuerySet[Category]:
    return Category.objects.filter(user=user).order_by("name")
