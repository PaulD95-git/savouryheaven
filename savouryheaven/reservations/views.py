from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from datetime import datetime
from django.contrib import messages
from .forms import ReservationForm, UserProfileForm
from .models import TimeSlot, Reservation
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm



def index(request):
    return render(request, 'index.html')


@login_required
def reservation_view(request):
    """
    Handle reservation booking form submission and display.

    GET: Display empty reservation form
    POST: Process form submission and create reservation

    Args:
        request: HTTP request object

    Returns:
        HttpResponse: Rendered booking form or redirect to success page
    """
    if request.method == 'POST':
        form = ReservationForm(request.POST)

        if form.is_valid():
            try:
                # Create reservation instance without saving to database yet
                reservation = form.save(commit=False)

                # Associate user with reservation if authenticated
                if request.user.is_authenticated:
                    reservation.user = request.user
                else:
                    reservation.user = None  # Allow anonymous bookings

                # Calculate total guests already booked for this time slot
                existing_bookings = Reservation.objects.filter(
                    date=reservation.date,
                    time_slot=reservation.time_slot,
                    is_cancelled=False
                )
                total_booked_guests = sum(
                    booking.guests for booking in existing_bookings
                )

                # Check if new booking would exceed time slot capacity
                max_capacity = reservation.time_slot.max_capacity
                if total_booked_guests + reservation.guests > max_capacity:
                    # Calculate remaining spots and show error message
                    remaining = max_capacity - total_booked_guests
                    error_msg = (
                        f'Only {remaining} guest spots left in this time slot.'
                        'Please choose another time or reduce your party size.'
                    )
                    messages.error(request, error_msg)

                    return render(request, 'reservations/book.html', {
                        'form': form,
                        'page_title': 'Book a Table'
                    })

                # Save reservation to database
                reservation.save()

                # Store reservation ID in session for anonymous users
                if not request.user.is_authenticated:
                    request.session['last_reservation_id'] = reservation.id

                messages.success(request, 'Reservation confirmed!')
                return redirect('booking_success')

            except Exception as e:
                # Handle any database or other errors during reservation
                error_msg = f'Error saving reservation: {str(e)}'
                messages.error(request, error_msg)
        else:
            # Display form validation errors
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        # GET request - display empty form
        form = ReservationForm()

    return render(request, 'reservations/book.html', {
        'form': form,
        'page_title': 'Book a Table'
    })


@login_required
def success_view(request):
    """
    Display reservation success confirmation page.

    Shows the user's most recent reservation details.
    For authenticated users, gets latest reservation from database.
    For anonymous users, gets reservation from session data.

    Args:
        request: HTTP request object

    Returns:
        HttpResponse: Rendered success page or redirect to home
    """
    reservation = None

    if request.user.is_authenticated:
        # For logged-in users, get their latest reservation
        reservation = (
            Reservation.objects
            .filter(user=request.user)
            .order_by('-created_at')
            .first()
        )
    else:
        # For anonymous users, try to get reservation from session
        reservation_id = request.session.get('last_reservation_id')
        if reservation_id:
            try:
                reservation = Reservation.objects.get(id=reservation_id)
            except Reservation.DoesNotExist:
                reservation = None

    # If no reservation found, redirect with warning message
    if not reservation:
        messages.warning(request, "No reservation found to display")
        return redirect('home')  # Redirect to home or appropriate page

    # Clear session data after displaying success page
    if 'last_reservation_id' in request.session:
        del request.session['last_reservation_id']

    return render(request, 'reservations/success.html', {
        'reservation': reservation
    })


@login_required
def get_available_slots(request):
    """
    API endpoint to get available time slots for a specific date.

    Returns JSON data about time slot availability including:
    - Slot ID and display name
    - Whether slot is available
    - Number of remaining spots

    Args:
        request: HTTP request object with 'date' parameter

    Returns:
        JsonResponse: Available slots data or error message
    """
    date_str = request.GET.get('date')

    # Validate and parse the date parameter
    try:
        selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        return JsonResponse(
            {'error': 'Invalid date format. Expected YYYY-MM-DD'},
            status=400
        )

    # Get all active time slots ordered by start time
    time_slots = TimeSlot.objects.filter(
        is_active=True
    ).order_by('start_time')

    available_slots = []

    for slot in time_slots:
        # Calculate total guests already booked for this time slot
        existing_bookings = Reservation.objects.filter(
            date=selected_date,
            time_slot=slot,
            is_cancelled=False
        )

        # Sum up all guests from existing bookings
        total_booked_guests = sum(
            booking.guests for booking in existing_bookings
        )

        # Calculate remaining capacity
        remaining_capacity = slot.max_capacity - total_booked_guests

        # Ensure remaining capacity doesn't go below 0
        remaining_capacity = max(0, remaining_capacity)

        # Build slot data for JSON response
        slot_data = {
            'id': slot.id,
            'display_name': slot.display_name,
            'available': remaining_capacity > 0,
            'remaining_slots': remaining_capacity
        }

        available_slots.append(slot_data)

    return JsonResponse({'available_slots': available_slots})


