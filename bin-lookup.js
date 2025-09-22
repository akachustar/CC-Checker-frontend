// BIN Lookup JavaScript

// Sample BIN data for demonstration
const binDatabase = {
    '400000': {
        bin: '400000',
        brand: 'Visa',
        type: 'Debit',
        level: 'Classic',
        bank: 'Chase Bank',
        country: 'United States',
        currency: 'USD',
        prepaid: 'No'
    },
    '424242': {
        bin: '424242',
        brand: 'Visa',
        type: 'Credit',
        level: 'Classic',
        bank: 'Test Bank',
        country: 'United States',
        currency: 'USD',
        prepaid: 'No'
    },
    '510000': {
        bin: '510000',
        brand: 'Mastercard',
        type: 'Credit',
        level: 'Standard',
        bank: 'Bank of America',
        country: 'United States',
        currency: 'USD',
        prepaid: 'No'
    },
    '340000': {
        bin: '340000',
        brand: 'American Express',
        type: 'Credit',
        level: 'Gold',
        bank: 'American Express',
        country: 'United States',
        currency: 'USD',
        prepaid: 'No'
    },
    '450000': {
        bin: '450000',
        brand: 'Visa',
        type: 'Credit',
        level: 'Platinum',
        bank: 'Wells Fargo',
        country: 'United States',
        currency: 'USD',
        prepaid: 'Yes'
    },
    '520000': {
        bin: '520000',
        brand: 'Mastercard',
        type: 'Debit',
        level: 'World',
        bank: 'Citibank',
        country: 'United States',
        currency: 'USD',
        prepaid: 'No'
    }
};

// DOM Elements
const binInput = document.getElementById('binInput');
const lookupBtn = document.getElementById('lookupBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');

// Result elements
const resultBin = document.getElementById('resultBin');
const resultBrand = document.getElementById('resultBrand');
const resultType = document.getElementById('resultType');
const resultLevel = document.getElementById('resultLevel');
const resultBank = document.getElementById('resultBank');
const resultCountry = document.getElementById('resultCountry');
const resultCurrency = document.getElementById('resultCurrency');
const resultPrepaid = document.getElementById('resultPrepaid');

// Sound effects
let audioContext;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(frequency, duration, type = 'sine') {
    initAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playLookupStartSound() {
    // Blue theme sound - higher pitched
    playSound(800, 0.2);
    setTimeout(() => playSound(1000, 0.3), 100);
}

function playLookupCompleteSound() {
    // Success sound sequence
    playSound(600, 0.2);
    setTimeout(() => playSound(800, 0.2), 150);
    setTimeout(() => playSound(1000, 0.3), 300);
}

function playErrorSound() {
    // Error sound
    playSound(300, 0.5, 'sawtooth');
}

// Input validation
function validateBIN(bin) {
    // Remove spaces and non-digits
    const cleanBin = bin.replace(/\D/g, '');
    
    // Check if it's 6-8 digits
    if (cleanBin.length < 6 || cleanBin.length > 8) {
        return false;
    }
    
    return cleanBin;
}

// Format BIN input
function formatBINInput(value) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 8 digits
    return digits.substring(0, 8);
}

// BIN input formatting
binInput.addEventListener('input', function(e) {
    const formatted = formatBINInput(e.target.value);
    e.target.value = formatted;
});

// Enter key support
binInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performLookup();
    }
});

// Lookup button click
lookupBtn.addEventListener('click', performLookup);

// Main lookup function
function performLookup() {
    const binValue = binInput.value.trim();
    const validBin = validateBIN(binValue);
    
    if (!validBin) {
        showNotification('Please enter a valid BIN (6-8 digits)', 'error');
        playErrorSound();
        return;
    }
    
    // Start lookup process
    startLookup(validBin);
}

function startLookup(bin) {
    // Play start sound
    playLookupStartSound();
    
    // Show loading state
    lookupBtn.disabled = true;
    loadingSection.style.display = 'flex';
    resultsSection.style.display = 'none';
    
    // Simulate API call delay
    setTimeout(() => {
        performBINLookup(bin);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds
}

function performBINLookup(bin) {
    // Try to find exact match first
    let binData = binDatabase[bin];
    
    // If no exact match, try shorter prefixes
    if (!binData) {
        for (let i = bin.length - 1; i >= 6; i--) {
            const prefix = bin.substring(0, i);
            if (binDatabase[prefix]) {
                binData = { ...binDatabase[prefix], bin: bin };
                break;
            }
        }
    }
    
    // Hide loading
    loadingSection.style.display = 'none';
    lookupBtn.disabled = false;
    
    if (binData) {
        displayResults(binData);
        playLookupCompleteSound();
        showNotification('BIN lookup completed successfully!', 'success');
    } else {
        showNotification('BIN not found in database', 'error');
        playErrorSound();
        resultsSection.style.display = 'none';
    }
}

function displayResults(data) {
    // Populate result fields
    resultBin.textContent = data.bin;
    resultBrand.textContent = data.brand;
    resultType.textContent = data.type;
    resultLevel.textContent = data.level;
    resultBank.textContent = data.bank;
    resultCountry.textContent = data.country;
    resultCurrency.textContent = data.currency;
    resultPrepaid.textContent = data.prepaid;
    
    // Show results with animation
    resultsSection.style.display = 'block';
    resultsSection.style.opacity = '0';
    resultsSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultsSection.style.transition = 'all 0.5s ease';
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
    }, 10);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="material-icons">${getNotificationIcon(type)}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check_circle';
        case 'error': return 'error';
        case 'warning': return 'warning';
        default: return 'info';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to lookup
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        performLookup();
    }
    
    // Escape to clear results
    if (e.key === 'Escape') {
        clearResults();
    }
});

function clearResults() {
    resultsSection.style.display = 'none';
    binInput.value = '';
    binInput.focus();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Focus on input
    binInput.focus();
    
    // Add ripple effect to buttons
    addRippleEffect();
});

// Ripple effect for buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-lookup');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for notifications and ripple effect
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 15px 20px;
        color: var(--text-primary);
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 350px;
        box-shadow: 0 8px 25px var(--shadow-color);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification-error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification-warning {
        border-left: 4px solid var(--warning-color);
    }
    
    .notification-info {
        border-left: 4px solid var(--accent-primary);
    }
    
    .notification .material-icons {
        font-size: 20px;
    }
    
    .notification-success .material-icons {
        color: var(--success-color);
    }
    
    .notification-error .material-icons {
        color: var(--error-color);
    }
    
    .notification-warning .material-icons {
        color: var(--warning-color);
    }
    
    .notification-info .material-icons {
        color: var(--accent-primary);
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn-lookup {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
