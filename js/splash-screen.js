/**
 * Splash Screen Management
 * Handles the display and hiding of the splash screen to prevent layout shifts
 */

class SplashScreen {
    constructor() {
        this.splashScreen = document.getElementById('splash-screen');
        this.body = document.body;
        this.isHidden = false;
        this.minDisplayTime = 1000; // Minimum time to show splash screen (1 second)
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        if (!this.splashScreen) {
            console.warn('Splash screen element not found');
            return;
        }
        
        // Add loading class to body
        this.body.classList.add('splash-loading');
        
        // Wait for critical resources to load
        this.waitForCriticalResources();
    }
    
    waitForCriticalResources() {
        const criticalResources = [
            // Critical CSS files
            'css/style.css',
            'css/themes.css',
            'css/splash-screen.css',
            // Critical fonts
            'assets/font/ArgentPixel/Web/ArgentPixel/ArgentPixel-Regular.woff2',
            'assets/font/ArgentPixel/Web/ArgentPixel/ArgentPixel-RegularItalic.woff2',
            // Critical images
            'assets/logos/Elemento.svg'
        ];
        
        let loadedResources = 0;
        const totalResources = criticalResources.length;
        
        const checkResource = (url) => {
            return new Promise((resolve) => {
                if (url.endsWith('.css')) {
                    // For CSS files, check if they're already loaded
                    const link = document.querySelector(`link[href="${url}"]`);
                    if (link && link.sheet) {
                        resolve();
                    } else {
                        // Wait a bit for CSS to load
                        setTimeout(resolve, 100);
                    }
                } else if (url.endsWith('.woff2')) {
                    // For fonts, check if they're loaded
                    const font = new FontFace('Argent Pixel', `url(${url})`);
                    font.load().then(() => resolve()).catch(() => resolve());
                } else {
                    // For images, create an Image object to check loading
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // Continue even if image fails
                    img.src = url;
                }
            });
        };
        
        // Check all critical resources
        Promise.all(criticalResources.map(checkResource)).then(() => {
            this.hideSplashScreen();
        });
        
        // Fallback: hide splash screen after maximum time
        setTimeout(() => {
            if (!this.isHidden) {
                this.hideSplashScreen();
            }
        }, 3000); // Maximum 3 seconds
    }
    
    hideSplashScreen() {
        if (this.isHidden) return;
        
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
        
        setTimeout(() => {
            this.splashScreen.classList.add('hidden');
            this.body.classList.remove('splash-loading');
            this.isHidden = true;
            
            // Remove splash screen from DOM after animation
            setTimeout(() => {
                if (this.splashScreen && this.splashScreen.parentNode) {
                    this.splashScreen.parentNode.removeChild(this.splashScreen);
                }
            }, 500);
            
            // Dispatch event for other scripts
            document.dispatchEvent(new CustomEvent('splashScreenHidden'));
            
        }, remainingTime);
    }
}

// Initialize splash screen when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SplashScreen();
});

// Export for use in other scripts
window.SplashScreen = SplashScreen; 