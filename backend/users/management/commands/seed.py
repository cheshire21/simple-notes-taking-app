from django.core.management.base import BaseCommand

from categories.models import Category
from users.models import User

SEED_USER_EMAIL = "corenancco@gmail.com"
SEED_USER_PASSWORD = "Coren2197"

SEED_CATEGORIES = [
    {"name": "Random Thoughts", "color": "#E8735A"},
    {"name": "School", "color": "#F0C05A"},
    {"name": "Personal", "color": "#5AACB8"},
]


class Command(BaseCommand):
    help = "Seed dev data: creates seed user and default categories"

    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(email=SEED_USER_EMAIL)
        if created:
            user.set_password(SEED_USER_PASSWORD)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user {SEED_USER_EMAIL}"))
        else:
            self.stdout.write(f"User {SEED_USER_EMAIL} already exists")

        for data in SEED_CATEGORIES:
            _, cat_created = Category.objects.get_or_create(
                user=user,
                name=data["name"],
                defaults={"color": data["color"]},
            )
            status = "Created" if cat_created else "Already exists"
            self.stdout.write(f"  {status}: {data['name']}")

        self.stdout.write(self.style.SUCCESS("Seed complete."))
