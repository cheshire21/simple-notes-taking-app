from typing import ClassVar

from rest_framework import serializers

from users.models import User


class UserRegisterInputSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserOutputSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    email = serializers.EmailField(read_only=True)

    class Meta:
        model = User
        fields: ClassVar = ["id", "email"]
