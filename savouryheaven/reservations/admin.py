from django.contrib import admin
from django.utils.safestring import mark_safe
import os
from .models import TimeSlot, Reservation, MenuCategory, MenuItem


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    """Admin interface configuration for TimeSlot model."""
    list_display = ('display_name', 'start_time', 'max_capacity', 'is_active')
    list_editable = ('is_active',)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for Reservation model.

    Provides filtering, searching, and display customization.
    """
    list_display = ('name', 'date', 'time_slot', 'guests', 'is_cancelled')
    list_filter = ('date', 'is_cancelled')
    search_fields = ('name', 'email')


class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 1
    fields = ('name', 'price', 'is_available', 'order', 'image_preview')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image and obj.image.name:
            try:
                return mark_safe(
                    (
                        '<img src="{}" '
                        'style="width: 50px; height: auto;" />'
                    ).format(obj.image.url)
                )
            except Exception:
                return "Image file missing"
        return "No Image"

    image_preview.short_description = 'Preview'


@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'menu_item_count')
    list_editable = ('order',)
    inlines = [MenuItemInline]

    def menu_item_count(self, obj):
        return obj.menu_items.count()

    menu_item_count.short_description = 'Menu Items'


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'category', 'price', 'is_available', 
        'is_featured', 'order', 'image_preview'
    )
    list_filter = ('category', 'is_available', 'is_featured')
    list_editable = ('price', 'is_available', 'is_featured', 'order')
    search_fields = ('name', 'description', 'ingredients')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image and obj.image.name:
            try:
                return mark_safe(
                    (
                        '<img src="{}" style="width: 100px; height: auto;" />'
                    ).format(obj.image.url)
                )
            except Exception:
                # Fallback: check if file exists physically
                if os.path.exists(obj.image.path):
                    return mark_safe(
                        (
                            '<img src="/media/{}" '
                            'style="width: 100px; height: auto;" />'
                        ).format(obj.image.name)
                    )
                return "Image file missing"
        return "No Image"

    image_preview.short_description = 'Image Preview'

    fieldsets = (
        (None, {
            'fields': ('name', 'category', 'description', 'ingredients')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'is_available', 'is_featured', 'order')
        }),
        ('Nutritional Info', {
            'fields': ('calories',),
            'classes': ('collapse',)
        }),
        ('Image', {
            'fields': ('image', 'image_preview'),
            'classes': ('collapse',)
        })
    )
