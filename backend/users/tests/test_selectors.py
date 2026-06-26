import uuid

from django.http import Http404
from django.test import TestCase

from users.selectors import user_get, user_get_by_email
from users.tests.factories import UserFactory


class TestUserGet(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_returns_user_by_id(self):
        result = user_get(id=str(self.user.id))
        self.assertEqual(result.id, self.user.id)
        self.assertEqual(result.email, self.user.email)

    def test_raises_404_for_nonexistent_id(self):
        with self.assertRaises(Http404):
            user_get(id=str(uuid.uuid4()))


class TestUserGetByEmail(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_returns_user_by_email(self):
        result = user_get_by_email(email=self.user.email)
        self.assertEqual(result.id, self.user.id)

    def test_raises_404_for_nonexistent_email(self):
        with self.assertRaises(Http404):
            user_get_by_email(email="nobody@example.com")
