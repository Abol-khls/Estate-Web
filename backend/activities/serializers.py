from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True
    )

    def validate_customer(self, value):
        request = self.context["request"]

        if value.agency != request.user.agency:
            raise serializers.ValidationError(
                "این مشتری متعلق به آژانس شما نیست."
            )

        return value

    class Meta:
        model = Activity
        fields = '__all__'
        extra_kwargs = {
            "agency": {
                "read_only": True
            },
            "user": {
                "read_only": True
            }
        }