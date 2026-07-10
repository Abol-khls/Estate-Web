from rest_framework import serializers
from .models import Visit


class VisitSerializer(serializers.ModelSerializer):
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
        model = Visit
        fields = '__all__'