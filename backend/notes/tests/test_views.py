from faker import Faker
from rest_framework.test import APITestCase

from categories.tests.factories import CategoryFactory
from notes.tests.factories import NoteFactory
from users.tests.factories import UserFactory

fake = Faker()


class TestNoteListCreateViewGet(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.url = "/api/notes/"

    def test_unauthenticated_returns_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_returns_only_own_notes(self):
        NoteFactory(category=self.category)
        NoteFactory()
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_returns_empty_list_when_no_notes(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_filters_by_category_id(self):
        other_category = CategoryFactory(user=self.user)
        NoteFactory(category=self.category)
        NoteFactory(category=other_category)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"category": str(self.category.id)})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)


class TestNoteListCreateViewPost(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.url = "/api/notes/"

    def test_unauthenticated_returns_401(self):
        response = self.client.post(self.url, {"title": fake.sentence(), "category_id": str(self.category.id)})
        self.assertEqual(response.status_code, 401)

    def test_creates_note_returns_201(self):
        self.client.force_authenticate(user=self.user)
        title = fake.sentence(nb_words=4)
        content = fake.paragraph()
        response = self.client.post(
            self.url,
            {"title": title, "content": content, "category_id": str(self.category.id)},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], title)
        self.assertEqual(response.data["category"]["id"], str(self.category.id))

    def test_missing_title_returns_400(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"category_id": str(self.category.id)})
        self.assertEqual(response.status_code, 400)

    def test_missing_category_id_returns_400(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {"title": fake.sentence()})
        self.assertEqual(response.status_code, 400)

    def test_another_users_category_returns_400(self):
        self.client.force_authenticate(user=self.user)
        other_category = CategoryFactory()
        response = self.client.post(
            self.url,
            {"title": fake.sentence(), "category_id": str(other_category.id)},
        )
        self.assertEqual(response.status_code, 400)


class TestNoteDetailViewGet(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.note = NoteFactory(category=self.category)
        self.url = f"/api/notes/{self.note.id}/"

    def test_unauthenticated_returns_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_returns_own_note(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], str(self.note.id))
        self.assertEqual(response.data["title"], self.note.title)

    def test_returns_404_for_other_users_note(self):
        other_note = NoteFactory()
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/notes/{other_note.id}/")
        self.assertEqual(response.status_code, 404)


class TestNoteDetailViewPatch(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.note = NoteFactory(category=self.category)
        self.url = f"/api/notes/{self.note.id}/"

    def test_unauthenticated_returns_401(self):
        response = self.client.patch(self.url, {"title": "New Title"}, format="json")
        self.assertEqual(response.status_code, 401)

    def test_updates_note_returns_200(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.url, {"title": "Updated Title"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Updated Title")

    def test_returns_404_for_other_users_note(self):
        other_note = NoteFactory()
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/notes/{other_note.id}/", {"title": "X"}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_returns_400_for_invalid_category(self):
        other_category = CategoryFactory()
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.url, {"category_id": str(other_category.id)}, format="json")
        self.assertEqual(response.status_code, 400)


class TestNoteDetailViewDelete(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.category = CategoryFactory(user=self.user)
        self.note = NoteFactory(category=self.category)
        self.url = f"/api/notes/{self.note.id}/"

    def test_unauthenticated_returns_401(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 401)

    def test_returns_204_on_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)

    def test_returns_404_for_other_users_note(self):
        other_note = NoteFactory()
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"/api/notes/{other_note.id}/")
        self.assertEqual(response.status_code, 404)

    def test_returns_404_for_nonexistent_note(self):
        import uuid

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"/api/notes/{uuid.uuid4()}/")
        self.assertEqual(response.status_code, 404)
