// Elemento Website Theme Switcher

// Theme configuration
const themes = ['theme-light', 'theme-dark', 'theme-high-contrast'];
const themeIcons = ['🌞', '🌙', '⚡'];
let currentThemeIndex = 0;

// Get DOM elements
const themeToggleBtn = document.querySelector('.theme-toggle-btn');
const body = document.body;

// Initialize theme switcher
function initThemeSwitcher() {
    // Create theme switcher if it doesn't exist
    if (!document.querySelector('.theme-switcher')) {
        const themeSwitcher = document.createElement('div');
        themeSwitcher.className = 'theme-switcher';
        themeSwitcher.innerHTML = `
            <button class="theme-toggle-btn" title="Toggle theme">
                ${themeIcons[currentThemeIndex]}
            </button>
        `;
        document.body.appendChild(themeSwitcher);
        
        // Add event listener to the new button
        const newThemeToggleBtn = themeSwitcher.querySelector('.theme-toggle-btn');
        newThemeToggleBtn.addEventListener('click', toggleTheme);
    }
}

// Toggle theme function
function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    
    // Add new theme class
    body.classList.add(newTheme);
    
    // Update button icon
    updateThemeIcon();
    
    // Save theme preference
    localStorage.setItem('elemento-theme', newTheme);
    localStorage.setItem('elemento-theme-index', currentThemeIndex.toString());
    
    // Show theme change notification
    showThemeNotification(newTheme);
}

// Update theme icon
function updateThemeIcon() {
    const btn = document.querySelector('.theme-toggle-btn');
    if (btn) {
        btn.textContent = themeIcons[currentThemeIndex];
        btn.title = `Current theme: ${getThemeName(currentThemeIndex)}`;
    }
}

// Get theme name
function getThemeName(index) {
    const names = ['Light', 'Dark', 'High Contrast'];
    return names[index];
}

// Show theme change notification
function showThemeNotification(theme) {
    const themeName = getThemeName(currentThemeIndex);
    const message = `Switched to ${themeName} theme`;
    
    // Use existing toast system if available
    if (window.ElementoWebsite && window.ElementoWebsite.showToast) {
        window.ElementoWebsite.showToast(message, 'info', 2000);
    } else {
        // Fallback notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--card-bg-color);
            color: var(--text-color);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-medium);
            border: 1px solid var(--glassmorphism-border);
            backdrop-filter: blur(20px);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('elemento-theme');
    const savedIndex = localStorage.getItem('elemento-theme-index');
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    
    if (savedTheme) {
        // Add saved theme class
        body.classList.add(savedTheme);
        
        // Update current index
        if (savedIndex) {
            currentThemeIndex = parseInt(savedIndex);
        } else {
            currentThemeIndex = themes.indexOf(savedTheme);
        }
    } else {
        // Default to light theme
        body.classList.add('theme-light');
        currentThemeIndex = 0;
    }
    
    // Update theme icon
    updateThemeIcon();
}

// Initialize theme system
function initThemeSystem() {
    // Load saved theme
    loadSavedTheme();
    
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Add keyboard shortcut (Ctrl/Cmd + T)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// Auto-detect system theme preference
function detectSystemTheme() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Only auto-detect if no theme is saved
        if (!localStorage.getItem('elemento-theme')) {
            if (mediaQuery.matches) {
                // System prefers dark theme
                currentThemeIndex = 1; // Dark theme
                body.classList.remove('theme-light');
                body.classList.add('theme-dark');
                localStorage.setItem('elemento-theme', 'theme-dark');
                localStorage.setItem('elemento-theme-index', '1');
            } else {
                // System prefers light theme
                currentThemeIndex = 0; // Light theme
                body.classList.remove('theme-dark', 'theme-high-contrast');
                body.classList.add('theme-light');
                localStorage.setItem('elemento-theme', 'theme-light');
                localStorage.setItem('elemento-theme-index', '0');
            }
        }
        
        // Listen for system theme changes
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if no manual theme is saved
            if (!localStorage.getItem('elemento-theme')) {
                if (e.matches) {
                    // System switched to dark
                    currentThemeIndex = 1;
                    body.classList.remove('theme-light', 'theme-high-contrast');
                    body.classList.add('theme-dark');
                    localStorage.setItem('elemento-theme', 'theme-dark');
                    localStorage.setItem('elemento-theme-index', '1');
                } else {
                    // System switched to light
                    currentThemeIndex = 0;
                    body.classList.remove('theme-dark', 'theme-high-contrast');
                    body.classList.add('theme-light');
                    localStorage.setItem('elemento-theme', 'theme-light');
                    localStorage.setItem('elemento-theme-index', '0');
                }
                updateThemeIcon();
            }
        });
    }
}

// Export functions for global access
window.ElementoThemes = {
    toggleTheme,
    getCurrentTheme: () => themes[currentThemeIndex],
    getCurrentThemeName: () => getThemeName(currentThemeIndex),
    getCurrentThemeIndex: () => currentThemeIndex
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThemeSystem();
    detectSystemTheme();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    initThemeSystem();
    detectSystemTheme();
} 