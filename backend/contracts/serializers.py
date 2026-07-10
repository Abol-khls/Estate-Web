from rest_framework import serializers
from .models import Contract


class ContractSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True
    )

    property_title = serializers.CharField(
        source="property.title",
        read_only=True
    )

    class Meta:
        model = Contract
        fields = '__all__'