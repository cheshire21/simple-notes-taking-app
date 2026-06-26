from typing import ClassVar

from django.contrib import admin

from notes.models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display: ClassVar = ["title", "category", "created_at", "updated_at"]
    list_filter: ClassVar = ["category", "created_at"]
    search_fields: ClassVar = ["title", "category__name"]
    raw_id_fields: ClassVar = ["category"]
    readonly_fields: ClassVar = ["created_at", "updated_at"]
