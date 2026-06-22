from django.db import models
from agencies.models import Agency
from customers.models import Customer
from properties.models import Property
from users.models import User


class Contract(models.Model):

    CONTRACT_TYPE_CHOICES = (
        ('sale', 'Sale'),
        ('rent', 'Rent'),
        ('mortgage', 'Mortgage'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('signed', 'Signed'),
        ('cancelled', 'Cancelled'),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='contracts'
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='contracts'
    )

    agent = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    contract_type = models.CharField(
        max_length=20,
        choices=CONTRACT_TYPE_CHOICES
    )

    amount = models.BigIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )

    signed_date = models.DateField(
        null=True,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="contracts",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.customer} - {self.property}"