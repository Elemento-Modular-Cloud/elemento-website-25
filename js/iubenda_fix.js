// iubenda Privacy Button Styling Fix
// This script applies custom styling to the iubenda privacy and consent buttons
// after the default styles have been applied

// Immediately inject CSS to hide all iubenda buttons
const hideiubendaCSS = `
    .iubenda-uspr-btn,
    .iubenda-tp-btn {
        opacity: 0 !important;
        visibility: hidden !important;
        display: none !important;
    }
`;

// Inject the CSS immediately
const style = document.createElement('style');
style.textContent = hideiubendaCSS;
document.head.appendChild(style);

function hideiubendaButtons() {
    // Immediately hide any existing iubenda buttons
    const iubendaButtons = document.querySelectorAll('.iubenda-uspr-btn, .iubenda-tp-btn');
    iubendaButtons.forEach(button => {
        button.style.setProperty('opacity', '0', 'important');
        button.style.setProperty('visibility', 'hidden', 'important');
        button.style.setProperty('display', 'none', 'important');
    });
}

function styleiubendaButtons() {
    console.log('Styling iubenda buttons');
    
    // Immediately hide any existing buttons
    hideiubendaButtons();
    
    // Wait for the iubenda buttons to be created
    const checkForButtons = setInterval(() => {
        const iubendaPrivacyButton = document.querySelector('.iubenda-uspr-btn');
        const iubendaConsentButton = document.querySelector('.iubenda-tp-btn');
        
        // Style privacy button if found - USA banner
        if (iubendaPrivacyButton) {
            // Apply glassmorphism styling using theme variables
            iubendaPrivacyButton.style.setProperty('background', 'var(--glassmorphism-background)', 'important');
            iubendaPrivacyButton.style.setProperty('backdrop-filter', 'blur(20px) saturate(180%)', 'important');
            iubendaPrivacyButton.style.setProperty('-webkit-backdrop-filter', 'blur(20px) saturate(180%)', 'important');
            iubendaPrivacyButton.style.setProperty('border', '1px solid var(--glassmorphism-border)', 'important');
            iubendaPrivacyButton.style.setProperty('border-radius', '12px 0 0 0', 'important');
            iubendaPrivacyButton.style.setProperty('box-shadow', 'var(--glassmorphism-shadow)', 'important');
            iubendaPrivacyButton.style.setProperty('height', '50px', 'important');
            iubendaPrivacyButton.style.setProperty('transform', 'scale(.8)', 'important');

            iubendaPrivacyButton.style.setProperty('color', 'var(--text-color)', 'important');
            iubendaPrivacyButton.style.setProperty('opacity', '1', 'important');
            iubendaPrivacyButton.style.setProperty('visibility', 'visible', 'important');
            iubendaPrivacyButton.style.setProperty('display', 'block', 'important');
            
            // Move privacy button to the left by changing the float attribute
            iubendaPrivacyButton.setAttribute('data-tp-float', 'bottom-right');
            
            // Force positioning with CSS - closer to the border
            iubendaPrivacyButton.style.setProperty('position', 'fixed', 'important');
            iubendaPrivacyButton.style.setProperty('right', '-10px', 'important');
            iubendaPrivacyButton.style.setProperty('bottom', '-10px', 'important');
            iubendaPrivacyButton.style.setProperty('left', 'auto', 'important');
            iubendaPrivacyButton.style.setProperty('top', 'auto', 'important');
            iubendaPrivacyButton.style.setProperty('z-index', '9999', 'important');

            // Enhanced hover effects with theme-aware glassmorphism
            iubendaPrivacyButton.addEventListener('mouseenter', function() {
                this.style.setProperty('background', 'var(--glassmorphism-background)', 'important');
                this.style.setProperty('border', '1px solid var(--accent-color)', 'important');
                this.style.setProperty('box-shadow', 'var(--glassmorphism-shadow), 0 8px 25px rgba(0, 0, 0, 0.15)', 'important');
                this.style.setProperty('color', 'var(--text-color)', 'important');
            });
            
            iubendaPrivacyButton.addEventListener('mouseleave', function() {
                this.style.setProperty('background', 'var(--glassmorphism-background)', 'important');
                this.style.setProperty('border', '1px solid var(--glassmorphism-border)', 'important');
                this.style.setProperty('box-shadow', 'var(--glassmorphism-shadow)', 'important');
                this.style.setProperty('color', 'var(--text-color)', 'important');
            });
        }
        
        // Style consent button if found - GDPR banner
        if (iubendaConsentButton) {
            // Apply glassmorphism styling using theme variables
            iubendaConsentButton.style.setProperty('background', 'var(--glassmorphism-background)', 'important');
            iubendaConsentButton.style.setProperty('backdrop-filter', 'blur(20px) saturate(180%)', 'important');
            iubendaConsentButton.style.setProperty('-webkit-backdrop-filter', 'blur(20px) saturate(180%)', 'important');
            iubendaConsentButton.style.setProperty('border', '1px solid var(--glassmorphism-border)', 'important');
            iubendaConsentButton.style.setProperty('border-radius', '0 12px 0 0', 'important');
            iubendaConsentButton.style.setProperty('box-shadow', 'var(--glassmorphism-shadow)', 'important');
            iubendaConsentButton.style.setProperty('height', '40px', 'important');
            iubendaConsentButton.style.setProperty('display', 'flex', 'important');
            iubendaConsentButton.style.setProperty('align-items', 'center', 'important');
            iubendaConsentButton.style.setProperty('justify-content', 'center', 'important');
            iubendaConsentButton.style.setProperty('gap', '8px', 'important');
            // iubendaConsentButton.style.setProperty('padding', '0 16px', 'important');
            iubendaConsentButton.style.setProperty('text-align', 'center', 'important');

            iubendaConsentButton.style.setProperty('color', 'var(--text-color)', 'important');
            iubendaConsentButton.style.setProperty('opacity', '1', 'important');
            iubendaConsentButton.style.setProperty('visibility', 'visible', 'important');
            iubendaConsentButton.style.setProperty('display', 'flex', 'important');
            iubendaConsentButton.style.setProperty('position', 'fixed', 'important');
            iubendaConsentButton.style.setProperty('right', '-3px', 'important');
            iubendaConsentButton.style.setProperty('bottom', '-21px', 'important');
            iubendaConsentButton.style.setProperty('left', 'auto', 'important');
            iubendaConsentButton.style.setProperty('top', 'auto', 'important');
            iubendaConsentButton.style.setProperty('z-index', '9999', 'important');
            
            // Add cookie icon to the button (only if it doesn't already exist)
            if (!iubendaConsentButton.querySelector('.iubenda-cookie-icon')) {
                const cookieIcon = document.createElement('span');
                cookieIcon.className = 'iubenda-cookie-icon';
                cookieIcon.innerHTML = '🍪';
                cookieIcon.style.setProperty('font-size', '16px', 'important');
                cookieIcon.style.setProperty('line-height', '1', 'important');
                cookieIcon.style.setProperty('cursor', 'pointer', 'important');
                
                // Insert icon before the existing text
                iubendaConsentButton.insertBefore(cookieIcon, iubendaConsentButton.firstChild);
            }
            
            // Enhanced hover effects with theme-aware glassmorphism
            iubendaConsentButton.addEventListener('mouseenter', function() {
                this.style.setProperty('background', 'var(--glassmorphism-background)', 'important');
                this.style.setProperty('border', '1px solid var(--accent-color)', 'important');
                this.style.setProperty('box-shadow', 'var(--glassmorphism-shadow), 0 8px 25px rgba(0, 0, 0, 0.15)', 'important');
                this.style.setProperty('color', 'var(--text-color)', 'important');
            });
            
            iubendaConsentButton.addEventListener('mouseleave', function() {
                this.style.setProperty('background', 'var(--glassmorphism-background)', 'important');
                this.style.setProperty('border', '1px solid var(--glassmorphism-border)', 'important');
                this.style.setProperty('box-shadow', 'var(--glassmorphism-shadow)', 'important');
                this.style.setProperty('color', 'var(--text-color)', 'important');
            });
        }
        
        // Clear the interval if both buttons are found or after timeout
        if (iubendaPrivacyButton && iubendaConsentButton) {
            clearInterval(checkForButtons);
        }
    }, 50); // Check every 50ms (faster checking)
    
    // Stop checking after 10 seconds to avoid infinite loop
    setTimeout(() => {
        clearInterval(checkForButtons);
    }, 10000);
}

// Run the styling function immediately
// styleiubendaButtons();

// Also run when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', styleiubendaButtons);
} else {
    styleiubendaButtons();
}

// Also run when the page is fully loaded (in case iubenda loads after DOMContentLoaded)
window.addEventListener('load', styleiubendaButtons);

// Monitor for new iubenda buttons being added to the DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
                if (node.classList && (node.classList.contains('iubenda-uspr-btn') || node.classList.contains('iubenda-tp-btn'))) {
                    // Hide the button immediately
                    node.style.setProperty('opacity', '0', 'important');
                    node.style.setProperty('visibility', 'hidden', 'important');
                    node.style.setProperty('display', 'none', 'important');
                    // Style it immediately
                    setTimeout(() => styleiubendaButtons(), 10);
                }
            }
        });
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});
