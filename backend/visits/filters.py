import django_filters

from .models import Visit


class VisitFilter(django_filters.FilterSet):

    start_date = django_filters.DateFilter(
        field_name="visit_date",
        lookup_expr="date__gte"
    )

    end_date = django_filters.DateFilter(
        field_name="visit_date",
        lookup_expr="date__lte"
    )

    class Meta:

        model = Visit

        fields = [
            "status",
            "customer",
        ]