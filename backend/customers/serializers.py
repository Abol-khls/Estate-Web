from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = '__all__'
        extra_kwargs = {
            "agency": {
                "read_only": True
            }
        }

    def validate_phone(self, value):

        request = self.context.get("request")

        agency = request.user.agency if request else None

        queryset = Customer.objects.filter(
            agency=agency,
            phone=value
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "مشتری‌ای با این شماره تلفن قبلاً در آژانس شما ثبت شده است."
            )

        return value