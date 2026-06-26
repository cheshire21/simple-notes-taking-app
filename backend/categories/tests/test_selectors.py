import uuid

from django.http import Http404
from django.test import TestCase

from categories.selectors import category_get, category_list
from categories.tests.factories import CategoryFactory
from users.tests.factories import UserFactory


class TestCategoryList(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_returns_only_own_categories(self):
        CategoryFactory(user=self.user, name="Mine")
        CategoryFactory(name="Others")
        result = list(category_list(user=self.user))
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].name, "Mine")

    def test_excludes_other_users_categories(self):
        other_user = UserFactory()
        CategoryFactory(user=other_user, name="Not Mine")
        result = list(category_list(user=self.user))
        self.assertEqual(len(result), 0)

    def test_ordered_by_name(self):
        CategoryFactory(user=self.user, name="Zebra")
        CategoryFactory(user=self.user, name="Alpha")
        result = list(category_list(user=self.user))
        self.assertEqual(result[0].name, "Alpha")
        self.assertEqual(result[1].name, "Zebra")

    def test_returns_empty_queryset_when_no_categories(self):
        result = list(category_list(user=self.user))
        self.assertEqual(len(result), 0)


class TestCategoryGet(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_returns_own_category(self):
        category = CategoryFactory(user=self.user)
        result = category_get(id=str(category.id), user=self.user)
        self.assertEqual(result.id, category.id)
        self.assertEqual(result.name, category.name)

    def test_raises_404_for_nonexistent_id(self):
        with self.assertRaises(Http404):
            category_get(id=str(uuid.uuid4()), user=self.user)

    def test_raises_404_for_other_users_category(self):
        other_user = UserFactory()
        category = CategoryFactory(user=other_user)
        with self.assertRaises(Http404):
            category_get(id=str(category.id), user=self.user)
