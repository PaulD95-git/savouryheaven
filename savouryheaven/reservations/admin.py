from django.contrib import admin
from .models import TimeSlot, Reservation

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'start_time', 'max_capacity', 'is_active')
    list_editable = ('is_active',)  # Allow quick toggling

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time_slot', 'guests', 'is_cancelled')
    list_filter = ('date', 'is_cancelled')
    search_fields = ('name', 'email')
