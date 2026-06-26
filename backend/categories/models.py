import uuid
from typing import ClassVar

from django.db import models


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default="#94a3b8")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering: ClassVar = ["name"]

    def __str__(self) -> str:
        return self.name
