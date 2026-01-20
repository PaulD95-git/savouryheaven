// Reservation management functionality
class ReservationManager {
    constructor() {
        this.currentReservationId = null;
        this.deleteForm = document.getElementById('deleteForm');
        this.confirmBtn = document.getElementById('confirmDeleteBtn');
        this.modal = document.getElementById('deleteModal');
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
        // Bind delete buttons using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete') || e.target.closest('.btn-delete')) {
                const button = e.target.classList.contains('btn-delete') ? e.target : e.target.closest('.btn-delete');
                this.showDeleteModal(button);
            }
        });
    }

    setupModalHandlers() {
        // Close modal events
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hideDeleteModal());
        }
        
        if (this.keepBtn) {
            this.keepBtn.addEventListener('click', () => this.hideDeleteModal());
        }

        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideDeleteModal();
                }
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
                this.hideDeleteModal();
            }
        });

        // Form submission
        if (this.deleteForm) {
            this.deleteForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    showDeleteModal(button) {
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

    hideDeleteModal() {
        console.log('Hide modal called');
        if (this.modal) {
            this.modal.style.display = 'none';
        }
        this.currentReservationId = null;
        this.resetConfirmButton();
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        console.log('Form submission, current ID:', this.currentReservationId);
        
        if (!this.currentReservationId) {
            console.error('No reservation ID selected for deletion');
            alert('No reservation selected. Please try again.');
            return;
        }

        // Show loading state
        this.setLoadingState();

        // Submit the deletion via fetch
        this.submitDeletion();
    }

    setLoadingState() {
        if (this.confirmBtn) {
            this.confirmBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Deleting...';
            this.confirmBtn.disabled = true;
        }
        
        // Disable keep button too
        if (this.keepBtn) {
            this.keepBtn.disabled = true;
        }
    }

    resetConfirmButton() {
        if (this.confirmBtn) {
            this.confirmBtn.innerHTML = '<i class="bi bi-trash"></i> Yes, Delete Reservation';
            this.confirmBtn.disabled = false;
        }
        
        // Re-enable keep button
        if (this.keepBtn) {
            this.keepBtn.disabled = false;
        }
    }

    submitDeletion() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const url = `/delete-reservation/${this.currentReservationId}/`;
        
        console.log('Submitting deletion to:', url);
        
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
                // Remove the card from DOM immediately for better UX
                const card = document.getElementById(`reservation-${this.currentReservationId}`);
                if (card) {
                    card.style.transition = 'opacity 0.3s, transform 0.3s';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.remove();
                        // Check if there are no more reservations
                        const remainingCards = document.querySelectorAll('.reservation-card');
                        if (remainingCards.length === 0) {
                            // Reload to show empty state
                            window.location.reload();
                        }
                    }, 300);
                }
                // Hide modal
                this.hideDeleteModal();
            } else {
                throw new Error(`Deletion failed with status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error('Error deleting reservation:', error);
            this.showError('Failed to delete reservation. Please try again.');
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