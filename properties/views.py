from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter

from django_filters.rest_framework import DjangoFilterBackend

from .models import Property
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):

    queryset = Property.objects.all()

    serializer_class = PropertySerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter
    ]

    filterset_fields = [
        'property_type',
        'transaction_type',
        'rooms',
    ]

    search_fields = [
        'title',
        'address',
        'description'
    ]


    def get_queryset(self):

        return Property.objects.filter(
            agency=self.request.user.agency
        )