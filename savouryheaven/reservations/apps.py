from django.apps import AppConfig


class ReservationsConfig(AppConfig):
    """Django application configuration for the reservations app."""

    # Use BigAutoField as the default primary key type
    default_auto_field = 'django.db.models.BigAutoField'

    # Name of the Django application
    name = 'reservations'
