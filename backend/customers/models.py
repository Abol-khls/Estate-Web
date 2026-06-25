from django.db import models
from agencies.models import Agency

class Customer(models.Model):

    REQUEST_TYPE_CHOICES = (
        ('buy', 'Buy'),
        ('rent', 'Rent'),
        ('sell', 'Sell'),
        ('mortgage', 'Mortgage'),
    )

    full_name = models.CharField(
        max_length=255
    )

    phone = models.CharField(
        max_length=20,
        unique=True
    )

    request_type = models.CharField(
        max_length=20,
        choices=REQUEST_TYPE_CHOICES
    )

    budget = models.BigIntegerField(
        null=True,
        blank=True
    )

    notes = models.TextField(
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
        related_name="customers",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.full_name
