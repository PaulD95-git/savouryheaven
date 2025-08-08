from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ReservationForm


def reservation_view(request):
    """
    Handles the reservation form display and submission.

    GET: Shows empty booking form with available time slots
    POST: Processes form data, saves reservation, and redirects to success page
    """
    if request.method == 'POST':
        form = ReservationForm(request.POST)
        if form.is_valid():
            try:
                reservation = form.save(commit=False)
                if request.user.is_authenticated:
                    reservation.user = request.user
                reservation.save()
                messages.success(request, 'Reservation confirmed!')
                return redirect('booking_success')
            except Exception as e:
                messages.error(request, f'Error saving reservation: {str(e)}')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ReservationForm()

    return render(request, 'reservations/book.html', {
        'form': form,
        'page_title': 'Book a Table'
    })


def success_view(request):
    """Display reservation success confirmation page."""
    return render(request, 'reservations/success.html')
