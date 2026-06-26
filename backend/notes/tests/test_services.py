import uuid

from django.core.exceptions import ValidationError
from django.test import TestCase
from faker import Faker

from categories.tests.factories import CategoryFactory
from notes.services import note_create, note_delete, note_update
from notes.tests.factories import NoteFactory
from users.tests.factories import UserFactory

fake = Faker()


class TestNoteCreate(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)

    def test_creates_note_successfully(self):
        title = fake.sentence(nb_words=4)
        content = fake.paragraph()
        note = note_create(user=self.user, title=title, content=content, category_id=self.category.id)
        self.assertEqual(note.title, title)
        self.assertEqual(note.category, self.category)
        self.assertEqual(note.content, content)

    def test_raises_if_category_belongs_to_another_user(self):
        other_category = CategoryFactory()
        with self.assertRaises(ValidationError):
            note_create(user=self.user, title=fake.sentence(), category_id=other_category.id)

    def test_raises_on_blank_title(self):
        with self.assertRaises(ValidationError):
            note_create(user=self.user, title="", category_id=self.category.id)

    def test_raises_on_nonexistent_category_id(self):
        with self.assertRaises(ValidationError):
            note_create(user=self.user, title=fake.sentence(), category_id=uuid.uuid4())


class TestNoteUpdate(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.note = NoteFactory(category=self.category)

    def test_updates_title(self):
        updated = note_update(note=self.note, title="New Title")
        self.assertEqual(updated.title, "New Title")
        self.note.refresh_from_db()
        self.assertEqual(self.note.title, "New Title")

    def test_updates_content(self):
        updated = note_update(note=self.note, content="New content")
        self.assertEqual(updated.content, "New content")

    def test_updates_category(self):
        new_category = CategoryFactory(user=self.user)
        updated = note_update(note=self.note, category_id=new_category.id)
        self.assertEqual(updated.category, new_category)

    def test_raises_400_for_other_users_category(self):
        other_category = CategoryFactory()
        with self.assertRaises(ValidationError):
            note_update(note=self.note, category_id=other_category.id)


class TestNoteDelete(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.note = NoteFactory(category=self.category)

    def test_deletes_note_from_db(self):
        from notes.models import Note

        note_id = self.note.id
        note_delete(note=self.note)
        self.assertFalse(Note.objects.filter(id=note_id).exists())
