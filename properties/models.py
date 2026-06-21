from django.db import models


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