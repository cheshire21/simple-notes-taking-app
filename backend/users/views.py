from typing import ClassVar

from django.core.exceptions import ValidationError as DjangoValidationError
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import LogoutInputSerializer, UserRegisterInputSerializer
from users.services import user_logout, user_register


class UserRegisterView(APIView):
    permission_classes: ClassVar = []

    @extend_schema(
        request=UserRegisterInputSerializer,
        responses={
            201: OpenApiResponse(
                description="JWT tokens",
                response={
                    "type": "object",
                    "properties": {
                        "access": {"type": "string"},
                        "refresh": {"type": "string"},
                    },
                },
            ),
            400: OpenApiResponse(description="Validation error"),
        },
    )
    def post(self, request):
        serializer = UserRegisterInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = user_register(**serializer.validated_data)
        except DjangoValidationError as e:
            return Response(
                e.message_dict if hasattr(e, "message_dict") else {"detail": e.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class UserLogoutView(APIView):
    permission_classes: ClassVar = [IsAuthenticated]

    @extend_schema(request=LogoutInputSerializer, responses={204: None})
    def post(self, request):
        serializer = LogoutInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user_logout(refresh_token=serializer.validated_data["refresh"])
        except TokenError as e:
            raise ValidationError({"refresh": str(e)}) from e
        return Response(status=HTTP_204_NO_CONTENT)
