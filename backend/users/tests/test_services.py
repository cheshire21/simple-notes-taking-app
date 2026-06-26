from django.core.exceptions import ValidationError
from django.test import TestCase
from faker import Faker

from users.models import User
from users.services import user_logout, user_register
from users.tests.factories import UserFactory

fake = Faker()


class UserRegisterServiceTests(TestCase):
    def test_creates_user_and_returns_instance(self):
        email = fake.email()
        user = user_register(email=email, password=fake.password(length=10))

        self.assertIsInstance(user, User)
        self.assertEqual(user.email, email)
        self.assertTrue(User.objects.filter(email=email).exists())

    def test_password_is_hashed(self):
        password = fake.password(length=10)
        user = user_register(email=fake.email(), password=password)

        self.assertNotEqual(user.password, password)
        self.assertTrue(user.check_password(password))

    def test_duplicate_email_raises_validation_error(self):
        email = fake.email()
        UserFactory(email=email)

        with self.assertRaises(ValidationError):
            user_register(email=email, password=fake.password(length=10))

    def test_invalid_email_format_raises_validation_error(self):
        with self.assertRaises(ValidationError):
            user_register(email="not-an-email", password=fake.password(length=10))


class TestUserLogout(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def _get_refresh_token(self):
        from rest_framework_simplejwt.tokens import RefreshToken

        return str(RefreshToken.for_user(self.user))

    def test_valid_token_is_blacklisted(self):
        from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

        refresh_token = self._get_refresh_token()
        user_logout(refresh_token=refresh_token)
        self.assertEqual(BlacklistedToken.objects.count(), 1)

    def test_invalid_token_raises_token_error(self):
        from rest_framework_simplejwt.exceptions import TokenError

        with self.assertRaises(TokenError):
            user_logout(refresh_token="not-valid")

    def test_already_blacklisted_raises_token_error(self):
        from rest_framework_simplejwt.exceptions import TokenError

        refresh_token = self._get_refresh_token()
        user_logout(refresh_token=refresh_token)
        with self.assertRaises(TokenError):
            user_logout(refresh_token=refresh_token)
