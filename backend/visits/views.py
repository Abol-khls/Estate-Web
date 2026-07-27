from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .models import Visit
from .serializers import VisitSerializer
from .filters import VisitFilter
from core.viewsets import AgencyScopedViewSet
from core.permissions import IsAgentOrManager


class VisitPagination(PageNumberPagination):

    page_size = 20

    page_size_query_param = "page_size"

    max_page_size = 500


class VisitViewSet(AgencyScopedViewSet):

    queryset = Visit.objects.all()

    serializer_class = VisitSerializer

    permission_classes = [
        IsAuthenticated,
        IsAgentOrManager
    ]

    pagination_class = VisitPagination

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_class = VisitFilter

    search_fields = ["customer__full_name", "property__title", "notes"]

    ordering_fields = ["created_at", "visit_date"]

    ordering = ["-visit_date"]

    def perform_create(self, serializer):
        serializer.save(
            agency=self.request.user.agency,
            agent=self.request.user
        )