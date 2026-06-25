from django.db import models
from customers.models import Customer
from users.models import User
from agencies.models import Agency


class Activity(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled'),
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='followups'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    follow_date = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="activities",
        null=True,
        blank=True
    )


    def __str__(self):
        return self.title
