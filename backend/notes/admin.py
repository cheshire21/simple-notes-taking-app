from typing import ClassVar

from django.contrib import admin

from notes.models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display: ClassVar = ["title", "user", "category", "created_at", "updated_at"]
    list_filter: ClassVar = ["category", "created_at"]
    search_fields: ClassVar = ["title", "user__email"]
    raw_id_fields: ClassVar = ["user", "category"]
    readonly_fields: ClassVar = ["created_at", "updated_at"]
