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
        required=False
    )

    videos = PropertyVideoSerializer(
        many=True,
        required=False
    )

    def create(self, validated_data):

        images = validated_data.pop(
            "images",
            []
        )

        videos = validated_data.pop(
            "videos",
            []
        )

        property = Property.objects.create(
            **validated_data
        )


        for image in images:
            PropertyImage.objects.create(
                property=property,
                **image
            )


        for video in videos:
            PropertyVideo.objects.create(
                property=property,
                **video
            )


        return property

    class Meta:
        model = Property

        fields = "__all__"

    