from django.contrib import admin
from .models import Contract


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):

    list_display = (
        'customer',
        'property',
        'contract_type',
        'amount',
        'status',
    )

    list_filter = (
        'contract_type',
        'status',
    )

    search_fields = (
        'customer__full_name',
        'property__title',
    )