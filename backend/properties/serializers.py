from rest_framework import serializers

from .models import (
    Property,
    PropertyImage,
    PropertyVideo
)


class PropertyImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyImage
        fields = [
            "id",
            "image"
        ]


class PropertyVideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyVideo
        fields = [
            "id",
            "video"
        ]


class PropertySerializer(serializers.ModelSerializer):

    images = PropertyImageSerializer(
        many=True,
        read_only=True
    )

    videos = PropertyVideoSerializer(
        many=True,
        required=False
    )

    def create(self, validated_data):

        request = self.context["request"]

        property = Property.objects.create(
            **validated_data
        )


        images = request.FILES.getlist(
            "images"
        )


        for image in images:

            PropertyImage.objects.create(
                property=property,
                image=image
            )


        videos = request.FILES.getlist(
            "videos"
        )


        for video in videos:

            PropertyVideo.objects.create(
                property=property,
                video=video
            )


        return property

    class Meta:
        model = Property

        fields = "__all__"

    