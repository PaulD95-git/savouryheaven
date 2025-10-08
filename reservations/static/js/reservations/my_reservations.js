// my_reservations.js - FRESH VERSION
console.log('✅ FRESH JS FILE LOADED - Version 3');

let currentReservationId = null;

function showCancelModal(reservationId, date, time) {
    console.log('🔄 showCancelModal called with:', reservationId, date, time);
    console.log('📍 Looking for modal elements...');
    
    currentReservationId = reservationId;
    
    // Find modal elements
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');
    const modal = document.getElementById('cancelModal');
    
    console.log('📍 Found elements:', { modalDate, modalTime, modal });
    
    if (modalDate && modalTime && modal) {
        modalDate.textContent = date;
        modalTime.textContent = time;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal opened successfully');
    } else {
        console.error('❌ Modal elements not found');
        alert('Error: Could not open cancellation modal. Please refresh the page.');
    }
}

function hideCancelModal() {
    const modal = document.getElementById('cancelModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentReservationId = null;
    }
}

function confirmCancel() {
    if (!currentReservationId) return;
    
    console.log('🔔 Confirming cancellation for:', currentReservationId);
    
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    
    fetch(`/cancel-reservation/${currentReservationId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            alert('Failed to cancel reservation. Please try again.');
        }
    })
    .catch(error => {
        alert('Error cancelling reservation. Please try again.');
    })
    .finally(() => {
        hideCancelModal();
    });
}

// Only animations
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded - animations ready');
    
    const modal = document.getElementById('cancelModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) hideCancelModal();
        });
    }
});