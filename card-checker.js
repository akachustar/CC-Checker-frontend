// Card Checker JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const cardInput = document.getElementById('cardInput');
    const startBtn = document.getElementById('startCheck');
    const stopBtn = document.getElementById('stopCheck');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const liveCount = document.getElementById('liveCount');
    const deadCount = document.getElementById('deadCount');
    
    let isChecking = false;
    let checkingInterval;
    let currentIndex = 0;
    let cards = [];
    let liveCards = 0;
    let deadCards = 0;
    
    // Start checking process
    startBtn.addEventListener('click', function() {
        const inputText = cardInput.value.trim();
        
        if (!inputText) {
            showNotification('Please enter cards to check', 'error');
            return;
        }
        
        // Parse cards from input
        cards = parseCards(inputText);
        
        if (cards.length === 0) {
            showNotification('No valid cards found. Please check the format.', 'error');
            return;
        }
        
        // Reset counters
        liveCards = 0;
        deadCards = 0;
        currentIndex = 0;
        updateCounters();
        
        // Start checking
        startChecking();
    });
    
    // Stop checking process
    stopBtn.addEventListener('click', function() {
        stopChecking();
    });
    
    function parseCards(input) {
        const lines = input.split('\n').filter(line => line.trim());
        const validCards = [];
        
        lines.forEach(line => {
            const trimmed = line.trim();
            // Basic validation for card format (16 digits|2 digits|4 digits|3 digits)
            if (trimmed.match(/^\d{16}\|\d{2}\|\d{4}\|\d{3}/)) {
                validCards.push(trimmed);
            }
        });
        
        return validCards;
    }
    
    function startChecking() {
        isChecking = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        startBtn.classList.add('btn-loading');
        
        // Play start sound
        playSound('start');
        
        // Show progress section
        progressSection.style.display = 'block';
        updateProgress();
        
        // Simulate card checking process
        checkingInterval = setInterval(() => {
            if (currentIndex >= cards.length) {
                stopChecking();
                playSound('complete');
                showNotification(`Checking completed! ${liveCards} live, ${deadCards} dead cards found.`, 'success');
                return;
            }
            
            // Simulate checking a card
            checkCard(cards[currentIndex]);
            currentIndex++;
            updateProgress();
            
        }, 1500); // Check one card every 1.5 seconds
    }
    
    function stopChecking() {
        isChecking = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        startBtn.classList.remove('btn-loading');
        
        if (checkingInterval) {
            clearInterval(checkingInterval);
        }
        
        // Hide progress section after a delay
        setTimeout(() => {
            if (!isChecking) {
                progressSection.style.display = 'none';
            }
        }, 2000);
    }
    
    function checkCard(card) {
        // Simulate random result (70% dead, 30% live for realism)
        const isLive = Math.random() > 0.7;
        
        if (isLive) {
            liveCards++;
            animateCounter(liveCount);
        } else {
            deadCards++;
            animateCounter(deadCount);
        }
        
        updateCounters();
        
        // Add visual feedback
        const cardLine = card.substring(0, 4) + '****';
        console.log(`Checked: ${cardLine} - ${isLive ? 'LIVE' : 'DEAD'}`);
    }
    
    function updateProgress() {
        const percentage = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `Checking cards... ${currentIndex}/${cards.length}`;
    }
    
    function updateCounters() {
        liveCount.textContent = liveCards;
        deadCount.textContent = deadCards;
    }
    
    function animateCounter(element) {
        element.classList.add('animate');
        setTimeout(() => {
            element.classList.remove('animate');
        }, 300);
    }
    
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
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
            max-width: 350px;
            word-wrap: break-word;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        `;
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Auto-resize textarea
    cardInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(300, this.scrollHeight) + 'px';
    });
    
    // Format validation on paste
    cardInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            const text = this.value;
            const lines = text.split('\n');
            let validCount = 0;
            let invalidCount = 0;
            
            lines.forEach(line => {
                if (line.trim()) {
                    if (line.match(/^\d{16}\|\d{2}\|\d{4}\|\d{3}/)) {
                        validCount++;
                    } else {
                        invalidCount++;
                    }
                }
            });
            
            if (invalidCount > 0) {
                showNotification(`Found ${validCount} valid cards and ${invalidCount} invalid format cards. Please check the format.`, 'warning');
            } else if (validCount > 0) {
                showNotification(`${validCount} valid cards detected.`, 'success');
            }
        }, 100);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to start checking
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!isChecking && !startBtn.disabled) {
                startBtn.click();
            }
        }
        
        // Escape to stop checking
        if (e.key === 'Escape' && isChecking) {
            stopBtn.click();
        }
    });
    
    // Prevent form submission on Enter in textarea
    cardInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (!isChecking && !startBtn.disabled) {
                startBtn.click();
            }
        }
    });
    
    // Add sample data for testing (remove in production)
    const sampleButton = document.createElement('button');
    sampleButton.textContent = 'Load Sample Data';
    sampleButton.className = 'btn-sample';
    sampleButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 8px 12px;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        color: var(--text-muted);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    sampleButton.addEventListener('click', function() {
        const sampleCards = [
            '4532015112830366|12|2025|123 - checksy.cc',
            '5555555555554444|01|2026|456 - checksy.cc',
            '4111111111111111|03|2024|789 - checksy.cc',
            '4000000000000002|06|2025|321 - checksy.cc',
            '5105105105105100|09|2023|654 - checksy.cc'
        ];
        cardInput.value = sampleCards.join('\n');
        cardInput.dispatchEvent(new Event('input'));
        showNotification('Sample data loaded', 'success');
    });
    
    // Add sample button to input section (for testing only)
    const inputSection = document.querySelector('.input-section');
    inputSection.style.position = 'relative';
    inputSection.appendChild(sampleButton);
});

// Credit deduction simulation
function deductCredits(amount, reason) {
    console.log(`Credits deducted: ${amount} (${reason})`);
    // In real implementation, this would make an API call to deduct credits
}

// Card validation functions
function validateCardFormat(card) {
    // Check if card matches the required format
    const pattern = /^\d{16}\|\d{2}\|\d{4}\|\d{3}(\s*-\s*checksy\.cc)?$/;
    return pattern.test(card.trim());
}

function detectCardType(cardNumber) {
    const firstDigit = cardNumber.charAt(0);
    const firstTwo = cardNumber.substring(0, 2);
    const firstFour = cardNumber.substring(0, 4);
    
    if (firstDigit === '4') {
        return 'VISA';
    } else if (firstTwo >= '51' && firstTwo <= '55') {
        return 'MASTERCARD';
    } else if (firstTwo === '34' || firstTwo === '37') {
        return 'AMEX';
    } else if (firstFour === '6011' || firstTwo === '65') {
        return 'DISCOVERY';
    }
    
    return 'UNKNOWN';
}

function isValidCardType(cardNumber) {
    const type = detectCardType(cardNumber);
    return ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVERY'].includes(type);
}

// Sound effects function
function playSound(type) {
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'start') {
        // Play checking start sound - ascending beep
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'complete') {
        // Play completion sound - success chime
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.setValueAtTime(523, audioContext.currentTime); // C5
        oscillator2.frequency.setValueAtTime(659, audioContext.currentTime); // E5
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.5);
        oscillator2.stop(audioContext.currentTime + 0.5);
    }
}
