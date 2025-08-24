from django.urls import path
from .views import (
    reservation_view,
    success_view,
    get_available_slots,
    index,
    my_reservations,
    edit_reservation,
    cancel_reservation,
    edit_profile,
    menu_view,
)


urlpatterns = [
    path('', index, name='home'),
    path('book/', reservation_view, name='book'),
    path('book/success/', success_view, name='booking_success'),
    path('api/available-slots/', get_available_slots, name='available_slots'),
    path('my-reservations/', my_reservations, name='my_reservations'),
    path('edit-profile/', edit_profile, name='edit_profile'),
    path('menu/', menu_view, name='menu'),  # Add this line
    path(
        'edit-reservation/<int:reservation_id>/',
        edit_reservation,
        name='edit_reservation'
    ),
    path(
        'cancel-reservation/<int:reservation_id>/',
        cancel_reservation,
        name='cancel_reservation'
    ),
]
