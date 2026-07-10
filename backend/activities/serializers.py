from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    extra_kwargs = {
        "agency": {
            "read_only": True
        }
    }

    class Meta:
        model = Activity
        fields = '__all__'