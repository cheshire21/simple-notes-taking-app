import uuid

from faker import Faker
from rest_framework import status
from rest_framework.test import APITestCase

from categories.tests.factories import CategoryFactory
from users.tests.factories import UserFactory

fake = Faker()


class TestCategoryListCreateViewGet(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = "/api/categories/"

    def test_unauthenticated_returns_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_returns_only_own_categories(self):
        CategoryFactory(user=self.user, name="Mine")
        CategoryFactory(name="Others")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Mine")

    def test_returns_empty_list_when_no_categories(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])


class TestCategoryListCreateViewPost(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = "/api/categories/"

    def test_unauthenticated_returns_401(self):
        response = self.client.post(self.url, {"name": fake.word()})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missing_name_returns_400(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_creates_category_and_returns_201(self):
        self.client.force_authenticate(user=self.user)
        name = fake.word()
        response = self.client.post(self.url, {"name": name})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], name)
        self.assertIn("id", response.data)
        self.assertIn("color", response.data)
        self.assertIn("created_at", response.data)

    def test_duplicate_name_same_user_returns_400(self):
        self.client.force_authenticate(user=self.user)
        name = fake.word()
        self.client.post(self.url, {"name": name})
        response = self.client.post(self.url, {"name": name})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)


class TestCategoryDetailViewDelete(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.url = f"/api/categories/{self.category.id}/"

    def test_returns_204_on_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthenticated_returns_401(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_returns_404_for_another_users_category(self):
        other_user = UserFactory()
        self.client.force_authenticate(user=other_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_returns_404_for_nonexistent_uuid(self):
        self.client.force_authenticate(user=self.user)
        url = f"/api/categories/{uuid.uuid4()}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