@login_required
def my_reservations(request):
    reservations = Reservation.objects.filter(
        user=request.user
    ).order_by('-date', 'time_slot__start_time')

    return render(request, 'reservations/my_reservations.html', {
        'reservations': reservations
    })


@login_required
def edit_reservation(request, reservation_id):
    """
    Handle reservation editing form submission and display.

    GET: Display pre-filled reservation form
    POST: Process form submission and update reservation

    Args:
        request: HTTP request object
        reservation_id: ID of the reservation to edit

    Returns:
        HttpResponse: Rendered edit form or redirect to success page
    """
    try:
        reservation = Reservation.objects.get(id=reservation_id, user=request.user)
    except Reservation.DoesNotExist:
        messages.error(request, "Reservation not found or you don't have permission to edit it.")
        return redirect('my_reservations')

    if request.method == 'POST':
        form = ReservationForm(request.POST, instance=reservation)

        if form.is_valid():
            try:
                # Create reservation instance without saving to database yet
                updated_reservation = form.save(commit=False)

                # Check if time slot or date has changed
                if (updated_reservation.date != reservation.date or
                        updated_reservation.time_slot != reservation.time_slot):

                    # Calculate total guests already booked for this time slot
                    existing_bookings = Reservation.objects.filter(
                        date=updated_reservation.date,
                        time_slot=updated_reservation.time_slot,
                        is_cancelled=False
                    ).exclude(id=reservation.id)  # Exclude current reservation

                    total_booked_guests = sum(
                        booking.guests for booking in existing_bookings
                    )

                    # Check if new booking would exceed time slot capacity
                    max_capacity = updated_reservation.time_slot.max_capacity
                    if total_booked_guests + updated_reservation.guests > max_capacity:
                        # Calculate remaining spots and show error message
                        remaining = max_capacity - total_booked_guests
                        error_msg = (
                            f'Only {remaining} guest spots left in this time slot. '
                            'Please choose another time or reduce your party size.'
                        )
                        messages.error(request, error_msg)

                        return render(request, 'reservations/edit_reservation.html', {
                            'form': form,
                            'reservation': reservation,
                            'page_title': 'Edit Reservation'
                        })

                # Save reservation to database
                updated_reservation.save()

                messages.success(request, 'Reservation updated successfully!')
                return redirect('my_reservations')

            except Exception as e:
                # Handle any database or other errors during reservation update
                error_msg = f'Error updating reservation: {str(e)}'
                messages.error(request, error_msg)
        else:
            # Display form validation errors
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        # GET request - display pre-filled form
        form = ReservationForm(instance=reservation)

    return render(request, 'reservations/edit_reservation.html', {
        'form': form,
        'reservation': reservation,
        'page_title': 'Edit Reservation'
    })



@login_required
@require_POST
def cancel_reservation(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id, user=request.user)

    if not reservation.is_cancelled:
        reservation.is_cancelled = True
        reservation.save()
        messages.success(request, 'Your reservation has been cancelled successfully.')
    else:
        messages.warning(request, 'This reservation was already cancelled.')

    return redirect('my_reservations')


@login_required
def edit_profile(request):
    if request.method == 'POST':
        # Handle profile update
        if 'update_profile' in request.POST:
            profile_form = UserProfileForm(request.POST, instance=request.user)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, 'Your profile was successfully updated!')
                return redirect('edit_profile')

        # Handle password change
        elif 'change_password' in request.POST:
            password_form = PasswordChangeForm(request.user, request.POST)
            if password_form.is_valid():
                user = password_form.save()
                update_session_auth_hash(request, user)  # Important to keep the user logged in
                messages.success(request, 'Your password was successfully updated!')
                return redirect('edit_profile')
            else:
                messages.error(request, 'Please correct the error below.')
    else:
        profile_form = UserProfileForm(instance=request.user)
        password_form = PasswordChangeForm(request.user)

    return render(request, 'account/edit_profile.html', {
        'profile_form': profile_form,
        'password_form': password_form,
    })
