// Elemento Website Theme Switcher

// Theme configuration
const themes = ['theme-light', 'theme-dark', 'theme-high-contrast'];
const themeIcons = [
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
    </svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" transform="scale(-1, -1) rotate(-10)">
        <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
    </svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6V6z"/>
    </svg>`
];
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
}

// Update theme icon
function updateThemeIcon() {
    const btn = document.querySelector('.theme-toggle-btn');
    if (btn) {
        btn.innerHTML = themeIcons[currentThemeIndex];
        btn.title = `Current theme: ${getThemeName(currentThemeIndex)}`;
    }
}

// Get theme name
function getThemeName(index) {
    const names = ['Light', 'Dark', 'High Contrast'];
    return names[index];
}

// Theme change notifications have been removed per user request

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