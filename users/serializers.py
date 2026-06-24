from rest_framework import serializers
from agencies.models import Agency
from properties.models import Property
from customers.models import Customer
from visits.models import Visit
from contracts.models import Contract
from .models import User

class AgencySerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Agency

        fields = [
            "id",
            "name",
            "phone",
            "address",
        ]
class UserSerializer(
    serializers.ModelSerializer
):

    agency = AgencySerializer(
        read_only=True
    )

    properties_count = serializers.SerializerMethodField()

    customers_count = serializers.SerializerMethodField()

    visits_count = serializers.SerializerMethodField()

    contracts_count = serializers.SerializerMethodField()


    def get_properties_count(
        self,
        obj
    ):
        return Property.objects.filter(
            agency=obj.agency
        ).count()


    def get_customers_count(
        self,
        obj
    ):
        return Customer.objects.filter(
            agency=obj.agency
        ).count()


    def get_visits_count(
        self,
        obj
    ):
        return Visit.objects.filter(
            agency=obj.agency
        ).count()


    def get_contracts_count(
        self,
        obj
    ):
        return Contract.objects.filter(
            agency=obj.agency
        ).count()


    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "phone",
            "agency",
            "properties_count",
            "customers_count",
            "visits_count",
            "contracts_count",
        ]