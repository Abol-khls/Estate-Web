from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser
)
from rest_framework.exceptions import ValidationError

from django_filters.rest_framework import DjangoFilterBackend

from core.viewsets import AgencyScopedViewSet
from core.permissions import IsAgentOrManager

from .models import Property, PropertyImage, PropertyVideo, PropertyFavorite
from .serializers import (
    PropertySerializer,
    PropertyImageSerializer,
    PropertyVideoSerializer
)
from .filters import PropertyFilter


class PropertyViewSet(AgencyScopedViewSet):

    queryset = Property.objects.all()

    serializer_class = PropertySerializer

    permission_classes = [
        IsAuthenticated,
        IsAgentOrManager
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]

    ordering_fields = [
        "created_at",
        "price",
        "area",
    ]

    ordering = ["-created_at"]

    filterset_class = PropertyFilter

    search_fields = [
        'title',
        'address',
        'description',
        'price',
        'area',
        'created_at',
        'rooms',
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser
    ]

    def get_serializer_context(self):

        context = super().get_serializer_context()

        context["request"] = self.request

        return context

    def get_queryset(self):

        queryset = super().get_queryset()

        is_favorite = self.request.query_params.get("is_favorite")

        if is_favorite in ("true", "True", "1"):

            queryset = queryset.filter(
                favorited_by__user=self.request.user
            )

        return queryset

    @action(detail=True, methods=["post"])
    def toggle_favorite(self, request, pk=None):

        property = self.get_object()

        favorite = PropertyFavorite.objects.filter(
            user=request.user,
            property=property
        ).first()

        if favorite:
            favorite.delete()
            is_favorite = False
        else:
            PropertyFavorite.objects.create(
                user=request.user,
                property=property
            )
            is_favorite = True

        return Response({"is_favorite": is_favorite})

    @action(detail=True, methods=["post"])
    def set_cover(self, request, pk=None):

        property = self.get_object()

        image_id = request.data.get("image_id")

        image = PropertyImage.objects.filter(
            id=image_id,
            property=property
        ).first()

        if not image:
            raise ValidationError({"image_id": "تصویر یافت نشد."})

        PropertyImage.objects.filter(
            property=property
        ).update(
            is_cover=False
        )

        image.is_cover = True
        image.save(update_fields=["is_cover"])

        return Response({"success": True})


class PropertyImageViewSet(viewsets.ModelViewSet):

    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer

    permission_classes = [
        IsAuthenticated,
        IsAgentOrManager
    ]

    http_method_names = [
        "delete"
    ]

    def get_queryset(self):
        return PropertyImage.objects.filter(
            property__agency=self.request.user.agency
        )