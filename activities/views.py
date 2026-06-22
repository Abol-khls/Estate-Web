from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Activity
from .serializers import ActivitySerializer


class ActivityViewSet(viewsets.ModelViewSet):

    queryset = Activity.objects.all()

    serializer_class = ActivitySerializer
    def get_queryset(self):

        return Activity.objects.filter(
            agency=self.request.user.agency
        )

    permission_classes = [
        IsAuthenticated
    ]