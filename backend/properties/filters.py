import django_filters

from .models import Property


class PropertyFilter(
    django_filters.FilterSet
):

    min_price = django_filters.NumberFilter(
        field_name="price",
        lookup_expr="gte"
    )

    max_price = django_filters.NumberFilter(
        field_name="price",
        lookup_expr="lte"
    )

    min_area = django_filters.NumberFilter(
        field_name="area",
        lookup_expr="gte"
    )

    max_area = django_filters.NumberFilter(
        field_name="area",
        lookup_expr="lte"
    )

    min_monthly_rent = django_filters.NumberFilter(
        field_name="monthly_rent",
        lookup_expr="gte"
    )

    max_monthly_rent = django_filters.NumberFilter(
        field_name="monthly_rent",
        lookup_expr="lte"
    )

    class Meta:

        model = Property

        fields = [
            "property_type",
            "transaction_type",
            "status",
            "rooms",
        ]