from django.contrib import admin
from .models import Property, PropertyImage,PropertyVideo


admin.site.register(PropertyVideo)


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        'code',
        'title',
        'property_type',
        'transaction_type',
        'price',
        'area',
        'created_at'
    )

    search_fields = (
        'code',
        'title'
    )

    list_filter = (
        'property_type',
        'transaction_type'
    )

    inlines = [
        PropertyImageInline,
        PropertyVideoInline
    ]


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = (
        'property',
        'created_at'
    )