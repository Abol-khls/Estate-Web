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
    extra_kwargs = {
        "agency": {
            "read_only": True
        }
    }
    def validate_property(self, value):
        request = self.context["request"]

        if value.agency != request.user.agency:
            raise serializers.ValidationError(
                "این ملک متعلق به آژانس شما نیست."
            )

        return value


    def validate_customer(self, value):
        request = self.context["request"]

        if value.agency != request.user.agency:
            raise serializers.ValidationError(
                "این مشتری متعلق به آژانس شما نیست."
            )

        return value

    class Meta:
        model = Contract
        fields = '__all__'