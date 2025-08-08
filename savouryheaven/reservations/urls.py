# reservations/urls.py
from django.urls import path
from .views import reservation_view, success_view

urlpatterns = [
    path('book/', reservation_view, name='book'),
    path('book/success/', success_view, name='booking_success'),
]
