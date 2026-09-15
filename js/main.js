/**
 * Elemento Website - Main JavaScript
 * Based on elemento-gui-new styling and functionality
 */

/** Resolve site-root-relative paths (assets/…) for the current page depth/locale. */
function resolveSiteAssetPath(relativePath) {
    const path = String(relativePath).replace(/^\//, '').replace(/^\.\//, '');
    if (window.ElementoI18n?.assetUrl) {
        return window.ElementoI18n.assetUrl(path);
    }
    return path;
}

/** Prefix embedded logo paths inside injected diagram SVGs (xlink:href / href). */
function rewriteDiagramEmbeddedAssets(svgContent) {
    return svgContent.replace(
        /(\s(?:xlink:)?href=["'])(\.\/)?(assets\/[^"']+)(["'])/g,
        (_match, prefix, _dot, assetPath, quote) =>
            `${prefix}${resolveSiteAssetPath(assetPath)}${quote}`
    );
}

/** Remove duplicate attributes from SVG markup (Firefox rejects them; Lucid exports often include dupes). */
function dedupeSvgAttributes(svgContent) {
    let result = '';
    let i = 0;

    while (i < svgContent.length) {
        if (svgContent[i] !== '<') {
            result += svgContent[i++];
            continue;
        }

        let j = i + 1;
        let quote = null;
        while (j < svgContent.length) {
            const ch = svgContent[j];
            if (quote) {
                if (ch === quote) quote = null;
            } else if (ch === '"' || ch === "'") {
                quote = ch;
            } else if (ch === '>') {
                break;
            }
            j++;
        }

        result += dedupeSvgTagAttributes(svgContent.slice(i, j + 1));
        i = j + 1;
    }

    return result;
}

function dedupeSvgTagAttributes(tag) {
    if (tag.startsWith('</') || tag.startsWith('<?') || tag.startsWith('<!')) {
        return tag;
    }

    const tagNameMatch = tag.match(/^<\s*([\w:-]+)/);
    if (!tagNameMatch) return tag;

    const attrRegex = /([\w:-]+)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
    const seen = new Set();
    const attrs = [];
    let match;
    while ((match = attrRegex.exec(tag)) !== null) {
        if (!seen.has(match[1])) {
            seen.add(match[1]);
            attrs.push(`${match[1]}=${match[2]}`);
        }
    }

    if (!attrs.length) return tag;

    const selfClose = tag.trimEnd().endsWith('/>') ? ' />' : '>';
    return `<${tagNameMatch[1]} ${attrs.join(' ')}${selfClose}`;
}

function resolveDiagramContainer(containerSelector) {
    return typeof containerSelector === 'string'
        ? document.querySelector(containerSelector)
        : containerSelector;
}

class ElementoWebsite {
    constructor() {
        // this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isScrolled = false;
        // this.backgroundCanvas = null;
        this.init();
    }

    init() {
        // this.setupTheme(); // Removed - theme system now handled by themes.js
        this.setupNavigation();
        // this.setupBackgroundCanvas();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupForms();
        // Mobile menu is handled by navbar.js
        this.setupKeyboardShortcuts();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
    }

    // setupTheme method removed - now handled by themes.js

    // toggleTheme method removed - now handled by themes.js

    // updateThemeIcon method removed - now handled by themes.js

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Smooth scrolling for anchor links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only prevent default for in-page anchors
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            if (scrolled !== this.isScrolled) {
                this.isScrolled = scrolled;
                navbar.classList.toggle('scrolled', scrolled);
                

            }
        });

        // Active link highlighting
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        // Batch DOM reads to avoid forced reflows
        const sectionData = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            height: section.clientHeight
        }));
        
        sectionData.forEach(section => {
            if (window.scrollY >= section.top - 200) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    setupScrollEffects() {
        // Background fade effect on scroll
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateBackgroundOpacity = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollProgress = scrollY / (documentHeight - windowHeight);
            
            // Mobile scroll effects for product icon and background blob
            if (window.innerWidth <= 1000) {
                this.updateMobileScrollEffects(scrollY, windowHeight);
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(updateBackgroundOpacity);
                ticking = true;
            }
        });

        // Scroll-based animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    updateMobileScrollEffects(scrollY, windowHeight) {
        // Get the hero product icon and background blur elements
        const productIcon = document.querySelector('.hero-product-icon');
        const heroBlur = document.querySelector('.hero-blur');
        
        if (!heroBlur) return; // Only require heroBlur to exist
        
        // Calculate fade progress based on scroll position
        // Start fading when scroll reaches 20% of viewport height
        const fadeStart = windowHeight * 0;
        const fadeEnd = windowHeight * 1;
        const scrollProgress = Math.max(0, Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart)));
        
        // Product icon: fade to completely transparent (if it exists)
        if (productIcon) {
            productIcon.style.transform = `translate(-50%, calc(-50% - ${scrollY}px * .9))`;
        }
        
        // Background blob: fade to more subtle (reduce blur and opacity)
        const blurOpacity = Math.max(0.3, 1 - (scrollProgress * 0.7)); // Keep some opacity
        
        heroBlur.style.opacity = blurOpacity;
    }

    setupAnimations() {
        // Fade in animations on page load
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });

        // Card hover effects
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }

    setupForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });

            // Form validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            form.reset();
        }, 2000);
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        // Remove existing error
        this.clearFieldError(field);
        
        // Basic validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, `${fieldName} is required`);
            return false;
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--red)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--red)';
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }



    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Theme toggle (Ctrl/Cmd + T) is now handled by themes.js
            
            // Escape key handling is managed by navbar.js for mobile menu
        });
    }

    setupPerformanceOptimizations() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Debounced scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Perform scroll-based operations
                this.updateActiveNavLink();
            }, 16); // ~60fps
        });
    }

    setupAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: var(--button-text-color);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // ARIA labels for interactive elements
        document.querySelectorAll('.btn').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });

        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    showToast(message, type = 'info', duration = 5000) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" aria-label="Close notification">×</button>
            </div>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glassmorphism-background);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glassmorphism-border);
            border-radius: var(--card-border-radius);
            padding: var(--space-lg);
            box-shadow: var(--glassmorphism-shadow);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            color: var(--text-color);
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hideToast(toast);
        });

        // Auto-hide after duration
        setTimeout(() => {
            this.hideToast(toast);
        }, duration);
    }

    hideToast(toast) {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // SVG Injection functionality
    async injectSVGDiagram(containerSelector, svgPath = null) {
        const container = resolveDiagramContainer(containerSelector);
        if (!container) {
            console.error(`Container not found: ${containerSelector}`);
            return;
        }

        try {
            // Get the SVG path from the src attribute if not provided
            const rawPath = svgPath || container.getAttribute('src');
            if (!rawPath) {
                console.error(`No SVG path provided and no src attribute found on container`, container);
                return;
            }

            const pathToUse = /^(https?:|\/\/|\/)/.test(rawPath)
                ? rawPath
                : resolveSiteAssetPath(rawPath.replace(/^\.\//, ''));

            // Fetch the SVG content
            const response = await fetch(pathToUse);
            if (!response.ok) {
                throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
            }

            const svgContent = dedupeSvgAttributes(await response.text());
            
            // Parse the SVG to extract dimensions and transforms
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const parseError = svgDoc.querySelector('parsererror');
            const svgElement = svgDoc.documentElement?.localName === 'svg'
                ? svgDoc.documentElement
                : svgDoc.querySelector('svg');
            
            if (!svgElement) {
                const detail = parseError?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 200);
                throw new Error(detail ? `Invalid SVG markup: ${detail}` : 'No SVG element found in the content');
            }

            // Extract original dimensions
            const originalWidth = parseFloat(svgElement.getAttribute('width') || '0');
            const originalHeight = parseFloat(svgElement.getAttribute('height') || '0');
            
            // Find the main group with transform to calculate actual content bounds
            const mainGroup = svgElement.querySelector('g[transform]');
            let viewBox = null;
            
            if (mainGroup) {
                const transform = mainGroup.getAttribute('transform');
                const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                
                if (translateMatch) {
                    const translateX = parseFloat(translateMatch[1]);
                    const translateY = parseFloat(translateMatch[2]);
                    
                    // Calculate the actual content bounds
                    const contentWidth = originalWidth + Math.abs(translateX);
                    const contentHeight = originalHeight + Math.abs(translateY);
                    
                    // Create a viewBox that encompasses all the content
                    viewBox = `0 0 ${contentWidth} ${contentHeight}`;
                }
            }
            
            // If we couldn't calculate viewBox, use the original dimensions
            if (!viewBox) {
                viewBox = `0 0 ${originalWidth} ${originalHeight}`;
            }
            
            // Add viewBox and make the SVG responsive
            let processedSvgContent = svgContent;
            
            // Remove existing viewBox if present
            processedSvgContent = processedSvgContent.replace(/viewBox="[^"]*"/g, '');
            
            // Add the calculated viewBox and make it responsive
            processedSvgContent = processedSvgContent.replace(
                /<svg([^>]*)>/,
                `<svg$1 viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%;">`
            );

            processedSvgContent = rewriteDiagramEmbeddedAssets(processedSvgContent);

            // Use requestAnimationFrame to batch DOM writes and avoid forced reflows
            requestAnimationFrame(() => {
                container.innerHTML = processedSvgContent;
            });
            
            console.log(`SVG injected successfully from ${pathToUse} with viewBox: ${viewBox}`);
        } catch (error) {
            console.error('Error injecting SVG:', error);
            requestAnimationFrame(() => {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <p>Unable to load diagram</p>
                        <small>Please refresh the page to try again</small>
                    </div>
                `;
            });
        }
    }

    // Initialize SVG diagrams when DOM is ready
    setupSVGDiagrams() {
        // Find all containers with diagram-svg class and inject their SVGs
        const diagramContainers = document.querySelectorAll('.diagram-svg');
        diagramContainers.forEach((container) => {
            const src = container.getAttribute('src');
            if (src) {
                this.injectSVGDiagram(container, null);
            } else {
                console.error('No src attribute found on diagram-svg container at:', container);
            }
        });
    }
}

// FAQ functionality is now handled by js/faq.js

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.elementoWebsite = new ElementoWebsite();
    
    // Setup SVG diagrams after initialization
    if (window.elementoWebsite) {
        window.elementoWebsite.setupSVGDiagrams();
    }
});

 