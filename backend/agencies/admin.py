from django.contrib import admin
from .models import Agency


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):

        if Agency.objects.exists():
            return False

        return super().has_add_permission(request)