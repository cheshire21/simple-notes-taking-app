import factory

from users.models import User


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker("email")
    password = factory.PostGenerationMethodCall("set_password", "testpass123")
    is_active = True
    is_staff = False
