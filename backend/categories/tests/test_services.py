from django.core.exceptions import ValidationError
from django.test import TestCase
from faker import Faker

from categories.models import Category
from categories.services import category_create
from users.tests.factories import UserFactory

fake = Faker()


class TestCategoryCreate(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_creates_category_and_returns_instance(self):
        name = fake.word()
        category = category_create(user=self.user, name=name)

        self.assertIsInstance(category, Category)
        self.assertEqual(category.name, name)
        self.assertEqual(category.user, self.user)
        self.assertTrue(Category.objects.filter(id=category.id).exists())

    def test_duplicate_name_same_user_raises(self):
        name = fake.word()
        category_create(user=self.user, name=name)

        with self.assertRaises(ValidationError):
            category_create(user=self.user, name=name)

    def test_duplicate_name_different_user_succeeds(self):
        other_user = UserFactory()
        name = fake.word()
        category_create(user=self.user, name=name)
        category = category_create(user=other_user, name=name)

        self.assertEqual(category.name, name)

    def test_empty_name_raises(self):
        with self.assertRaises(ValidationError):
            category_create(user=self.user, name="")
