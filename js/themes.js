// Elemento Website Theme Switcher

// Theme configuration
const themes = ['theme-light', 'theme-dark', 'theme-high-contrast'];
const DEFAULT_THEME_INDEX = 1; // 0 = light, 1 = dark, 2 = high-contrast
const DEFAULT_THEME = themes[DEFAULT_THEME_INDEX];
const themeIcons = [
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
    </svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" transform="scale(1, -1) rotate(-10)">
        <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
    </svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6V6z"/>
    </svg>`
];
let currentThemeIndex = DEFAULT_THEME_INDEX;

// Logging utility
function log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[Elemento Themes ${timestamp}] ${message}`;
    console.log(logMessage, data || '');
}

// Get DOM elements
const themeToggleBtn = document.querySelector('.theme-toggle-btn');
const body = document.body;

// Initialize theme switcher
function initThemeSwitcher() {
    log('Initializing theme switcher');
    
    // Create theme switcher if it doesn't exist
    if (!document.querySelector('.theme-switcher')) {
        log('Creating theme switcher element');
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
        log('Theme switcher created and event listener added');
    } else {
        log('Theme switcher already exists');
    }
}

// Toggle theme function
function toggleTheme() {
    const previousTheme = themes[currentThemeIndex];
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    log(`Toggling theme from ${previousTheme} to ${newTheme}`, {
        previousIndex: (currentThemeIndex - 1 + themes.length) % themes.length,
        newIndex: currentThemeIndex,
        themeName: getThemeName(currentThemeIndex)
    });
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    
    // Add new theme class
    body.classList.add(newTheme);
    
    // Update button icon
    updateThemeIcon();
    
    // Save theme preference
    localStorage.setItem('elemento-theme', newTheme);
    localStorage.setItem('elemento-theme-index', currentThemeIndex.toString());
    
    log(`Theme saved to localStorage: ${newTheme}`);
}

// Update theme icon
function updateThemeIcon() {
    const btn = document.querySelector('.theme-toggle-btn');
    if (btn) {
        btn.innerHTML = themeIcons[currentThemeIndex];
        btn.title = `Current theme: ${getThemeName(currentThemeIndex)}`;
        log(`Updated theme icon to: ${getThemeName(currentThemeIndex)}`);
    } else {
        log('Warning: Theme toggle button not found');
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
    log('Loading saved theme from localStorage');
    
    const savedTheme = localStorage.getItem('elemento-theme');
    const savedIndex = localStorage.getItem('elemento-theme-index');
    
    log('Saved theme data:', { savedTheme, savedIndex });
    
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
        
        log(`Loaded saved theme: ${savedTheme} (index: ${currentThemeIndex})`);
    } else {
        // Default to configured theme
        body.classList.add(DEFAULT_THEME);
        currentThemeIndex = DEFAULT_THEME_INDEX;
        log(`No saved theme found, using default: ${DEFAULT_THEME} (index: ${DEFAULT_THEME_INDEX})`);
    }
    
    // Update theme icon
    updateThemeIcon();
}

// Initialize theme system
function initThemeSystem() {
    log('Initializing theme system');
    log('Configuration:', {
        themes,
        DEFAULT_THEME_INDEX,
        DEFAULT_THEME,
        currentThemeIndex
    });
    
    // Load saved theme
    loadSavedTheme();
    
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Add keyboard shortcut (Ctrl/Cmd + T)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            log('Theme toggle triggered via keyboard shortcut (Ctrl/Cmd + T)');
            toggleTheme();
        }
    });
    
    log('Theme system initialization complete');
}

// Auto-detect system theme preference
function detectSystemTheme() {
    log('Detecting system theme preference');
    
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemPrefersDark = mediaQuery.matches;
        
        log('System theme preference:', { prefersDark: systemPrefersDark });
        
        // Only auto-detect if no theme is saved
        if (!localStorage.getItem('elemento-theme')) {
            if (systemPrefersDark) {
                // System prefers dark theme
                currentThemeIndex = 1; // Dark theme
                body.classList.remove('theme-light');
                body.classList.add('theme-dark');
                localStorage.setItem('elemento-theme', 'theme-dark');
                localStorage.setItem('elemento-theme-index', '1');
                log('Applied system dark theme preference');
            } else {
                // System prefers light theme
                currentThemeIndex = DEFAULT_THEME_INDEX; // Use configured default
                body.classList.remove('theme-dark', 'theme-high-contrast');
                body.classList.add(DEFAULT_THEME);
                localStorage.setItem('elemento-theme', DEFAULT_THEME);
                localStorage.setItem('elemento-theme-index', DEFAULT_THEME_INDEX.toString());
                log(`Applied system light theme preference, using default: ${DEFAULT_THEME}`);
            }
        } else {
            log('Theme already saved, skipping system preference detection');
        }
        
        // Listen for system theme changes
        mediaQuery.addEventListener('change', (e) => {
            log('System theme preference changed:', { prefersDark: e.matches });
            
            // Only auto-switch if no manual theme is saved
            if (!localStorage.getItem('elemento-theme')) {
                if (e.matches) {
                    // System switched to dark
                    currentThemeIndex = 1;
                    body.classList.remove('theme-light', 'theme-high-contrast');
                    body.classList.add('theme-dark');
                    localStorage.setItem('elemento-theme', 'theme-dark');
                    localStorage.setItem('elemento-theme-index', '1');
                    log('Auto-switched to dark theme due to system change');
                } else {
                    // System switched to light
                    currentThemeIndex = DEFAULT_THEME_INDEX; // Use configured default
                    body.classList.remove('theme-dark', 'theme-high-contrast');
                    body.classList.add(DEFAULT_THEME);
                    localStorage.setItem('elemento-theme', DEFAULT_THEME);
                    localStorage.setItem('elemento-theme-index', DEFAULT_THEME_INDEX.toString());
                    log(`Auto-switched to default theme due to system change: ${DEFAULT_THEME}`);
                }
                updateThemeIcon();
            } else {
                log('Manual theme saved, ignoring system theme change');
            }
        });
    } else {
        log('Warning: matchMedia not supported, skipping system theme detection');
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
    log('DOM loaded, initializing theme system');
    initThemeSystem();
    detectSystemTheme();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    log('DOM still loading, waiting for DOMContentLoaded event');
} else {
    // DOM is already loaded
    log('DOM already loaded, initializing immediately');
    initThemeSystem();
    detectSystemTheme();
} 