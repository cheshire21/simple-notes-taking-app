from categories.models import Category


def category_create(*, name: str, color: str = "#94a3b8") -> Category:
    category = Category(name=name, color=color)
    category.full_clean()
    category.save()
    return category
