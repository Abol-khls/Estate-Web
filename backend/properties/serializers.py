from rest_framework import serializers

from .validators import validate_image, validate_video
from .models import (
    Property,
    PropertyImage,
    PropertyVideo
)
from .validators import (
    validate_image,
    validate_video,
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
    cover_image = serializers.SerializerMethodField()

    images = PropertyImageSerializer(
        many=True,
        read_only=True
    )

    

    def create(self, validated_data):
        

        request = self.context["request"]

        


        images = request.FILES.getlist("images")
        videos = request.FILES.getlist("videos")

        if len(images) > 10:
            raise serializers.ValidationError({
                "images": "حداکثر 10 تصویر مجاز است."
            })

        if len(videos) > 5:
            raise serializers.ValidationError({
                "videos": "حداکثر 5 ویدیو مجاز است."
            })
        
        

        
        for image in images:

            if image.size > 5 * 1024 * 1024:
                raise serializers.ValidationError({
                    "images": [
                        "حجم تصویر نباید بیشتر از ۵ مگابایت باشد."
                    ]
                })

            validate_image(image)
        

        for video in videos:

            if video.size > 50 * 1024 * 1024:
                raise serializers.ValidationError({
                    "videos": [
                        "حجم ویدیو نباید بیشتر از ۵۰ مگابایت باشد."
                    ]
                })

            validate_video(video)

        
        property = Property.objects.create(
            **validated_data
        )

       
        for index, image in enumerate(images):
            PropertyImage.objects.create(
                property=property,
                image=image,
                is_cover=(index == 0)
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
        for image in images:

            if image.size > 5 * 1024 * 1024:
                raise serializers.ValidationError({
                    "images": [
                        "حجم تصویر نباید بیشتر از ۵ مگابایت باشد."
                    ]
                })

            validate_image(image)

        has_cover = PropertyImage.objects.filter(

            property=instance,

            is_cover=True

        ).exists()
        current_images = instance.images.count()

        if current_images + len(images) > 10:
            raise serializers.ValidationError({
                "images": "حداکثر 10 تصویر مجاز است."
            })

        for image in images:

            PropertyImage.objects.create(

                property=instance,

                image=image,

                is_cover=not has_cover

            )

            has_cover = True


        videos = request.FILES.getlist("videos")
        for video in videos:

            if video.size > 50 * 1024 * 1024:
                raise serializers.ValidationError({
                    "videos": [
                        "حجم ویدیو نباید بیشتر از ۵۰ مگابایت باشد."
                    ]
                })

            validate_video(video)
        current_videos = instance.videos.count()

        if current_videos + len(videos) > 5:
            raise serializers.ValidationError({
                "videos": "حداکثر 5 ویدیو مجاز است."
            })

        for video in videos:

            PropertyVideo.objects.create(
                property=instance,
                video=video
            )

        return instance
    def get_cover_image(self, obj):

        cover = obj.images.filter(is_cover=True).first()

        if not cover:
            cover = obj.images.first()

        if not cover:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(cover.image.url)

        return cover.image.url


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
            "cover_image",
            "is_favorite",
            "status",
        ]

    def to_representation(self, instance):

        data = super().to_representation(instance)

        data["videos"] = PropertyVideoSerializer(
            instance.videos.all(),
            many=True
        ).data

        return data