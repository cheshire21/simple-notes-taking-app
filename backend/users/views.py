from typing import ClassVar

from django.core.exceptions import ValidationError as DjangoValidationError
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import UserRegisterInputSerializer
from users.services import user_register


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
