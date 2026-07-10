from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Contract
from .serializers import ContractSerializer
from core.viewsets import AgencyScopedViewSet


class ContractViewSet(AgencyScopedViewSet):

    queryset = Contract.objects.all()

    serializer_class = ContractSerializer

    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["status", "contract_type"]

    search_fields = ["customer__full_name", "property__title", "description"]

    ordering_fields = ["created_at", "amount", "signed_date"]

    ordering = ["-created_at"]
