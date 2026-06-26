from typing import ClassVar

from django.urls import path

from notes.views import NoteDetailView, NoteListCreateView

urlpatterns: ClassVar = [
    path("api/notes/", NoteListCreateView.as_view(), name="note_list_create"),
    path("api/notes/<uuid:pk>/", NoteDetailView.as_view(), name="note_detail"),
]
