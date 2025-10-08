// Reservation management functionality
class ReservationManager {
    constructor() {
        this.currentReservationId = null;
        this.cancelForm = document.getElementById('cancelForm');
        this.confirmBtn = document.getElementById('confirmCancelBtn');
        this.modal = document.getElementById('cancelModal');
        this.closeBtn = document.getElementById('closeModal');
        this.keepBtn = document.getElementById('keepReservationBtn');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupModalHandlers();
        this.addSpinnerStyles();
    }

    bindEvents() {
        // Bind cancel buttons using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-cancel') || e.target.closest('.btn-cancel')) {
                const button = e.target.classList.contains('btn-cancel') ? e.target : e.target.closest('.btn-cancel');
                this.showCancelModal(button);
            }
        });
    }

    setupModalHandlers() {
        // Close modal events
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hideCancelModal());
        }
        
        if (this.keepBtn) {
            this.keepBtn.addEventListener('click', () => this.hideCancelModal());
        }

        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideCancelModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.hideCancelModal();
            }
        });

        // Form submission
        if (this.cancelForm) {
            this.cancelForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    showCancelModal(button) {
        console.log('Show modal called with:', button);
        
        this.currentReservationId = button.getAttribute('data-reservation-id');
        const date = button.getAttribute('data-reservation-date');
        const time = button.getAttribute('data-reservation-time');
        
        console.log('Reservation ID:', this.currentReservationId, 'Date:', date, 'Time:', time);
        
        if (!this.currentReservationId) {
            console.error('No reservation ID found on button');
            return;
        }
        
        // Set modal content
        document.getElementById('modalDate').textContent = date;
        document.getElementById('modalTime').textContent = time;
        
        // Show modal
        this.modal.style.display = 'block';
        
        // Reset confirm button state
        this.resetConfirmButton();
    }

    hideCancelModal() {
        console.log('Hide modal called');
        this.modal.style.display = 'none';
        this.currentReservationId = null;
        this.resetConfirmButton();
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        console.log('Form submission, current ID:', this.currentReservationId);
        
        if (!this.currentReservationId) {
            console.error('No reservation ID selected for cancellation');
            alert('No reservation selected. Please try again.');
            return;
        }

        // Show loading state
        this.setLoadingState();

        // Submit the cancellation via fetch
        this.submitCancellation();
    }

    setLoadingState() {
        if (this.confirmBtn) {
            this.confirmBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Cancelling...';
            this.confirmBtn.disabled = true;
        }
        
        // Disable cancel button too
        if (this.keepBtn) {
            this.keepBtn.disabled = true;
        }
    }

    resetConfirmButton() {
        if (this.confirmBtn) {
            this.confirmBtn.innerHTML = '<i class="bi bi-check-lg"></i> Yes, Cancel Reservation';
            this.confirmBtn.disabled = false;
        }
        
        // Re-enable cancel button
        if (this.keepBtn) {
            this.keepBtn.disabled = false;
        }
    }

    submitCancellation() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const url = `/cancel-reservation/${this.currentReservationId}/`;
        
        console.log('Submitting cancellation to:', url);
        
        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (response.ok) {
                // Success - reload the page to show updated status
                window.location.reload();
            } else {
                throw new Error(`Cancellation failed with status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Error cancelling reservation:', error);
            this.showError('Failed to cancel reservation. Please try again.');
            this.resetConfirmButton();
        });
    }

    showError(message) {
        alert(message);
    }

    addSpinnerStyles() {
        if (!document.getElementById('reservation-spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'reservation-spinner-styles';
            style.textContent = `
                .spin {
                    animation: spin 1s linear infinite;
                    display: inline-block;
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
                
                .modal {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing ReservationManager...');
    new ReservationManager();
    
    // Add smooth animations for page elements
    const cards = document.querySelectorAll('.reservation-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});