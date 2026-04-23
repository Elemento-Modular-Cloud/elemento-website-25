// Elemento Website Theme Switcher

// Theme configuration
const themes = ['theme-light', 'theme-dark', 'theme-high-contrast'];
const DEFAULT_THEME_INDEX = 0; // 0 = light, 1 = dark, 2 = high-contrast
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

const THEME_PREFERENCE_KEY = 'elemento-theme-preference';
const THEME_STORAGE_KEY = 'elemento-theme';
const THEME_INDEX_STORAGE_KEY = 'elemento-theme-index';

let themeSystemInitialized = false;
let systemThemeListenerAttached = false;

function getThemePreferenceMode() {
    try {
        const pref = localStorage.getItem(THEME_PREFERENCE_KEY);
        if (pref === 'system' || pref === 'manual') {
            return pref;
        }
        if (localStorage.getItem(THEME_STORAGE_KEY)) {
            return 'manual';
        }
    } catch (e) {
        /* private mode / blocked storage */
    }
    return 'system';
}

function persistEffectiveTheme(themeClass, index) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, themeClass);
        localStorage.setItem(THEME_INDEX_STORAGE_KEY, index.toString());
    } catch (e) {
        console.log('Could not persist theme to localStorage');
    }
}

function applySystemThemeFromPrefersDark(prefersDark) {
    currentThemeIndex = prefersDark ? 1 : 0;
    const themeClass = prefersDark ? 'theme-dark' : 'theme-light';
    body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    body.classList.add(themeClass);
    try {
        localStorage.setItem(THEME_PREFERENCE_KEY, 'system');
    } catch (e) {
        /* ignore */
    }
    persistEffectiveTheme(themeClass, currentThemeIndex);
}

function subscribeToSystemThemeChanges() {
    if (!window.matchMedia || systemThemeListenerAttached) {
        return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
        if (getThemePreferenceMode() !== 'system') {
            return;
        }
        console.log('System theme preference changed:', { prefersDark: e.matches });
        applySystemThemeFromPrefersDark(e.matches);
        updateThemeIcon();
        notifyIframesOfThemeChange(themes[currentThemeIndex]);
    };
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onChange);
    } else {
        mediaQuery.addListener(onChange);
    }
    systemThemeListenerAttached = true;
}

// Get DOM elements
const btnClass = '.theme-toggle';
const themeToggleBtn = document.querySelector(btnClass);
const body = document.body;

// Initialize theme switcher
function initThemeSwitcher() {
    console.log('Initializing theme switcher');
    
    // Create theme switcher if it doesn't exist
        if (!document.querySelector(btnClass)) {
        console.log('Creating theme switcher element');
        const themeSwitcher = document.createElement('div');
        themeSwitcher.className = 'theme-switcher';
        themeSwitcher.innerHTML = `
            <button class="theme-toggle" title="Toggle theme">
                ${themeIcons[currentThemeIndex]}
            </button>
        `;
        // document.body.appendChild(themeSwitcher);
        
        // Add event listener to the new button
        const newThemeToggleBtn = themeSwitcher.querySelector(btnClass);
        newThemeToggleBtn.addEventListener('click', toggleTheme);
        console.log('Theme switcher created and event listener added');
    } else {
        console.log('Theme switcher already exists');
    }
}

// Toggle theme function
function toggleTheme() {
    const previousTheme = themes[currentThemeIndex];
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    console.log(`Toggling theme from ${previousTheme} to ${newTheme}`, {
        previousIndex: (currentThemeIndex - 1 + themes.length) % themes.length,
        newIndex: currentThemeIndex,
        themeName: getThemeName(currentThemeIndex)
    });
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    
    // Add new theme class
    body.classList.add(newTheme);
    
    try {
        localStorage.setItem(THEME_PREFERENCE_KEY, 'manual');
    } catch (e) {
        /* ignore */
    }
    persistEffectiveTheme(newTheme, currentThemeIndex);

    console.log(`Theme saved to localStorage: ${newTheme}`);

    // Update button icon
    updateThemeIcon();
    
    // Notify iframes of theme change
    notifyIframesOfThemeChange(newTheme);
}

