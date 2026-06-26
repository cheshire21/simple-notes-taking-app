from typing import ClassVar

from django.core.exceptions import ValidationError as DjangoValidationError
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notes.selectors import note_get, note_list
from notes.serializers import NoteInputSerializer, NoteOutputSerializer
from notes.services import note_create


class NoteListCreateView(APIView):
    permission_classes: ClassVar = [IsAuthenticated]

    @extend_schema(responses={200: NoteOutputSerializer(many=True)})
    def get(self, request):
        category_id = request.query_params.get("category")
        notes = note_list(user=request.user, category_id=category_id)
        return Response(NoteOutputSerializer(notes, many=True).data)

    @extend_schema(request=NoteInputSerializer, responses={201: NoteOutputSerializer})
    def post(self, request):
        serializer = NoteInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            note = note_create(user=request.user, **serializer.validated_data)
        except DjangoValidationError as exc:
            raise DRFValidationError(exc.message_dict) from exc
        return Response(NoteOutputSerializer(note).data, status=status.HTTP_201_CREATED)


class NoteDetailView(APIView):
    permission_classes: ClassVar = [IsAuthenticated]

    @extend_schema(responses={200: NoteOutputSerializer})
    def get(self, request, pk):
        note = note_get(id=pk, user=request.user)
        return Response(NoteOutputSerializer(note).data)
