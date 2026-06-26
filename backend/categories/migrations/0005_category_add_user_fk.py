# Generated manually — re-adds user FK and unique_together after global-category experiment
import uuid
from typing import ClassVar

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies: ClassVar = [
        ("categories", "0004_alter_category_unique_together_alter_category_name_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations: ClassVar = [
        migrations.AlterField(
            model_name="category",
            name="name",
            field=models.CharField(max_length=100),
        ),
        migrations.AddField(
            model_name="category",
            name="user",
            field=models.ForeignKey(
                default=uuid.UUID("00000000-0000-0000-0000-000000000000"),
                on_delete=django.db.models.deletion.CASCADE,
                related_name="categories",
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name="category",
            unique_together={("user", "name")},
        ),
    ]
