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

    def create(self, validated_data):

        contract = super().create(validated_data)

        self._sync_related_statuses(contract)

        return contract

    def update(self, instance, validated_data):

        contract = super().update(instance, validated_data)

        self._sync_related_statuses(contract)

        return contract

    def _sync_related_statuses(self, contract):

        property_obj = contract.property

        customer_obj = contract.customer

        if contract.status == 'signed':

            property_obj.status = 'rented' if contract.contract_type == 'rent' else 'sold'

            customer_obj.status = 'converted'

        elif contract.status == 'cancelled':

            property_obj.status = 'available'

            if customer_obj.status == 'converted':
                customer_obj.status = 'active'

        elif contract.status == 'draft':

            property_obj.status = 'reserved'

        property_obj.save(update_fields=['status'])

        customer_obj.save(update_fields=['status'])

    class Meta:
        model = Contract
        fields = '__all__'
        extra_kwargs = {
            "agency": {
                "read_only": True
            },
            "agent": {
                "read_only": True
            }
        }