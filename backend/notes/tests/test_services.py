import uuid

from django.core.exceptions import ValidationError
from django.test import TestCase
from faker import Faker

from categories.tests.factories import CategoryFactory
from notes.services import note_create
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
