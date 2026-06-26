from typing import ClassVar

from django.urls import path

from notes.views import NoteListCreateView

urlpatterns: ClassVar = [
    path("api/notes/", NoteListCreateView.as_view(), name="note_list_create"),
]
