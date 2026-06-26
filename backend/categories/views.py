from typing import ClassVar

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from categories.selectors import category_list
from categories.serializers import CategoryInputSerializer, CategoryOutputSerializer
from categories.services import category_create


class CategoryListCreateView(APIView):
    permission_classes: ClassVar = [IsAuthenticated]

    @extend_schema(responses={200: CategoryOutputSerializer(many=True)})
    def get(self, request):
        categories = category_list(user=request.user)
        return Response(CategoryOutputSerializer(categories, many=True).data)

    @extend_schema(request=CategoryInputSerializer, responses={201: CategoryOutputSerializer})
    def post(self, request):
        serializer = CategoryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = category_create(user=request.user, **serializer.validated_data)
        return Response(CategoryOutputSerializer(category).data, status=status.HTTP_201_CREATED)
