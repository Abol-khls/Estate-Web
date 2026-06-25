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

        agency = request.user.agency

        data = {

            "properties": Property.objects.filter(
                agency=agency
            ).count(),

            "customers": Customer.objects.filter(
                agency=agency
            ).count(),

            "visits": Visit.objects.filter(
                agency=agency
            ).count(),

            "contracts": Contract.objects.filter(
                agency=agency
            ).count(),

        }

        return Response(data)
   