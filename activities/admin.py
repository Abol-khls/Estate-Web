from django.contrib import admin
from .models import Activity


@admin.register(Activity)
class FollowUpAdmin(admin.ModelAdmin):

    list_display = (
        'customer',
        'title',
        'status',
        'follow_date'
    )

    list_filter = (
        'status',
    )

    search_fields = (
        'customer__full_name',
        'title'
    )