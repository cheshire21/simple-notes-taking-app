from django.core.exceptions import ValidationError
from django.test import TestCase
from faker import Faker

from categories.models import Category
from categories.services import category_create

fake = Faker()


class TestCategoryCreate(TestCase):
    def test_creates_category_and_returns_instance(self):
        name = fake.word()
        category = category_create(name=name)

        self.assertIsInstance(category, Category)
        self.assertEqual(category.name, name)
        self.assertTrue(Category.objects.filter(id=category.id).exists())

    def test_duplicate_name_raises(self):
        name = fake.word()
        category_create(name=name)

        with self.assertRaises(ValidationError):
            category_create(name=name)

    def test_empty_name_raises(self):
        with self.assertRaises(ValidationError):
            category_create(name="")
