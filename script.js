// Form validation and handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Basic validation
            if (!validateEmail(email)) {
                showMessage('Geçerli bir e-posta adresi girin', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Şifre en az 6 karakter olmalıdır', 'error');
                return;
            }
            
            // Simulate login process
            showLoading(true);
            
            setTimeout(() => {
                showLoading(false);
                showMessage('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
                
                // Store login info if remember is checked
                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Simulate redirect
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 2000);
        });
        
        // Load remembered email
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember').checked = true;
        }
    }
    
    // Register form handling
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            if (fullName.length < 2) {
                showMessage('Ad soyad en az 2 karakter olmalıdır', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showMessage('Geçerli bir e-posta adresi girin', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Şifre en az 6 karakter olmalıdır', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Şifreler eşleşmiyor', 'error');
                return;
            }
            
            if (!terms) {
                showMessage('Kullanım şartlarını kabul etmelisiniz', 'error');
                return;
            }
            
            // Simulate registration process
            showLoading(true);
            
            setTimeout(() => {
                showLoading(false);
                showMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }, 2000);
        });
    }
    
    // Add input animations
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show loading state
function showLoading(show) {
    const submitBtn = document.querySelector('.btn-primary');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading">Yükleniyor...</span>';
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Reset button text based on current page
        if (document.getElementById('loginForm')) {
            submitBtn.innerHTML = 'Giriş Yap';
        } else if (document.getElementById('registerForm')) {
            submitBtn.innerHTML = 'Kayıt Ol';
        }
    }
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        messageDiv.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
    } else if (type === 'error') {
        messageDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        messageDiv.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
    }
    
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 4000);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add particle effect on click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary')) {
        createRipple(e);
    }
});

function createRipple(event) {
    const button = event.target;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .input-group.focused label {
        color: rgba(255, 255, 255, 1);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
