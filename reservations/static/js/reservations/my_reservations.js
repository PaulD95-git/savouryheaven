// Make sure functions are available globally
window.showCancelModal = showCancelModal;
window.hideCancelModal = hideCancelModal;

// Modal functionality
function showCancelModal(reservationId, date, time) {
    console.log('✅ showCancelModal called with:', { reservationId, date, time });
    
    // Check if elements exist
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');
    const cancelForm = document.getElementById('cancelForm');
    const modal = document.getElementById('cancelModal');
    
    if (!modalDate || !modalTime || !cancelForm || !modal) {
        console.error('❌ Modal elements not found!');
        console.log('modalDate:', modalDate);
        console.log('modalTime:', modalTime);
        console.log('cancelForm:', cancelForm);
        console.log('modal:', modal);
        return;
    }
    
    modalDate.textContent = date;
    modalTime.textContent = time;
    
    // Build URL correctly
    const cancelUrl = `/cancel-reservation/${reservationId}/`;
    console.log('✅ Setting form action to:', cancelUrl);
    cancelForm.action = cancelUrl;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal should be visible now');
}

function hideCancelModal() {
    const modal = document.getElementById('cancelModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('cancelModal');
    if (event.target === modal) {
        hideCancelModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideCancelModal();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ My Reservations JS loaded');
    
    // Intersection Observer for fade-in animations
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

    // Observe fade-in elements
    document.querySelectorAll('.fade-in, .fade-in-delay').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });

    // Add delay to fade-in-delay elements
    document.querySelectorAll('.fade-in-delay').forEach(element => {
        element.style.transitionDelay = '0.3s';
    });
    
    // Test if functions are available
    console.log('✅ showCancelModal available:', typeof showCancelModal);
    console.log('✅ hideCancelModal available:', typeof hideCancelModal);
});