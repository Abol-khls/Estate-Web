from rest_framework import serializers
from .models import Agency


class AgencySerializer(serializers.ModelSerializer):

    class Meta:

        model = Agency

        fields = [
            "id",
            "name",
            "phone",
            "address",
            "created_at",
        ]

        extra_kwargs = {
            "created_at": {"read_only": True},
        }