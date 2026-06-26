from django.test import TestCase

from categories.selectors import category_list
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
