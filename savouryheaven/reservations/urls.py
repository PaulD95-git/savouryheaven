# reservations/urls.py
from django.urls import path
from .views import reservation_view, success_view, get_available_slots, index

# URL patterns for the reservations app
urlpatterns = [
    # Home page for reservations
    path('', index, name='home'),

    # Booking form page
    path('book/', reservation_view, name='book'),

    # Success page after booking submission
    path('book/success/', success_view, name='booking_success'),

    # API endpoint for fetching available time slots (AJAX)
    path('api/available-slots/', get_available_slots, name='available_slots'),
]
