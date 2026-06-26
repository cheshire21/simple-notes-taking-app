from typing import ClassVar

from rest_framework import serializers

from categories.models import Category
from notes.models import Note


class NoteCategorySerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Category
        fields: ClassVar = ["id", "name", "color"]


class NoteInputSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    content = serializers.CharField(default="", allow_blank=True)
    category_id = serializers.UUIDField()


class NoteOutputSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    category = NoteCategorySerializer(read_only=True)

    class Meta:
        model = Note
        fields: ClassVar = ["id", "title", "content", "category", "created_at", "updated_at"]
