import uuid
from typing import ClassVar

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies: ClassVar = [
        ("categories", "0005_category_add_user_fk"),
    ]

    operations: ClassVar = [
        migrations.CreateModel(
            name="Note",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="notes",
                        to="categories.category",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("content", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-updated_at"],
            },
        ),
    ]
