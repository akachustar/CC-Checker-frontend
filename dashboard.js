// Dashboard JavaScript - SH44
document.addEventListener('DOMContentLoaded', function() {
    // Theme switching functionality
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('sh44-theme') || 'dark';
    setTheme(savedTheme);
    
    // Theme button event listeners
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            localStorage.setItem('sh44-theme', theme);
        });
    });
    
    function setTheme(theme) {
        // Handle auto theme
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        
        body.setAttribute('data-theme', theme);
        
        // Update active button
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === (localStorage.getItem('sh44-theme') || 'dark')) {
                btn.classList.add('active');
            }
        });
    }
    
    // Listen for system theme changes when auto is selected
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        const currentTheme = localStorage.getItem('sh44-theme');
        if (currentTheme === 'auto') {
            setTheme('auto');
        }
    });
    
    // Sign out functionality
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to sign out?')) {
                // Clear any stored data
                localStorage.removeItem('rememberedEmail');
                // Redirect to login
                window.location.href = 'login.html';
            }
        });
    }
    
    // Add credits button functionality
    const addCreditsBtn = document.querySelector('.add-credits-btn');
    if (addCreditsBtn) {
        addCreditsBtn.addEventListener('click', function() {
            showModal('Add Credits', createAddCreditsModal());
        });
    }
    
    // Contact icon functionality
    const contactIcon = document.querySelector('.contact-icon .material-icons');
    if (contactIcon) {
        contactIcon.addEventListener('click', function() {
            // Open Telegram or show contact info
            window.open('https://t.me/sh44support', '_blank');
        });
    }
    
    // Settings icon functionality
    const settingsIcon = document.querySelector('.settings-icon .material-icons');
    if (settingsIcon) {
        settingsIcon.addEventListener('click', function() {
            // Toggle theme selector visibility or show settings
            const themeSelector = document.querySelector('.theme-selector');
            themeSelector.style.display = themeSelector.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Animate counters on page load
    animateCounters();
    
    // Update real-time data
    updateRealTimeData();
    setInterval(updateRealTimeData, 30000); // Update every 30 seconds
    
    // Add hover effects to cards
    addCardHoverEffects();
});

// Create add credits modal content
function createAddCreditsModal() {
    return `
        <div class="modal-content">
            <div class="credit-packages">
                <div class="package" data-amount="25">
                    <div class="package-amount">$25</div>
                    <div class="package-bonus">+$2 Bonus</div>
                </div>
                <div class="package" data-amount="50">
                    <div class="package-amount">$50</div>
                    <div class="package-bonus">+$5 Bonus</div>
                </div>
                <div class="package" data-amount="100">
                    <div class="package-amount">$100</div>
                    <div class="package-bonus">+$15 Bonus</div>
                </div>
                <div class="package" data-amount="250">
                    <div class="package-amount">$250</div>
                    <div class="package-bonus">+$50 Bonus</div>
                </div>
            </div>
            <div class="payment-methods">
                <h4>Payment Methods</h4>
                <div class="methods">
                    <button class="method-btn">
                        <span class="material-icons">credit_card</span>
                        Credit Card
                    </button>
                    <button class="method-btn">
                        <span class="material-icons">account_balance</span>
                        Bank Transfer
                    </button>
                    <button class="method-btn">
                        <span class="material-icons">currency_bitcoin</span>
                        Cryptocurrency
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Show modal function
function showModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const modalStyles = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            color: var(--text-primary);
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .credit-packages {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .package {
            padding: 20px;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .package:hover {
            border-color: var(--accent-primary);
            transform: translateY(-2px);
        }
        
        .package.selected {
            border-color: var(--success-color);
            background: rgba(16, 185, 129, 0.1);
        }
        
        .package-amount {
            font-size: 24px;
            font-weight: 700;
            color: var(--accent-primary);
            margin-bottom: 5px;
        }
        
        .package-bonus {
            font-size: 12px;
            color: var(--success-color);
            font-weight: 500;
        }
        
        .payment-methods h4 {
            color: var(--text-primary);
            margin-bottom: 15px;
        }
        
        .methods {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .method-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .method-btn:hover {
            background: var(--bg-tertiary);
            border-color: var(--accent-secondary);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add event listeners
    const modal = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close');
    
    // Close modal events
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Package selection
    const packages = document.querySelectorAll('.package');
    packages.forEach(pkg => {
        pkg.addEventListener('click', function() {
            packages.forEach(p => p.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .number, .amount');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (counter.classList.contains('amount')) {
                counter.textContent = '$' + current.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
    });
}

// Update real-time data
function updateRealTimeData() {
    // Simulate real-time updates
    const activeUsers = document.querySelector('.stat-number');
    if (activeUsers) {
        const currentCount = parseInt(activeUsers.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
        const newCount = Math.max(0, currentCount + change);
        activeUsers.textContent = newCount.toLocaleString();
    }
    
    // Update transaction times
    const transactionTimes = document.querySelectorAll('.transaction-time');
    transactionTimes.forEach((time, index) => {
        const minutes = (index + 1) * 2 + Math.floor(Math.random() * 3);
        time.textContent = `${minutes} minutes ago`;
    });
    
    // Update system status times
    const statusTimes = document.querySelectorAll('.status-time');
    statusTimes.forEach(time => {
        time.textContent = 'just checked';
    });
}

// Add card hover effects
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.card, .section-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .theme-btn')) {
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D for dark theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setTheme('dark');
        localStorage.setItem('sh44-theme', 'dark');
    }
    
    // Ctrl/Cmd + L for light theme  
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        setTheme('light');
        localStorage.setItem('sh44-theme', 'light');
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
});

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
