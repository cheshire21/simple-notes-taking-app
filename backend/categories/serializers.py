from typing import ClassVar

from rest_framework import serializers

from categories.models import Category


class CategoryInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    color = serializers.CharField(max_length=7, required=False, default="#94a3b8")


class CategoryOutputSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Category
        fields: ClassVar = ["id", "name", "color", "created_at"]
