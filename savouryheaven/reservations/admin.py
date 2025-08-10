from django.contrib import admin
from .models import TimeSlot, Reservation


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
