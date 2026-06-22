from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from properties.models import Property
from customers.models import Customer
from visits.models import Visit
from contracts.models import Contract


class DashboardView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        data = {

            "properties": Property.objects.count(),

            "customers": Customer.objects.count(),

            "visits": Visit.objects.count(),

            "contracts": Contract.objects.count(),

        }

        return Response(data)