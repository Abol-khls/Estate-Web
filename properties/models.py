from django.db import models
from agencies.models import Agency

class Property(models.Model):
    

    TRANSACTION_CHOICES = (
        ('sale', 'Sale'),
        ('rent', 'Rent'),
        ('pre_sale', 'Pre Sale'),
        ('mortgage', 'Mortgage'),
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

    def __str__(self):
        return f"{self.code} - {self.title}"
    
class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='properties/'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
    

    def __str__(self):
        return self.property.title
    
class PropertyVideo(models.Model):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="videos"
    )

    video = models.FileField(
        upload_to="property_videos/"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.property.title