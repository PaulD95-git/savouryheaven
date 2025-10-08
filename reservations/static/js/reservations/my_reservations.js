// my_reservations.js
let currentReservationId = null;

// Modal Functions
function showCancelModal(reservationId, date, time) {
    console.log('✅ showCancelModal called with:', reservationId, date, time);
    currentReservationId = reservationId;
    
    // Update modal content
    document.getElementById('modalDate').textContent = date;
    document.getElementById('modalTime').textContent = time;
    
    // Show modal
    document.getElementById('cancelModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideCancelModal() {
    document.getElementById('cancelModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentReservationId = null;
}

function confirmCancel() {
    if (!currentReservationId) {
        console.error('❌ No reservation ID found');
        return;
    }
    
    console.log('🔔 Confirming cancellation for:', currentReservationId);
    
    // Get CSRF token
    const csrfToken = getCSRFToken();
    
    if (!csrfToken) {
        console.error('❌ CSRF token not found');
        alert('Security error. Please refresh the page and try again.');
        return;
    }
    
    // Send AJAX request
    fetch(`/cancel-reservation/${currentReservationId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `reservation_id=${currentReservationId}`
    })
    .then(response => {
        if (response.ok) {
            console.log('✅ Reservation cancelled successfully');
            // Success - reload page to see updated reservations
            window.location.reload();
        } else {
            console.error('❌ Cancellation failed:', response.status);
            alert('Failed to cancel reservation. Please try again.');
        }
    })
    .catch(error => {
        console.error('❌ Cancellation error:', error);
        alert('Error cancelling reservation. Please try again.');
    })
    .finally(() => {
        hideCancelModal();
    });
}

// Helper function to get CSRF token
function getCSRFToken() {
    const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfInput) {
        return csrfInput.value;
    }
    
    // Alternative: check for CSRF token in cookies
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    
    return cookieValue || null;
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    console.log('📁 External JS loaded');
    
    // Close modal when clicking outside content
    const modal = document.getElementById('cancelModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                hideCancelModal();
            }
        });
    }
    
    // Animation handling
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-delay').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });

    document.querySelectorAll('.fade-in-delay').forEach(element => {
        element.style.transitionDelay = '0.3s';
    });
});