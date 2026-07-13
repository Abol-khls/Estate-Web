from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Activity
from .serializers import ActivitySerializer

from core.viewsets import AgencyScopedViewSet
from core.permissions import IsAgentOrManager


class ActivityViewSet(AgencyScopedViewSet):

    queryset = Activity.objects.all()

    serializer_class = ActivitySerializer

    permission_classes = [
        IsAuthenticated,
        IsAgentOrManager
    ]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = ["status"]

    search_fields = ["customer__full_name", "title", "description"]

    ordering_fields = ["created_at", "follow_date"]

    ordering = ["-follow_date"]

    def perform_create(self, serializer):
        serializer.save(
            agency=self.request.user.agency,
            user=self.request.user
        )