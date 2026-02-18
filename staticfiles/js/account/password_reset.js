document.addEventListener('DOMContentLoaded', function() {
    // Form submission loading state
    const form = document.querySelector('.auth-form');
    const submitBtn = document.getElementById('resetBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (form && submitBtn) {
        form.addEventListener('submit', function() {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        });
    }
    
    // Add form control classes to Django form fields
    const formControls = document.querySelectorAll('input:not([type="checkbox"])');
    formControls.forEach(function(input) {
        input.classList.add('form-control');
        
        // Add placeholder text
        if (input.name === 'email') {
            input.placeholder = 'Enter your email address';
        }
    });
});