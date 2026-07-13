from django.db import models
from django.conf import settings
from agencies.models import Agency
from .validators import (
    validate_image,
    validate_video,
)

class Property(models.Model):
    

    TRANSACTION_CHOICES = (
        ('sale', 'Sale'),
        ('rent', 'Rent'),
        ('pre_sale', 'Pre Sale'),
        ('mortgage', 'Mortgage'),
    )

    STATUS_CHOICES = (
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
        ('rented', 'Rented'),
    )

    PROPERTY_TYPE_CHOICES = (
        ('apartment', 'Apartment'),
        ('villa', 'Villa'),
        ('land', 'Land'),
        ('office', 'Office'),
        ('shop', 'Shop'),
    )

    code = models.CharField(
        max_length=20,
        unique=True
    )

    title = models.CharField(
        max_length=255
    )

    property_type = models.CharField(
        max_length=20,
        choices=PROPERTY_TYPE_CHOICES
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_CHOICES
    )
    floor = models.PositiveIntegerField(
    null=True,
    blank=True
    )

    total_floors = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    year_built = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    parking = models.BooleanField(
        default=False
    )

    elevator = models.BooleanField(
        default=False
    )

    storage = models.BooleanField(
        default=False
    )

    price = models.BigIntegerField()

    area = models.PositiveIntegerField()

    rooms = models.PositiveIntegerField(
        default=0
    )

    address = models.TextField()

    description = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="properties",
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available'
    )

    def __str__(self):
        return f"{self.code} - {self.title}"


class PropertyFavorite(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_properties"
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="favorited_by"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ('user', 'property')

    def __str__(self):
        return f"{self.user} - {self.property}"
    
class PropertyImage(models.Model):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images"
    )

    
    image = models.ImageField(
        upload_to="properties/",
        validators=[validate_image],
    )

    is_cover = models.BooleanField(
        default=False
    )

    order = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
    def delete(self, *args, **kwargs):

        storage = self.image.storage
        path = self.image.path

        super().delete(*args, **kwargs)

        if storage.exists(path):
            storage.delete(path)
    
class PropertyVideo(models.Model):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="videos"
    )

    
    video = models.FileField(
        upload_to="properties/videos/",
        validators=[validate_video],
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def delete(self, *args, **kwargs):

        storage = self.video.storage
        path = self.video.path

        super().delete(*args, **kwargs)

        if storage.exists(path):
            storage.delete(path)

    def __str__(self):
        return self.property.title