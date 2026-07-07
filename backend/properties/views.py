from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter

from rest_framework.filters import SearchFilter, OrderingFilter

from django_filters.rest_framework import DjangoFilterBackend

from .models import Property, PropertyImage, PropertyVideo
from .serializers import PropertySerializer, PropertyImageSerializer, PropertyVideoSerializer

from .models import Property
from .serializers import (
    PropertySerializer,
    PropertyImageSerializer,
)

class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer

from .filters import PropertyFilter


from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser
)

from .serializers import (
    PropertySerializer,
    PropertyImageSerializer
)

from .models import PropertyImage
from rest_framework import permissions
from rest_framework.response import Response


class PropertyViewSet(viewsets.ModelViewSet):



    queryset = Property.objects.all()

    serializer_class = PropertySerializer
    from rest_framework.decorators import action
    from rest_framework.response import Response
    @action(detail=True, methods=["post"])

    def set_cover(self, request, pk=None):

        property = self.get_object()

        image_id = request.data.get("image_id")

        PropertyImage.objects.filter(

            property=property

        ).update(

            is_cover=False

        )

        PropertyImage.objects.filter(

            id=image_id,

            property=property

        ).update(

            is_cover=True

        )

        return Response({"success": True})

    permission_classes = [
        IsAuthenticated
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


    def get_queryset(self):

        return Property.objects.filter(
            agency=self.request.user.agency
        )
    def perform_create(self, serializer):
        serializer.save(
            agency=self.request.user.agency
        )
    def get_serializer_context(self):

        context = super().get_serializer_context()

        context["request"] = self.request

        return context

    parser_classes = [
    MultiPartParser,
    FormParser,
    JSONParser
]
    
class PropertyImageViewSet(viewsets.ModelViewSet):

    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer

    permission_classes = [
        IsAuthenticated
    ]

    http_method_names = [
        "delete"
    ]

    def get_queryset(self):
        return PropertyImage.objects.filter(
            property__agency=self.request.user.agency
        )