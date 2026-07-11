from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Customer
from .serializers import CustomerSerializer
from core.viewsets import AgencyScopedViewSet


class CustomerViewSet(AgencyScopedViewSet):

    queryset = Customer.objects.all()

    serializer_class = CustomerSerializer

    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["request_type", "status"]

    search_fields = ["full_name", "phone", "phone_2", "notes"]

    ordering_fields = ["created_at", "budget", "full_name"]

    ordering = ["-created_at"]