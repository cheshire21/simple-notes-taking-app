from typing import ClassVar

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from users.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering: ClassVar = ["email"]
    list_display: ClassVar = ["email", "is_active", "is_staff", "created_at"]
    list_filter: ClassVar = ["is_active", "is_staff"]
    search_fields: ClassVar = ["email"]
    readonly_fields: ClassVar = ["created_at"]

    fieldsets: ClassVar = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("created_at",)}),
    )

    add_fieldsets: ClassVar = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
