// Card Formatter JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const cardInput = document.getElementById('cardInput');
    const startBtn = document.getElementById('startFormatter');
    const stopBtn = document.getElementById('stopFormatter');
    const resetBtn = document.getElementById('resetFormatter');
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const editedCount = document.getElementById('editedCount');
    const incorrectCount = document.getElementById('incorrectCount');
    const serverOptions = document.querySelectorAll('input[name="server"]');
    
    let isFormatting = false;
    let formattingInterval;
    let currentIndex = 0;
    let cards = [];
    let editedCards = 0;
    let incorrectCards = 0;
    
    // Start formatting process
    startBtn.addEventListener('click', function() {
        const inputText = cardInput.value.trim();
        
        if (!inputText) {
            showNotification('Please enter cards to format', 'error');
            return;
        }
        
        // Parse cards from input
        cards = parseUnformattedCards(inputText);
        
        if (cards.length === 0) {
            showNotification('No cards found to format.', 'error');
            return;
        }
        
        // Reset counters
        editedCards = 0;
        incorrectCards = 0;
        currentIndex = 0;
        updateCounters();
        
        // Start formatting
        startFormatting();
    });
    
    // Stop formatting process
    stopBtn.addEventListener('click', function() {
        stopFormatting();
    });
    
    // Reset formatter
    resetBtn.addEventListener('click', function() {
        if (isFormatting) {
            stopFormatting();
        }
        
        cardInput.value = '';
        editedCards = 0;
        incorrectCards = 0;
        currentIndex = 0;
        cards = [];
        updateCounters();
        progressSection.style.display = 'none';
        
        showNotification('Formatter reset successfully', 'success');
    });
    
    function parseUnformattedCards(input) {
        const lines = input.split('\n').filter(line => line.trim());
        const foundCards = [];
        
        lines.forEach(line => {
            const trimmed = line.trim();
            // Look for potential card numbers (various formats)
            const cardPatterns = [
                /(\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4})/g, // 16 digit cards
                /(\d{15})/g, // 15 digit cards (AMEX)
                /(\d{13})/g  // 13 digit cards
            ];
            
            cardPatterns.forEach(pattern => {
                const matches = trimmed.match(pattern);
                if (matches) {
                    matches.forEach(match => {
                        const cleanCard = match.replace(/[\s\-]/g, '');
                        if (cleanCard.length >= 13 && cleanCard.length <= 16) {
                            foundCards.push({
                                original: trimmed,
                                cardNumber: cleanCard
                            });
                        }
                    });
                }
            });
        });
        
        return foundCards;
    }
    
    function startFormatting() {
        isFormatting = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resetBtn.disabled = true;
        startBtn.classList.add('btn-loading');
        
        // Play start sound
        playFormatterSound('start');
        
        // Show progress section
        progressSection.style.display = 'block';
        updateProgress();
        
        // Get selected server
        const selectedServer = document.querySelector('input[name="server"]:checked').value;
        
        // Simulate card formatting process
        formattingInterval = setInterval(() => {
            if (currentIndex >= cards.length) {
                stopFormatting();
                playFormatterSound('complete');
                showNotification(`Formatting completed! ${editedCards} cards formatted, ${incorrectCards} incorrect cards found.`, 'success');
                return;
            }
            
            // Simulate formatting a card
            formatCard(cards[currentIndex], selectedServer);
            currentIndex++;
            updateProgress();
            
        }, selectedServer === 'ai' ? 2000 : 1000); // AI formatter is slower
    }
    
    function stopFormatting() {
        isFormatting = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        resetBtn.disabled = false;
        startBtn.classList.remove('btn-loading');
        
        if (formattingInterval) {
            clearInterval(formattingInterval);
        }
        
        // Hide progress section after a delay
        setTimeout(() => {
            if (!isFormatting) {
                progressSection.style.display = 'none';
            }
        }, 2000);
    }
    
    function formatCard(cardData, server) {
        const { original, cardNumber } = cardData;
        
        // Simulate formatting logic
        let formatted = false;
        
        if (cardNumber.length >= 13 && cardNumber.length <= 16) {
            // Generate random expiry and CVV for demonstration
            const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
            const year = String(2024 + Math.floor(Math.random() * 5));
            const cvv = cardNumber.length === 15 ? 
                String(Math.floor(Math.random() * 9000) + 1000) : // AMEX 4-digit
                String(Math.floor(Math.random() * 900) + 100);    // Others 3-digit
            
            // 85% success rate for Checksy, 95% for AI
            const successRate = server === 'ai' ? 0.95 : 0.85;
            formatted = Math.random() < successRate;
            
            if (formatted) {
                editedCards++;
                animateCounter(editedCount);
                
                // Deduct credit for AI formatter
                if (server === 'ai') {
                    deductCredits(1, 'AI Formatter');
                }
                
                console.log(`Formatted: ${cardNumber}|${month}|${year}|${cvv} - checksy.cc`);
            } else {
                incorrectCards++;
                animateCounter(incorrectCount);
                console.log(`Failed to format: ${cardNumber.substring(0, 4)}****`);
            }
        } else {
            incorrectCards++;
            animateCounter(incorrectCount);
        }
        
        updateCounters();
    }
    
    function updateProgress() {
        const percentage = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `Formatting cards... ${currentIndex}/${cards.length}`;
    }
    
    function updateCounters() {
        editedCount.textContent = editedCards;
        incorrectCount.textContent = incorrectCards;
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
    
    // Server selection change
    serverOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'ai') {
                showNotification('AI Formatter selected - 1 credit per card will be charged', 'warning');
            } else {
                showNotification('Checksy Formatter selected - completely free', 'success');
            }
        });
    });
    
    // Format validation on paste
    cardInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            const text = this.value;
            const cards = parseUnformattedCards(text);
            
            if (cards.length > 0) {
                showNotification(`${cards.length} potential cards detected for formatting.`, 'success');
            } else {
                showNotification('No card numbers detected in the pasted content.', 'warning');
            }
        }, 100);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to start formatting
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!isFormatting && !startBtn.disabled) {
                startBtn.click();
            }
        }
        
        // Escape to stop formatting
        if (e.key === 'Escape' && isFormatting) {
            stopBtn.click();
        }
        
        // Ctrl/Cmd + R to reset
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            if (!resetBtn.disabled) {
                resetBtn.click();
            }
        }
    });
    
    // Add sample data for testing
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
            '4532 0151 1283 0366 12/25 123',
            '5555555555554444|01|2026|456',
            '4111-1111-1111-1111 03/24 789',
            '4000000000000002 exp: 06/25 cvv: 321',
            '5105105105105100 09/23 654'
        ];
        cardInput.value = sampleCards.join('\n');
        cardInput.dispatchEvent(new Event('input'));
        showNotification('Sample unformatted data loaded', 'success');
    });
    
    // Add sample button to input section
    const inputSection = document.querySelector('.input-section');
    inputSection.style.position = 'relative';
    inputSection.appendChild(sampleButton);
});

// Sound effects for formatter
function playFormatterSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'start') {
        // Play formatting start sound - different from checker
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    } else if (type === 'complete') {
        // Play completion sound - success melody
        const frequencies = [523, 659, 784]; // C5, E5, G5
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
            
            gainNode.gain.setValueAtTime(0.06, audioContext.currentTime + index * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);
            
            oscillator.start(audioContext.currentTime + index * 0.15);
            oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3);
        });
    }
}

// Credit deduction function
function deductCredits(amount, reason) {
    console.log(`Credits deducted: ${amount} (${reason})`);
    // In real implementation, this would make an API call to deduct credits
}
