// Jubenda Privacy Button Styling Fix
// This script applies custom styling to the Jubenda privacy and consent buttons
// after the default styles have been applied

// Immediately inject CSS to hide all Jubenda buttons
const hideJubendaCSS = `
    .iubenda-uspr-btn,
    .iubenda-tp-btn {
        opacity: 0 !important;
        visibility: hidden !important;
        display: none !important;
    }
`;

// Inject the CSS immediately
const style = document.createElement('style');
style.textContent = hideJubendaCSS;
document.head.appendChild(style);

function hideJubendaButtons() {
    // Immediately hide any existing Jubenda buttons
    const jubendaButtons = document.querySelectorAll('.iubenda-uspr-btn, .iubenda-tp-btn');
    jubendaButtons.forEach(button => {
        button.style.setProperty('opacity', '0', 'important');
        button.style.setProperty('visibility', 'hidden', 'important');
        button.style.setProperty('display', 'none', 'important');
    });
}

function styleJubendaButtons() {
    console.log('Styling Jubenda buttons');
    
    // Immediately hide any existing buttons
    hideJubendaButtons();
    
    // Wait for the Jubenda buttons to be created
    const checkForButtons = setInterval(() => {
        const jubendaPrivacyButton = document.querySelector('.iubenda-uspr-btn');
        const jubendaConsentButton = document.querySelector('.iubenda-tp-btn');
        
        // Style privacy button if found
        if (jubendaPrivacyButton) {
            // Apply custom styling
            jubendaPrivacyButton.style.setProperty('background-color', 'var(--background-color)', 'important');
            jubendaPrivacyButton.style.setProperty('color', 'var(--text-color)', 'important');
            jubendaPrivacyButton.style.setProperty('opacity', '1', 'important');
            jubendaPrivacyButton.style.setProperty('visibility', 'visible', 'important');
            jubendaPrivacyButton.style.setProperty('display', 'block', 'important');
            
            // Move privacy button to the left by changing the float attribute
            jubendaPrivacyButton.setAttribute('data-tp-float', 'bottom-right');
            
            // Force positioning with CSS - closer to the border
            jubendaPrivacyButton.style.setProperty('position', 'fixed', 'important');
            jubendaPrivacyButton.style.setProperty('right', '-2vw', 'important');
            jubendaPrivacyButton.style.setProperty('bottom', '-1vh', 'important');
            jubendaPrivacyButton.style.setProperty('left', 'auto', 'important');
            jubendaPrivacyButton.style.setProperty('top', 'auto', 'important');
            jubendaPrivacyButton.style.setProperty('transform', 'scale(.65)', 'important');

            // Optional: Add hover effects
            jubendaPrivacyButton.addEventListener('mouseenter', function() {
                this.style.setProperty('background-color', 'var(--accent-color)', 'important');
                this.style.setProperty('color', 'var(--black)', 'important');
            });
            
            jubendaPrivacyButton.addEventListener('mouseleave', function() {
                this.style.setProperty('background-color', 'var(--background-color)', 'important');
                this.style.setProperty('color', 'var(--text-color)', 'important');
            });
        }
        
        // Style consent button if found
        if (jubendaConsentButton) {
            // Apply custom styling
            jubendaConsentButton.style.setProperty('background-color', 'var(--background-color)', 'important');
            jubendaConsentButton.style.setProperty('color', 'var(--text-color)', 'important');
            jubendaConsentButton.style.setProperty('opacity', '1', 'important');
            jubendaConsentButton.style.setProperty('visibility', 'visible', 'important');
            jubendaConsentButton.style.setProperty('display', 'block', 'important');
            jubendaConsentButton.style.setProperty('position', 'fixed', 'important');
            jubendaConsentButton.style.setProperty('right', '-.5vw', 'important');
            jubendaConsentButton.style.setProperty('bottom', '-.6vh', 'important');
            jubendaConsentButton.style.setProperty('left', 'auto', 'important');
            jubendaConsentButton.style.setProperty('top', 'auto', 'important');
            
            // Optional: Add hover effects
            jubendaConsentButton.addEventListener('mouseenter', function() {
                this.style.setProperty('background-color', 'var(--accent-color)', 'important');
                this.style.setProperty('color', 'var(--black)', 'important');
            });
            
            jubendaConsentButton.addEventListener('mouseleave', function() {
                this.style.setProperty('background-color', 'var(--background-color)', 'important');
                this.style.setProperty('color', 'var(--text-color)', 'important');
            });
        }
        
        // Clear the interval if both buttons are found or after timeout
        if (jubendaPrivacyButton && jubendaConsentButton) {
            clearInterval(checkForButtons);
        }
    }, 50); // Check every 50ms (faster checking)
    
    // Stop checking after 10 seconds to avoid infinite loop
    setTimeout(() => {
        clearInterval(checkForButtons);
    }, 10000);
}

// Run the styling function immediately
styleJubendaButtons();

// Also run when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', styleJubendaButtons);
} else {
    styleJubendaButtons();
}

// Also run when the page is fully loaded (in case Jubenda loads after DOMContentLoaded)
window.addEventListener('load', styleJubendaButtons);

// Monitor for new Jubenda buttons being added to the DOM
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
                    setTimeout(() => styleJubendaButtons(), 10);
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
