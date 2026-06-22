from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Visit
from .serializers import VisitSerializer


class VisitViewSet(viewsets.ModelViewSet):

    queryset = Visit.objects.all()

    serializer_class = VisitSerializer

    permission_classes = [
        IsAuthenticated
    ]