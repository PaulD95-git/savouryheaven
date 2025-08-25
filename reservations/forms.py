from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Reservation, TimeSlot
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserChangeForm


class ReservationForm(forms.ModelForm):
    """Form for restaurant reservations with time slot validation."""
    class Meta:
        """Form metadata and configuration."""
        model = Reservation
        fields = [
            'name',        # Customer full name
            'email',       # Contact email
            'phone',       # Contact phone number
            'date',        # Booking date
            'time_slot',   # Chosen TimeSlot
            'guests',      # Number of attendees
            'special_requests'  # Special requirements
        ]
        widgets = {
            'date': forms.DateInput(
                attrs={
                    'type': 'date',
                    'class': 'form-control'
                }
            ),
            'special_requests': forms.Textarea(
                attrs={
                    'rows': 3,
                    'placeholder': 'Allergies, accessibility needs, etc.'
                }
            ),
        }

    def __init__(self, *args, **kwargs):
        """Initialize with active time slots only."""
        super().__init__(*args, **kwargs)
        self.fields['time_slot'].queryset = TimeSlot.objects.filter(
            is_active=True
        ).order_by('start_time')

    def clean_date(self):
        """Ensure booking date is not in the past."""
        date = self.cleaned_data.get('date')
        if date and date < timezone.now().date():
            raise ValidationError(
                "Reservations cannot be made for past dates."
            )
        return date

    def clean(self):
        """Validate time slot availability."""
        cleaned_data = super().clean()
        date = cleaned_data.get('date')
        time_slot = cleaned_data.get('time_slot')

        if date and time_slot:
            bookings = Reservation.objects.filter(
                date=date,
                time_slot=time_slot,
                is_cancelled=False
            ).count()

            if bookings >= time_slot.max_capacity:
                remaining = time_slot.max_capacity - bookings
                raise ValidationError(
                    f"No seats remaining ({remaining}). Please choose "
                    "another time slot."
                )


class UserProfileForm(UserChangeForm):

    password = None

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].required = True
