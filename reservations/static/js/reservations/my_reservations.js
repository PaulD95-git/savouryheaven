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

// Modal functionality
function showCancelModal(reservationId, date, time) {
    document.getElementById('modalDate').textContent = date;
    document.getElementById('modalTime').textContent = time;
    // Set the form action to the correct cancel URL
    document.getElementById('cancelForm').action = "{% url 'cancel_reservation' 0 %}".replace('0', reservationId);
    document.getElementById('cancelModal').style.display = 'block';
}

function hideCancelModal() {
    document.getElementById('cancelModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cancelModal');
    if (event.target == modal) {
        hideCancelModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideCancelModal();
    }
});