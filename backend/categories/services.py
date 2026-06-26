from categories.models import Category
from users.models import User


def category_create(*, user: User, name: str, color: str = "#94a3b8") -> Category:
    category = Category(user=user, name=name, color=color)
    category.full_clean()
    category.save()
    return category
