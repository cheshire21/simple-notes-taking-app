import factory

from categories.tests.factories import CategoryFactory
from notes.models import Note


class NoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Note

    category = factory.SubFactory(CategoryFactory)
    title = factory.Faker("sentence", nb_words=4)
    content = factory.Faker("paragraph")
