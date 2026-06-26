from typing import ClassVar

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from categories.serializers import CategoryInputSerializer, CategoryOutputSerializer
from categories.services import category_create


class CategoryListCreateView(APIView):
    permission_classes: ClassVar = [IsAuthenticated]

    @extend_schema(request=CategoryInputSerializer, responses={201: CategoryOutputSerializer})
    def post(self, request):
        serializer = CategoryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = category_create(**serializer.validated_data)
        return Response(CategoryOutputSerializer(category).data, status=status.HTTP_201_CREATED)
