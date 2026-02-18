// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing reservation manager');
    
    // Get modal elements
    const modal = document.getElementById('deleteModal');
    const closeBtn = document.getElementById('closeModal');
    const keepBtn = document.getElementById('keepReservationBtn');
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');
    const deleteForm = document.getElementById('deleteForm');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // Get all delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    console.log(`Found ${deleteButtons.length} delete buttons`);
    
    // Add click event to each delete button
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Delete button clicked');
            
            // Get reservation details from data attributes
            const reservationId = this.getAttribute('data-reservation-id');
            const reservationDate = this.getAttribute('data-reservation-date');
            const reservationTime = this.getAttribute('data-reservation-time');
            
            console.log('Reservation details:', {reservationId, reservationDate, reservationTime});
            
            if (!reservationId) {
                console.error('No reservation ID found');
                return;
            }
            
            // Update modal with reservation details
            if (modalDate) modalDate.textContent = reservationDate;
            if (modalTime) modalTime.textContent = reservationTime;
            
            // Update form action with correct reservation ID
            if (deleteForm) {
                deleteForm.action = `/delete-reservation/${reservationId}/`;
                console.log('Form action set to:', deleteForm.action);
            }
            
            // Show the modal
            if (modal) {
                modal.style.display = 'block';
                // Prevent body from scrolling when modal is open
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal when clicking the close button (X)
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal(modal);
        });
    }
    
    // Close modal when clicking "Keep Reservation" button
    if (keepBtn) {
        keepBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(modal);
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal(modal);
        }
    });
    
    // Function to close modal
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Add loading state to confirm delete button
    if (deleteForm) {
        deleteForm.addEventListener('submit', function(e) {
            if (confirmDeleteBtn) {
                confirmDeleteBtn.disabled = true;
                confirmDeleteBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Deleting...';
            }
        });
    }
    
    // Add CSS for loading spinner if not present
    addSpinnerStyles();
    
    function addSpinnerStyles() {
        if (!document.getElementById('reservation-spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'reservation-spinner-styles';
            style.textContent = `
                .btn-confirm:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    position: relative;
                }
                
                .btn-confirm:disabled i {
                    animation: spin 1s linear infinite;
                    display: inline-block;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .modal {
                    display: none;
                }
                
                .modal.show {
                    display: block;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Add animation delays to cards
    const cards = document.querySelectorAll('.reservation-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
    });
    
    // Add fadeInUp animation if not present
    if (!document.getElementById('fadeInUp-animation')) {
        const style = document.createElement('style');
        style.id = 'fadeInUp-animation';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
});