// Notify iframes of theme changes
function notifyIframesOfThemeChange(theme) {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            iframe.contentWindow.postMessage({
                type: 'theme-change',
                theme: theme
            }, '*');
        } catch (error) {
            console.log('Could not notify iframe of theme change:', error);
        }
    });
}

// Listen for theme requests from iframes
window.addEventListener('message', function(event) {
    if (event.data.type === 'request-theme') {
        const currentTheme = themes[currentThemeIndex];
        try {
            event.source.postMessage({
                type: 'theme-change',
                theme: currentTheme
            }, '*');
        } catch (error) {
            console.log('Could not send theme to iframe:', error);
        }
    }
});

// Update theme icon
function updateThemeIcon() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.innerHTML = themeIcons[currentThemeIndex];
        btn.title = `Current theme: ${getThemeName(currentThemeIndex)}`;
        console.log(`Updated theme icon to: ${getThemeName(currentThemeIndex)}`);
    } else {
        console.log('Warning: Theme toggle button not found');
    }
}

// Get theme name
function getThemeName(index) {
    const names = ['Light', 'Dark', 'High Contrast'];
    return names[index];
}

// Theme change notifications have been removed per user request

// Resolve initial theme: manual choice, or system light/dark when not manually set
function loadSavedTheme() {
    console.log('Loading theme preference');

    const mode = getThemePreferenceMode();
    console.log('Theme preference mode:', mode);

    if (mode === 'manual') {
        let savedTheme = null;
        let savedIndex = null;
        try {
            if (!localStorage.getItem(THEME_PREFERENCE_KEY)) {
                localStorage.setItem(THEME_PREFERENCE_KEY, 'manual');
            }
            savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            savedIndex = localStorage.getItem(THEME_INDEX_STORAGE_KEY);
        } catch (e) {
            console.log('localStorage not available (private navigation?), using defaults');
        }

        console.log('Saved manual theme data:', { savedTheme, savedIndex });

        if (savedTheme && themes.includes(savedTheme)) {
            body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
            body.classList.add(savedTheme);
            if (savedIndex !== null && savedIndex !== '') {
                currentThemeIndex = parseInt(savedIndex, 10);
            } else {
                currentThemeIndex = themes.indexOf(savedTheme);
            }
            if (currentThemeIndex < 0 || currentThemeIndex >= themes.length) {
                currentThemeIndex = themes.indexOf(savedTheme);
            }
            console.log(`Loaded manual theme: ${savedTheme} (index: ${currentThemeIndex})`);
        } else {
            const existingTheme = themes.find(theme => body.classList.contains(theme));
            if (existingTheme) {
                currentThemeIndex = themes.indexOf(existingTheme);
                console.log(`Using existing body class: ${existingTheme} (index: ${currentThemeIndex})`);
            } else {
                body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
                body.classList.add(DEFAULT_THEME);
                currentThemeIndex = DEFAULT_THEME_INDEX;
                console.log(`Fallback default: ${DEFAULT_THEME}`);
            }
        }
    } else {
        const prefersDark = window.matchMedia
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : false;
        console.log('Applying system theme preference:', { prefersDark });
        applySystemThemeFromPrefersDark(prefersDark);
        subscribeToSystemThemeChanges();
    }

    updateThemeIcon();
    notifyIframesOfThemeChange(themes[currentThemeIndex]);
}

// Initialize theme system
function initThemeSystem() {
    if (themeSystemInitialized) {
        return;
    }
    themeSystemInitialized = true;

    console.log('Initializing theme system');
    console.log('Configuration:', {
        themes,
        DEFAULT_THEME_INDEX,
        DEFAULT_THEME,
        currentThemeIndex
    });

    loadSavedTheme();
    
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Add keyboard shortcut (Ctrl/Cmd + T)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            console.log('Theme toggle triggered via keyboard shortcut (Ctrl/Cmd + T)');
            toggleTheme();
        }
    });
    
    console.log('Theme system initialization complete');
}

// Export functions for global access
window.ElementoThemes = {
    toggleTheme,
    getCurrentTheme: () => themes[currentThemeIndex],
    getCurrentThemeName: () => getThemeName(currentThemeIndex),
    getCurrentThemeIndex: () => currentThemeIndex
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing theme system');
    initThemeSystem();
});

if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded event');
} else {
    console.log('DOM already loaded, initializing immediately');
    initThemeSystem();
}