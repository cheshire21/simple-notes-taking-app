from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase

from users.tests.factories import UserFactory

fake = Faker()


class UserRegisterViewTests(APITestCase):
    def setUp(self):
        self.url = "/api/auth/register/"

    # Happy path
    def test_valid_registration_returns_201_with_tokens(self):
        response = self.client.post(
            self.url,
            {"email": fake.email(), "password": fake.password(length=10)},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    # Validation — missing fields
    def test_missing_email_returns_400(self):
        response = self.client.post(self.url, {"password": fake.password(length=10)})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_missing_password_returns_400(self):
        response = self.client.post(self.url, {"email": fake.email()})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_invalid_email_format_returns_400(self):
        response = self.client.post(
            self.url,
            {"email": "not-an-email", "password": fake.password(length=10)},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Validation — duplicate email
    def test_duplicate_email_returns_400(self):
        email = fake.email()
        UserFactory(email=email)

        response = self.client.post(
            self.url,
            {"email": email, "password": fake.password(length=10)},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    # Response shape — password must never appear in response
    def test_password_not_in_response(self):
        response = self.client.post(
            self.url,
            {"email": fake.email(), "password": fake.password(length=10)},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("password", response.data)
