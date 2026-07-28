from django.contrib import admin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):

    list_display = (
        'created_at',
        'actor',
        'agency',
        'action',
        'model_name',
        'object_id',
        'object_repr',
    )

    list_filter = (
        'action',
        'model_name',
        'agency',
    )

    search_fields = (
        'object_repr',
        'object_id',
    )

    ordering = ('-created_at',)