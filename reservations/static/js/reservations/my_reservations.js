// Reservation management functionality
class ReservationManager {
    constructor() {
        this.currentReservationId = null;
        this.cancelForm = document.getElementById('cancelForm');
        this.confirmBtn = document.getElementById('confirmCancelBtn');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupModalHandlers();
    }

    bindEvents() {
        // Bind cancel buttons
        document.querySelectorAll('.btn-cancel').forEach(button => {
            button.addEventListener('click', (e) => {
                this.showCancelModal(e.target);
            });
        });

        // Bind form submission
        if (this.cancelForm) {
            this.cancelForm.addEventListener('submit', (e) => {
                this.handleFormSubmission(e);
            });
        }
    }

    setupModalHandlers() {
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('cancelModal');
            if (e.target === modal) {
                this.hideCancelModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCancelModal();
            }
        });
    }

    showCancelModal(button) {
        this.currentReservationId = button.getAttribute('data-reservation-id');
        const date = button.getAttribute('data-reservation-date');
        const time = button.getAttribute('data-reservation-time');
        
        // Set modal content
        document.getElementById('modalDate').textContent = date;
        document.getElementById('modalTime').textContent = time;
        
        // Set form action URL
        this.cancelForm.action = `/cancel-reservation/${this.currentReservationId}/`;
        
        // Show modal
        const modal = document.getElementById('cancelModal');
        modal.style.display = 'block';
        
        // Reset confirm button state
        this.resetConfirmButton();
    }

    hideCancelModal() {
        const modal = document.getElementById('cancelModal');
        modal.style.display = 'none';
        this.currentReservationId = null;
        this.resetConfirmButton();
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        if (!this.currentReservationId) {
            console.error('No reservation ID selected');
            return;
        }

        // Show loading state
        this.setLoadingState();

        // Submit the form
        this.submitCancellation();
    }

    setLoadingState() {
        this.confirmBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Cancelling...';
        this.confirmBtn.disabled = true;
        
        // Disable cancel button too
        const cancelBtn = document.querySelector('.btn-modal-cancel');
        cancelBtn.disabled = true;
    }

    resetConfirmButton() {
        this.confirmBtn.innerHTML = '<i class="bi bi-check-lg"></i> Yes, Cancel Reservation';
        this.confirmBtn.disabled = false;
        
        // Re-enable cancel button
        const cancelBtn = document.querySelector('.btn-modal-cancel');
        cancelBtn.disabled = false;
    }

    submitCancellation() {
        // Create a fetch request to submit the form
        const formData = new FormData(this.cancelForm);
        
        fetch(this.cancelForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then(response => {
            if (response.redirected) {
                // If redirected, follow the redirect
                window.location.href = response.url;
            } else {
                return response.json().then(data => {
                    if (data.success) {
                        // Reload the page to show updated reservation status
                        window.location.reload();
                    } else {
                        throw new Error(data.error || 'Cancellation failed');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error cancelling reservation:', error);
            this.showError('Failed to cancel reservation. Please try again.');
            this.resetConfirmButton();
        });
    }
}

// CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .modal-actions .btn-confirm:disabled,
    .modal-actions .btn-modal-cancel:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .messages-container {
        margin-bottom: 2rem;
    }
    
    .alert {
        border-radius: 12px;
        border: 1px solid rgba(212, 175, 55, 0.3);
        background: rgba(99, 50, 68, 0.3);
        color: var(--cream);
    }
    
    .alert-success {
        border-color: rgba(76, 175, 80, 0.3);
    }
    
    .alert-danger {
        border-color: rgba(244, 67, 54, 0.3);
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ReservationManager();
    
    // Add smooth animations for page elements
    const cards = document.querySelectorAll('.reservation-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});