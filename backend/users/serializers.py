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

    username = serializers.CharField(validators=[])

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


    def validate_username(self, value):

        queryset = User.objects.filter(username=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "این نام کاربری قبلاً استفاده شده است."
            )

        return value

    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role",
            "agency",
            "properties_count",
            "customers_count",
            "visits_count",
            "contracts_count",
        ]

        extra_kwargs = {
            "role": {"read_only": True},
        }


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(write_only=True)

    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):

        user = self.context["request"].user

        if not user.check_password(value):
            raise serializers.ValidationError("رمز عبور فعلی صحیح نیست.")

        return value

    def save(self, **kwargs):

        user = self.context["request"].user

        user.set_password(self.validated_data["new_password"])

        user.save(update_fields=["password"])

        return user


class TeamMemberSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        min_length=8
    )

    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role",
            "is_active",
            "date_joined",
            "password",
        ]

        extra_kwargs = {
            "date_joined": {"read_only": True},
        }

    def validate_role(self, value):

        if value not in ("agent", "manager"):
            raise serializers.ValidationError(
                "نقش باید مشاور یا مدیر باشد."
            )

        return value

    def create(self, validated_data):

        password = validated_data.pop("password", None)

        if not password:
            raise serializers.ValidationError(
                {"password": "رمز عبور برای عضو جدید الزامی است."}
            )

        user = User(**validated_data)

        user.set_password(password)

        user.save()

        return user

    def update(self, instance, validated_data):

        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance