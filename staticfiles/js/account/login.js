document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.querySelector('input[name="password"]');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                toggleIcon.className = 'bi bi-eye-slash';
            } else {
                toggleIcon.className = 'bi bi-eye';
            }
        });
    }
    
    // Form submission loading state
    const form = document.querySelector('.auth-form');
    const submitBtn = document.getElementById('loginBtn');
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
        if (input.name === 'login') {
            input.placeholder = 'Enter your email or username';
        } else if (input.name === 'password') {
            input.placeholder = 'Enter your password';
        }
    });
    
    // Checkbox styling
    const checkbox = document.querySelector('input[name="remember"]');
    if (checkbox) {
        checkbox.classList.add('custom-checkbox-input');
    }
});