document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggles
    function setupPasswordToggle(toggleId, inputName, iconId) {
        const toggle = document.getElementById(toggleId);
        const input = document.querySelector(`input[name="${inputName}"]`);
        const icon = document.getElementById(iconId);
        
        if (toggle && input && icon) {
            toggle.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                icon.className = type === 'text' ? 'bi bi-eye-slash' : 'bi bi-eye';
            });
        }
    }
    
    setupPasswordToggle('togglePassword1', 'password1', 'toggleIcon1');
    setupPasswordToggle('togglePassword2', 'password2', 'toggleIcon2');
    
    // Password strength indicator
    const password1 = document.querySelector('input[name="password1"]');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (password1 && strengthFill && strengthText) {
        password1.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            strengthFill.style.width = strength.percentage + '%';
            strengthFill.className = 'strength-fill ' + strength.class;
            strengthText.textContent = strength.text;
        });
    }
    
    // Password match indicator
    const password2 = document.querySelector('input[name="password2"]');
    const passwordMatch = document.getElementById('passwordMatch');
    
    if (password1 && password2 && passwordMatch) {
        password2.addEventListener('input', function() {
            if (this.value && password1.value === this.value) {
                passwordMatch.style.display = 'block';
            } else {
                passwordMatch.style.display = 'none';
            }
        });
    }
    
    // Terms checkbox validation
    const agreeTerms = document.getElementById('agreeTerms');
    const submitBtn = document.getElementById('signupBtn');
    
    if (agreeTerms && submitBtn) {
        agreeTerms.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
    }
    
    // Form submission loading state
    const form = document.querySelector('.auth-form');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (form && submitBtn) {
        form.addEventListener('submit', function() {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
        });
    }
    
    // Add form control classes and placeholders
    const formControls = document.querySelectorAll('input:not([type="checkbox"])');
    formControls.forEach(function(input) {
        input.classList.add('form-control');
        
        // Add placeholder text
        const placeholders = {
            'username': 'Choose a unique username',
            'email': 'Enter your email address',
            'first_name': 'Enter your first name',
            'last_name': 'Enter your last name',
            'password1': 'Create a secure password',
            'password2': 'Confirm your password'
        };
        
        if (placeholders[input.name]) {
            input.placeholder = placeholders[input.name];
        }
    });
});

// Password strength calculation
function calculatePasswordStrength(password) {
    if (!password) {
        return { percentage: 0, class: '', text: 'Enter a password' };
    }
    
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score < 3) {
        return { percentage: 25, class: 'weak', text: 'Weak password' };
    } else if (score < 4) {
        return { percentage: 50, class: 'fair', text: 'Fair password' };
    } else if (score < 5) {
        return { percentage: 75, class: 'good', text: 'Good password' };
    } else {
        return { percentage: 100, class: 'strong', text: 'Strong password' };
    }
}