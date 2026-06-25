import uuid

from django.db import IntegrityError
from django.test import TestCase

from users.tests.factories import UserFactory


class UserModelTest(TestCase):
    def test_create_user_with_email(self):
        user = UserFactory()

        self.assertIsInstance(user.pk, uuid.UUID)
        self.assertIn("@", user.email)

    def test_str_returns_email(self):
        user = UserFactory()

        self.assertEqual(str(user), user.email)

    def test_duplicate_email_raises_error(self):
        user = UserFactory()

        with self.assertRaises(IntegrityError):
            UserFactory(email=user.email)
