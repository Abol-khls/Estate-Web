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
            "image",
            "is_cover",
            "order",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get("request")

        if request:
            data["image"] = instance.image.url

        return data


class PropertyVideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyVideo
        fields = [
            "id",
            "video",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get("request")

        if request:
            data["video"] = instance.video.url

        return data


class PropertySerializer(serializers.ModelSerializer):

    images = PropertyImageSerializer(
        many=True,
        read_only=True
    )

    

    def create(self, validated_data):
        

        request = self.context["request"]

        property = Property.objects.create(
            **validated_data
        )


        images = request.FILES.getlist(
            "images"
        )


        for index, image in enumerate(images):

            PropertyImage.objects.create(

                property=property,

                image=image,

                is_cover=(index == 0)

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
    def update(self, instance, validated_data):

        request = self.context["request"]

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        import json

 
        deleted_images = request.data.get("deleted_images")

        if deleted_images:

            deleted_images = json.loads(deleted_images)

            images = PropertyImage.objects.filter(
                property=instance,
                id__in=deleted_images
            )

            for image in images:
                image.delete()


        deleted_videos = request.data.get("deleted_videos")

        if deleted_videos:

            deleted_videos = json.loads(deleted_videos)

            videos = PropertyVideo.objects.filter(
                property=instance,
                id__in=deleted_videos
            )

            for video in videos:
                video.delete()


        images = request.FILES.getlist("images")

        has_cover = PropertyImage.objects.filter(

            property=instance,

            is_cover=True

        ).exists()


        for image in images:

            PropertyImage.objects.create(

                property=instance,

                image=image,

                is_cover=not has_cover

            )

            has_cover = True


        videos = request.FILES.getlist("videos")

        for video in videos:

            PropertyVideo.objects.create(
                property=instance,
                video=video
            )

        return instance


    class Meta:
        model = Property

        fields = [
            "id",
            "code",
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
        ]

    def to_representation(self, instance):

        data = super().to_representation(instance)

        data["videos"] = PropertyVideoSerializer(
            instance.videos.all(),
            many=True
        ).data

        return data
    
    

    