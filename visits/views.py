from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Visit
from .serializers import VisitSerializer


class VisitViewSet(viewsets.ModelViewSet):

    queryset = Visit.objects.all()
    def get_queryset(self):

        return Visit.objects.filter(
            agency=self.request.user.agency
        )

    serializer_class = VisitSerializer

    permission_classes = [
        IsAuthenticated
    ]