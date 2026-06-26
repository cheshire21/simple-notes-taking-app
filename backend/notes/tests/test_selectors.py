from django.test import TestCase

from categories.tests.factories import CategoryFactory
from notes.selectors import note_list
from notes.tests.factories import NoteFactory
from users.tests.factories import UserFactory


class TestNoteList(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)

    def test_returns_only_own_notes(self):
        NoteFactory(category=self.category)
        NoteFactory()
        result = list(note_list(user=self.user))
        self.assertEqual(len(result), 1)

    def test_returns_empty_queryset_when_no_notes(self):
        result = list(note_list(user=self.user))
        self.assertEqual(len(result), 0)

    def test_filters_by_category_id(self):
        other_category = CategoryFactory(user=self.user)
        note = NoteFactory(category=self.category)
        NoteFactory(category=other_category)
        result = list(note_list(user=self.user, category_id=str(self.category.id)))
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].id, note.id)

    def test_excludes_other_users_notes(self):
        NoteFactory()
        result = list(note_list(user=self.user))
        self.assertEqual(len(result), 0)
