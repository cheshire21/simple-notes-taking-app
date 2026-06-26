from typing import ClassVar

from django.contrib import admin

from categories.models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display: ClassVar = ["name", "user", "color", "created_at"]
    list_filter: ClassVar = ["created_at"]
    search_fields: ClassVar = ["name", "user__email"]
    raw_id_fields: ClassVar = ["user"]
    readonly_fields: ClassVar = ["created_at"]
