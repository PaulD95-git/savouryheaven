from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


class TimeSlot(models.Model):
    """Represents available booking time slots managed by admin."""
    start_time = models.TimeField(
        unique=True,
        help_text="Actual time stored in 24h format (e.g. 17:30:00)"
    )
    display_name = models.CharField(
        max_length=10,
        help_text="User-friendly name (e.g. '5:30 PM')"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Toggle to disable slot temporarily"
    )
    max_capacity = models.PositiveIntegerField(
        default=50,
        validators=[MinValueValidator(1)],
        help_text="Maximum reservations allowed for this slot"
    )

    def __str__(self):
        """String representation for admin/dropdowns."""
        return self.display_name

    class Meta:
        """Metadata options."""
        ordering = ['start_time']  # Chronological order
        verbose_name = "Time Slot"
        verbose_name_plural = "Time Slots"


class Reservation(models.Model):
    """Stores restaurant reservations with time slot linkage."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        help_text="User who made the reservation"
    )
    time_slot = models.ForeignKey(
        TimeSlot,
        on_delete=models.PROTECT,  # Prevent deletion of booked slots
        help_text="Selected booking time"
    )
    date = models.DateField(help_text="Reservation date (YYYY-MM-DD)")
    name = models.CharField(
        max_length=100,
        help_text="Customer name (fallback if not logged in)"
    )
    email = models.EmailField(help_text="Contact email for confirmation")
    phone = models.CharField(
        max_length=20,
        help_text="Contact phone number"
    )
    guests = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),  # At least 1 guest
            MaxValueValidator(20)  # Max 20 guests
        ],
        help_text="Number of attendees"
    )
    special_requests = models.TextField(
        blank=True,
        null=True,
        help_text="Dietary needs or other requests"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When reservation was made"
    )
    is_cancelled = models.BooleanField(
        default=False,
        help_text="Soft delete toggle"
    )

    def __str__(self):
        """Admin/list view representation."""
        return f"{self.name} - {self.date} at {self.time_slot.display_name}"

    class Meta:
        """Metadata options."""
        ordering = ['date', 'time_slot__start_time']  # Earliest first
        verbose_name = "Reservation"
        verbose_name_plural = "Reservations"

    @property
    def time(self):
        """Backward-compatible time accessor (for templates)."""
        return self.time_slot.start_time


class MenuCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Menu Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    category = models.ForeignKey(
        MenuCategory,
        related_name='menu_items',
        on_delete=models.CASCADE
    )
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    image = models.ImageField(
        upload_to='menu_images/',
        blank=True,
        null=True
    )
    ingredients = models.TextField(blank=True)
    calories = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        ordering = ['category__order', 'order', 'name']

    def __str__(self):
        return self.name
