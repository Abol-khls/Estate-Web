from django.contrib import admin
from .models import Visit


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):

    list_display = (
        'customer',
        'property',
        'agent',
        'visit_date',
        'status',
    )

    list_filter = (
        'status',
    )

    search_fields = (
        'customer__full_name',
        'property__title',
    )