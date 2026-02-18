// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded - initializing reservation manager');
    
    // Check if JavaScript file is loaded
    console.log('📁 JavaScript file loaded successfully');
    
    // Get all elements and log them
    const modal = document.getElementById('deleteModal');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const closeBtn = document.getElementById('closeModal');
    const keepBtn = document.getElementById('keepReservationBtn');
    const deleteForm = document.getElementById('deleteForm');
    
    console.log('🔍 Found elements:', {
        modal: modal ? '✅' : '❌',
        deleteButtons: deleteButtons.length,
        closeBtn: closeBtn ? '✅' : '❌',
        keepBtn: keepBtn ? '✅' : '❌',
        deleteForm: deleteForm ? '✅' : '❌'
    });
    
    if (deleteButtons.length === 0) {
        console.error('❌ No delete buttons found! Check if .btn-delete class exists');
        return;
    }
    
    // Add click event to each delete button
    deleteButtons.forEach((button, index) => {
        console.log(`🔧 Adding click listener to button ${index + 1}`);
        
        button.addEventListener('click', function(e) {
            console.log('🖱️ Delete button clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            // Get reservation details from data attributes
            const reservationId = this.getAttribute('data-reservation-id');
            const reservationDate = this.getAttribute('data-reservation-date');
            const reservationTime = this.getAttribute('data-reservation-time');
            
            console.log('📋 Reservation details:', {
                id: reservationId,
                date: reservationDate,
                time: reservationTime
            });
            
            if (!reservationId) {
                console.error('❌ No reservation ID found on button');
                alert('Error: No reservation ID found');
                return;
            }
            
            // Update modal with reservation details
            const modalDate = document.getElementById('modalDate');
            const modalTime = document.getElementById('modalTime');
            
            if (modalDate) {
                modalDate.textContent = reservationDate;
                console.log('📅 Updated modal date to:', reservationDate);
            } else {
                console.error('❌ modalDate element not found');
            }
            
            if (modalTime) {
                modalTime.textContent = reservationTime;
                console.log('⏰ Updated modal time to:', reservationTime);
            } else {
                console.error('❌ modalTime element not found');
            }
            
            // Update form action
            if (deleteForm) {
                const url = `/delete-reservation/${reservationId}/`;
                deleteForm.action = url;
                console.log('🔗 Form action set to:', url);
            } else {
                console.error('❌ deleteForm element not found');
            }
            
            // Show the modal
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                console.log('👆 Modal displayed');
            } else {
                console.error('❌ modal element not found');
            }
        });
    });
    
    // Close modal functionality
    function closeModal() {
        console.log('🔒 Closing modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            console.log('✖️ Close button clicked');
            e.preventDefault();
            closeModal();
        });
    } else {
        console.warn('⚠️ Close button not found');
    }
    
    // Keep button click
    if (keepBtn) {
        keepBtn.addEventListener('click', function(e) {
            console.log('🔁 Keep reservation button clicked');
            e.preventDefault();
            closeModal();
        });
    } else {
        console.warn('⚠️ Keep button not found');
    }
    
    // Click outside modal
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log('👆 Clicked outside modal');
            closeModal();
        }
    });
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            console.log('🔑 Escape key pressed');
            closeModal();
        }
    });
    
    // Form submission
    if (deleteForm) {
        deleteForm.addEventListener('submit', function(e) {
            console.log('📤 Form submitted for deletion');
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            if (confirmBtn) {
                confirmBtn.disabled = true;
                confirmBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Deleting...';
                console.log('⏳ Button disabled and text changed');
            }
        });
    }
    
    console.log('✅ Reservation manager initialization complete');
});