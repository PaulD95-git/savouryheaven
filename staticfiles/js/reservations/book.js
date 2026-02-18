/* ============================================= */
/* DOM Content Loaded - Main Initialization */
/* ============================================= */
document.addEventListener('DOMContentLoaded', function() {
    /* ============================================= */
    /* Form Element References */
    /* ============================================= */
    const form = document.getElementById('reservationForm');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    const timeSlotInput = document.getElementById('id_time_slot');
    const dateInput = document.getElementById('id_date');
    const guestCount = document.getElementById('guestCount');
    const guestInput = document.getElementById('id_guests');
    const decreaseBtn = document.getElementById('decreaseGuests');
    const increaseBtn = document.getElementById('increaseGuests');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');

    /* ============================================= */
    /* Date Input Configuration */
    /* ============================================= */
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    /* ============================================= */
    /* Guest Counter Functionality */
    /* ============================================= */
    // Initialize guest counter
    let currentGuests = 2;
    updateGuestCount();

    // Decrease guest count handler
    decreaseBtn.addEventListener('click', () => {
        if (currentGuests > 1) {
            currentGuests--;
            updateGuestCount();
        }
    });

    // Increase guest count handler
    increaseBtn.addEventListener('click', () => {
        if (currentGuests < 20) {
            currentGuests++;
            updateGuestCount();
        }
    });

    // Update guest count display and input value
    function updateGuestCount() {
        guestCount.textContent = currentGuests;
        guestInput.value = currentGuests;
        decreaseBtn.disabled = currentGuests <= 1;
        increaseBtn.disabled = currentGuests >= 20;
    }

    /* ============================================= */
    /* Time Slot Validation Utilities */
    /* ============================================= */
    /**
     * Checks if a time slot is in the past relative to current time
     * @param {string} slotTime - The time slot to check
     * @param {string} selectedDate - The selected date in YYYY-MM-DD format
     * @returns {boolean} True if the time slot is in the past
     */
    function isTimeSlotInPast(slotTime, selectedDate) {
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);
    
    // If selected date is not today, no slots are in the past
    if (selectedDateObj.toDateString() !== now.toDateString()) {
        return false;
    }
    
    // Parse the slot time
    let hours, minutes;
    
    if (slotTime.includes('PM') || slotTime.includes('AM')) {
        // 12-hour format (e.g., "6:30 PM", "12:00 AM", "12:30 PM")
        const parts = slotTime.trim().split(' ');
        if (parts.length !== 2) {
            console.error('Unexpected time format:', slotTime);
            return false;
        }
        
        const [time, period] = parts;
        const timeParts = time.split(':');
        if (timeParts.length !== 2) {
            console.error('Unexpected time part format:', time);
            return false;
        }
        
        [hours, minutes] = timeParts.map(Number);
        
        // Convert 12-hour to 24-hour format
        if (period === 'PM') {
            if (hours !== 12) {
                hours += 12;
            }
            // 12 PM stays as 12 (noon)
        } else if (period === 'AM') {
            if (hours === 12) {
                hours = 0; // 12 AM becomes 0:00 (midnight)
            }

        }
    } else {
        // 24-hour format (e.g., "18:30")
        const timeParts = slotTime.split(':');
        [hours, minutes] = timeParts.map(Number);
    }
    
    // Create the slot time as a Date object
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    // Add buffer (30 minutes) - no booking within 30 mins
    const bufferMs = 30 * 60 * 1000;
    const currentTimeWithBuffer = now.getTime() + bufferMs;
    
    return slotDateTime.getTime() < currentTimeWithBuffer;
    }

    /* ============================================= */
    /* Time Slot Selection Handlers */
    /* ============================================= */
    /**
     * Handles time slot selection
     * @param {HTMLElement} element - The clicked time slot element
     * @param {string} slotId - The ID of the selected time slot
     */
    function selectTimeSlot(element, slotId) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Select current slot
        element.classList.add('selected');
        timeSlotInput.value = slotId;
        
        // Clear any time slot error
        const timeSlotError = document.querySelector('#id_time_slot + .field-error');
        if (timeSlotError) timeSlotError.remove();
    }

    /* ============================================= */
    /* Time Slot Loading and Rendering */
    /* ============================================= */
    /**
     * Loads available time slots for the selected date from the API
     * @param {string} date - The date in YYYY-MM-DD format
     */
    async function loadTimeSlots(date) {
        try {
            timeSlotsContainer.innerHTML = '<div class="time-slot">Loading available times...</div>';
            
            const response = await fetch(`/api/available-slots/?date=${date}`);
            const data = await response.json();
            
            if (response.ok) {
                renderTimeSlots(data.available_slots);
            } else {
                timeSlotsContainer.innerHTML = '<div class="time-slot unavailable">Error loading times</div>';
            }
        } catch (error) {
            timeSlotsContainer.innerHTML = '<div class="time-slot unavailable">Network error</div>';
        }
    }

    /**
     * Renders available time slots to the UI
     * @param {Array} slots - Array of time slot objects
     */
    function renderTimeSlots(slots) {
        timeSlotsContainer.innerHTML = '';
        timeSlotInput.value = '';
        
        if (!slots || slots.length === 0) {
            timeSlotsContainer.innerHTML = '<div class="time-slot unavailable">No available times</div>';
            return;
        }
        
        const selectedDate = dateInput.value;
        
        slots.forEach(slot => {
            const slotElement = document.createElement('div');
            
            // Check if this time slot is in the past
            const isPastSlot = isTimeSlotInPast(slot.display_name, selectedDate);
            
            // Determine the class based on availability and time
            let slotClass = 'time-slot';
            if (!slot.available || isPastSlot) {
                slotClass += ' unavailable';
                if (isPastSlot) {
                    slotClass += ' past-time';
                }
            }
            
            slotElement.className = slotClass;
            
            // Create availability indicator
            const availabilityIndicator = document.createElement('div');
            availabilityIndicator.className = 'time-slot-availability';
            
            // Set indicator content based on slot status
            if (isPastSlot) {
                availabilityIndicator.classList.add('past');
                availabilityIndicator.textContent = 'Time passed';
            } else if (slot.available && slot.remaining_slots <= 10) {
                availabilityIndicator.classList.add('remaining');
                availabilityIndicator.textContent = `${slot.remaining_slots} spots left`;
            } else if (!slot.available) {
                availabilityIndicator.classList.add('full');
                availabilityIndicator.textContent = 'Fully booked';
            } else if (slot.available) {
                availabilityIndicator.classList.add('available');
                availabilityIndicator.textContent = 'Available';
            }
            
            // Only append the indicator if there's something to show
            if (availabilityIndicator.textContent) {
                slotElement.appendChild(availabilityIndicator);
            } else {
                slotElement.classList.add('no-indicator');
            }
            
            // Create time display
            const timeDisplay = document.createElement('div');
            timeDisplay.className = 'time-display';
            timeDisplay.textContent = slot.display_name;
            slotElement.appendChild(timeDisplay);
            
            slotElement.dataset.slotId = slot.id;
            
            // Only make it clickable if it's available and not in the past
            if (slot.available && !isPastSlot) {
                slotElement.addEventListener('click', () => selectTimeSlot(slotElement, slot.id));
            }
            
            timeSlotsContainer.appendChild(slotElement);
        });
    }

    /* ============================================= */
    /* Event Listeners */
    /* ============================================= */
    // Date change handler
    dateInput.addEventListener('change', function() {
        if (this.value) {
            loadTimeSlots(this.value);
        } else {
            timeSlotsContainer.innerHTML = '<div class="time-slot">Please select a date first</div>';
        }
        
        // Clear any date error
        const dateError = document.querySelector('#id_date + .field-error');
        if (dateError) dateError.remove();
    });

    // Real-time field validation
    form.addEventListener('input', function(e) {
        const field = e.target;
        if (field.id && field.id.startsWith('id_')) {
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('field-error')) {
                errorElement.remove();
                field.style.borderColor = '#e9ecef';
            }
        }
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        loadingText.style.display = 'inline';
    });

    /* ============================================= */
    /* Initialization */
    /* ============================================= */
    updateGuestCount();
    
    // Add form field classes for styling
    const formControls = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea');
    formControls.forEach(control => {
        control.classList.add('form-control');
    });
});