from rest_framework.permissions import IsAuthenticated

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