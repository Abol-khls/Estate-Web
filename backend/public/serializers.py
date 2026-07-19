from rest_framework import serializers

from properties.models import Property, PropertyImage, PropertyVideo
from customers.models import Customer
from activities.models import Activity
from agencies.models import Agency


class PublicPropertyImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyImage
        fields = ["id", "image", "is_cover"]


class PublicPropertyVideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyVideo
        fields = ["id", "video"]


class PublicPropertyListSerializer(serializers.ModelSerializer):

    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Property

        fields = [
            "id",
            "title",
            "property_type",
            "transaction_type",
            "price",
            "area",
            "rooms",
            "address",
            "cover_image",
        ]

    def get_cover_image(self, obj):

        request = self.context.get("request")

        image = obj.images.filter(is_cover=True).first() or obj.images.first()

        if not image:
            return None

        url = image.image.url

        if request:
            return request.build_absolute_uri(url)

        return url


class PublicPropertyDetailSerializer(serializers.ModelSerializer):

    images = PublicPropertyImageSerializer(many=True, read_only=True)

    videos = PublicPropertyVideoSerializer(many=True, read_only=True)

    class Meta:
        model = Property

        fields = [
            "id",
            "title",
            "property_type",
            "transaction_type",
            "price",
            "area",
            "rooms",
            "floor",
            "total_floors",
            "year_built",
            "parking",
            "elevator",
            "storage",
            "address",
            "description",
            "images",
            "videos",
        ]


class PublicInquirySerializer(serializers.Serializer):

    REQUEST_TYPE_CHOICES = (
        ("visit", "Visit"),
        ("call", "Call"),
        ("info", "Info"),
    )

    full_name = serializers.CharField(max_length=255)

    phone = serializers.CharField(max_length=20)

    message = serializers.CharField(
        max_length=1000,
        required=False,
        allow_blank=True
    )

    request_type = serializers.ChoiceField(
        choices=REQUEST_TYPE_CHOICES,
        default="info"
    )

    property_id = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.filter(status="available"),
        required=False,
        allow_null=True,
        source="property"
    )

    def create(self, validated_data):

        agency = Agency.objects.first()

        property_obj = validated_data.get("property")

        customer, created = Customer.objects.get_or_create(
            agency=agency,
            phone=validated_data["phone"],
            defaults={
                "full_name": validated_data["full_name"],
                "request_type": "buy",
            }
        )

        if not created:
            customer.full_name = validated_data["full_name"]
            customer.save(update_fields=["full_name"])

        request_type_labels = {
            "visit": "درخواست بازدید از سایت",
            "call": "درخواست تماس از سایت",
            "info": "درخواست اطلاعات از سایت",
        }

        title = request_type_labels.get(
            validated_data["request_type"],
            "درخواست از سایت"
        )

        description_parts = []

        if property_obj:
            description_parts.append(
                f"ملک مورد نظر: {property_obj.title} (کد {property_obj.code})"
            )

        if validated_data.get("message"):
            description_parts.append(validated_data["message"])

        from django.utils import timezone

        activity = Activity.objects.create(
            customer=customer,
            agency=agency,
            title=title,
            description="\n".join(description_parts),
            status="pending",
            follow_date=timezone.now()
        )

        return activity