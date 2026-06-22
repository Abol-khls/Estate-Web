from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Customer
from .serializers import CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):

    queryset = Customer.objects.all()
    def get_queryset(self):

        return Customer.objects.filter(
            agency=self.request.user.agency
        )

    serializer_class = CustomerSerializer

    permission_classes = [
    IsAuthenticated
]