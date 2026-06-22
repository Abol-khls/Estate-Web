from django.contrib.auth.models import AbstractUser
from django.db import models
from agencies.models import Agency


class User(AbstractUser):

    ROLE_CHOICES = (
        ('manager', 'مدیر'),
        ('agent', 'مشاور'),
        ('customer', 'مشتری'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='agent'
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="users"
    )

    def __str__(self):
        return self.username
