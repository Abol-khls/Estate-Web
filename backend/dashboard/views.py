from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncMonth
from datetime import timedelta

from properties.models import Property
from customers.models import Customer
from visits.models import Visit
from contracts.models import Contract
from activities.models import Activity


class DashboardView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        agency = request.user.agency

        if not agency:

            return Response({
                "properties_count": 0,
                "customers_count": 0,
                "visits_today_count": 0,
                "active_contracts_count": 0,
                "recent_activities": [],
                "recent_visits": [],
                "monthly_overview": [],
            })

        today = timezone.localdate()

        properties_count = Property.objects.filter(
            agency=agency
        ).count()

        customers_count = Customer.objects.filter(
            agency=agency
        ).count()

        visits_today_count = Visit.objects.filter(
            agency=agency,
            visit_date__date=today
        ).count()

        active_contracts_count = Contract.objects.filter(
            agency=agency,
            status='signed'
        ).count()

        recent_activities = Activity.objects.filter(
            agency=agency
        ).select_related(
            'customer'
        ).order_by('-created_at')[:5]

        recent_visits = Visit.objects.filter(
            agency=agency
        ).select_related(
            'customer',
            'property'
        ).order_by('-created_at')[:5]

        six_months_ago = today.replace(day=1) - timedelta(days=150)

        visits_per_month = Visit.objects.filter(
            agency=agency,
            visit_date__date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('visit_date')
        ).values(
            'month'
        ).annotate(
            total=Count('id')
        ).order_by('month')

        contracts_per_month = Contract.objects.filter(
            agency=agency,
            created_at__date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values(
            'month'
        ).annotate(
            total=Count('id')
        ).order_by('month')

        monthly_overview = self._merge_monthly_data(
            visits_per_month,
            contracts_per_month
        )

        data = {

            "properties_count": properties_count,

            "customers_count": customers_count,

            "visits_today_count": visits_today_count,

            "active_contracts_count": active_contracts_count,

            "recent_activities": [
                {
                    "id": activity.id,
                    "title": activity.title,
                    "customer_name": activity.customer.full_name,
                    "status": activity.status,
                    "follow_date": activity.follow_date,
                    "created_at": activity.created_at,
                }
                for activity in recent_activities
            ],

            "recent_visits": [
                {
                    "id": visit.id,
                    "customer_name": visit.customer.full_name,
                    "property_title": visit.property.title,
                    "status": visit.status,
                    "visit_date": visit.visit_date,
                    "created_at": visit.created_at,
                }
                for visit in recent_visits
            ],

            "monthly_overview": monthly_overview,

        }

        return Response(data)

    def _merge_monthly_data(self, visits_qs, contracts_qs):

        visits_map = {
            item["month"].strftime("%Y-%m"): item["total"]
            for item in visits_qs
        }

        contracts_map = {
            item["month"].strftime("%Y-%m"): item["total"]
            for item in contracts_qs
        }

        months = sorted(
            set(visits_map.keys()) | set(contracts_map.keys())
        )

        return [
            {
                "month": month,
                "visits": visits_map.get(month, 0),
                "contracts": contracts_map.get(month, 0),
            }
            for month in months
        ]