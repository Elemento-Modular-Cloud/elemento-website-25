// Navbar Component
class Navbar {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    // Add logging utility
    log(message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[Navbar ${timestamp}] ${message}`;
        console.log(logMessage, data || '');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    // Add method to check if current page is a product page
    isProductPage() {
        const productPages = ['atomos.html', 'electros.html', 'atomosphere.html', /* 'orbital.html', */ 'products.html'];
        return productPages.includes(this.currentPage);
    }

    getBasePath() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        
        // Handle different deployment scenarios:
        // 1. GitHub Pages: /elemento-website-25/index.html -> should return './'
        // 2. Blog posts on GitHub Pages: /elemento-website-25/blog-posts/post.html -> should return '../'
        // 3. Local development: /index.html -> should return './'
        // 4. Local blog posts: /blog-posts/post.html -> should return '../'
        // 5. Forms directory: /forms/form.html -> should return '../'
        
        // Check if we're in the blog-posts directory (works for both GitHub Pages and local)
        if (pathParts.includes('blog-posts')) {
            return '../';
        }
        
        // Check if we're in the forms directory (works for both GitHub Pages and local)
        if (pathParts.includes('forms')) {
            return '../';
        }
        
        // Check if we're in the solutions directory (works for both GitHub Pages and local)
        if (pathParts.includes('solutions')) {
            return '../';
        }
        
        // For GitHub Pages, if we're in the repository root (e.g., /elemento-website-25/), 
        // we should use './' for main pages
        // For local development, if we're at the root, use './'
        return './';
    }

    getActiveClass(page) {
        return this.currentPage === page ? 'active' : '';
    }

    // Check if current page is home page
    isHomePage() {
        return this.currentPage === 'index.html' || this.currentPage === '';
    }

    // Render announcement banner (only on home page)
    renderBanner() {
        if (!this.isHomePage()) {
            return '';
        }
        
        return `
            <a href="https://www.eventbrite.it/e/elemento-keynote-2025-the-cloud-unification-tickets-1717118911889?aff=Website" class="announcement-banner" aria-label="Keynote announcement" target="_blank" rel="noopener noreferrer">
                <div class="banner-content">
                    <span class="banner-text">Join us for our Keynote 2025 in Torino on November 21st!</span>
                    <span class="banner-cta">click here to register</span>
                </div>
            </a>
        `;
    }

    render() {
        const basePath = this.getBasePath();
        
        return `
            ${this.renderBanner()}
            <nav class="navbar ${this.isHomePage() ? 'has-banner' : ''}">
                <div class="nav-container">
                    <a href="${basePath}index.html" class="logo">
                        <div class="logo-icon"></div>
                        <span class="elemento-brand">Elemento</span>
                    </a>
                    
                    <ul class="nav-menu">
                        <li><a href="${basePath}index.html" class="nav-link ${this.getActiveClass('index.html')}">Home</a></li>
                        <li class="dropdown">
                            <a href="${basePath}products.html" class="nav-link ${this.getActiveClass('products.html')}">Products <span class="dropdown-arrow">▼</span></a>
                            <!-- Mobile dropdown menu integrated into nav-menu -->
                            <div class="dropdown-menu mobile-dropdown">
                                <ul>
                                    <li><a href="${basePath}atomos.html" class="dropdown-link ${this.getActiveClass('atomos.html')}">
                                        <img src="${basePath}assets/logos/Atomos.svg" alt="AtomOS icon" class="product-icon" width="20" height="20">
                                        <span class="">AtomOS</span>
                                    </a></li>
                                    <li><a href="${basePath}electros.html" class="dropdown-link ${this.getActiveClass('electros.html')}">
                                        <img src="${basePath}assets/logos/Electros.svg" alt="Electros icon" class="product-icon" width="20" height="20">
                                        <span class="">Electros</span>
                                    </a></li>
                                    <li><a href="${basePath}atomosphere.html" class="dropdown-link ${this.getActiveClass('atomosphere.html')}">
                                        <img src="${basePath}assets/logos/Atomosphere.svg" alt="Atomosphere icon" class="product-icon" width="20" height="20">
                                        <span class="">Atomosphere</span>
                                    </a></li>
                                </ul>
                            </div>
                        </li>
                        <li><a href="${basePath}technology.html" class="nav-link ${this.getActiveClass('technology.html')}">Technology</a></li>
                        <li><a href="${basePath}about.html" class="nav-link ${this.getActiveClass('about.html')}">About</a></li>
                        <li><a href="${basePath}contact.html" class="nav-link ${this.getActiveClass('contact.html')}">Contact</a></li>
                        <li><a href="${basePath}blog.html" class="nav-link ${this.getActiveClass('blog.html')}">Blog</a></li>
                    </ul>

                    <!-- Desktop dropdown menu (separate from mobile) -->
                    <div class="dropdown-menu desktop-dropdown">
                        <div class="container">
                            <ul>
                                <li><a href="${basePath}atomos.html" class="dropdown-link ${this.getActiveClass('atomos.html')}">
                                    <img src="${basePath}assets/logos/Atomos.svg" alt="Atomos icon" class="product-icon" width="20" height="20">
                                    <span class="">AtomOS</span>
                                </a></li>
                                <li><a href="${basePath}electros.html" class="dropdown-link ${this.getActiveClass('electros.html')}">
                                    <img src="${basePath}assets/logos/Electros.svg" alt="Electros icon" class="product-icon" width="20" height="20">
                                    <span class="">Electros</span>
                                </a></li>
                                <li><a href="${basePath}atomosphere.html" class="dropdown-link ${this.getActiveClass('atomosphere.html')}">
                                    <img src="${basePath}assets/logos/Atomosphere.svg" alt="Atomosphere icon" class="product-icon" width="20" height="20">
                                    <span class="">Atomosphere</span>
                                </a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="nav-controls">
                        <button class="theme-toggle" aria-label="Toggle theme">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                            </svg>
                        </button>
                        <button class="mobile-menu-btn" aria-label="Toggle mobile menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    init() {
        // Find the navbar placeholder or insert after body tag
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            navbarPlaceholder.innerHTML = this.render();
        } else {
            // Insert navbar at the beginning of body
            const body = document.body;
            const navbarDiv = document.createElement('div');
            navbarDiv.innerHTML = this.render();
            body.insertBefore(navbarDiv.firstElementChild, body.firstChild);
        }

        // Initialize dropdown functionality
        this.initDropdowns();
        // Initialize mobile menu functionality
        this.initMobileMenu();
        // Initialize theme toggle functionality
        this.initThemeToggle();
        
        // Show dropdown menu if on a product page
        this.showProductDropdown();
    }

    // Add method to show dropdown menu on product pages
    showProductDropdown() {
        if (this.isProductPage()) {
            const desktopDropdownMenu = document.querySelector('.desktop-dropdown');
            
            if (desktopDropdownMenu) {
                desktopDropdownMenu.classList.add('show');
            }
            // Mobile dropdown is always visible when mobile menu is active
        }
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        const desktopDropdownMenu = document.querySelector('.desktop-dropdown'); // Desktop dropdown
        const mobileDropdownMenu = document.querySelector('.mobile-dropdown'); // Mobile dropdown
        
        // Add timeout variables for delay functionality
        let hideTimeout;
        let showTimeout;
        
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');
            
            if (dropdownLink) {
                // Desktop hover functionality with delay
                dropdown.addEventListener('mouseenter', () => {
                    if (window.innerWidth > 768 && desktopDropdownMenu) {
                        // Clear any existing hide timeout
                        clearTimeout(hideTimeout);
                        
                        // Show dropdown immediately on enter
                        desktopDropdownMenu.classList.add('show');
                    }
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    if (window.innerWidth > 768 && !this.isProductPage() && desktopDropdownMenu) {
                        // Set a delay before hiding the dropdown
                        hideTimeout = setTimeout(() => {
                            desktopDropdownMenu.classList.remove('show');
                        }, 300); // 300ms delay
                    }
                });
                
                // Also add mouseenter/mouseleave to the dropdown menu itself
                if (desktopDropdownMenu) {
                    desktopDropdownMenu.addEventListener('mouseenter', () => {
                        if (window.innerWidth > 768) {
                            // Clear any existing hide timeout when hovering over the menu
                            clearTimeout(hideTimeout);
                        }
                    });
                    
                    desktopDropdownMenu.addEventListener('mouseleave', () => {
                        if (window.innerWidth > 768 && !this.isProductPage()) {
                            // Set a delay before hiding the dropdown
                            hideTimeout = setTimeout(() => {
                                desktopDropdownMenu.classList.remove('show');
                            }, 300); // 300ms delay
                        }
                    });
                }
                
                // Mobile/tablet click functionality - Products link is always clickable
                dropdownLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        // Allow normal navigation to products page
                        // The dropdown is always visible in mobile menu
                    }
                });
                

            }
        });
    }

    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });

            // Close mobile menu when clicking on any nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    // Close desktop dropdowns only
                    document.querySelectorAll('.desktop-dropdown.show').forEach(menu => {
                        menu.classList.remove('show');
                    });
                });
            });
            

            
            // Handle dropdown links - they should close the mobile menu
            const dropdownLinks = document.querySelectorAll('.dropdown-link');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    // Close desktop dropdown
                    document.querySelectorAll('.desktop-dropdown.show').forEach(menu => {
                        menu.classList.remove('show');
                    });
                });
            });
        }
    }



    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            // Use the new theme system instead of the old one
            if (window.ElementoThemes) {
                // Update the theme toggle to use the new system
                themeToggle.addEventListener('click', () => {
                    window.ElementoThemes.toggleTheme();
                });
                
                // Update the icon to match the current theme
                this.updateThemeIcon();
            } else {
                this.log('Warning: ElementoThemes not available, falling back to old theme system');
                // Fallback to old system if new system not available
                const savedTheme = localStorage.getItem('theme') || 'default';
                document.body.className = `theme-${savedTheme}`;
                this.updateThemeIcon(savedTheme);

                themeToggle.addEventListener('click', () => {
                    const currentTheme = document.body.className.replace('theme-', '');
                    const newTheme = currentTheme === 'default' ? 'dark' : 'default';
                    
                    document.body.className = `theme-${newTheme}`;
                    localStorage.setItem('theme', newTheme);
                    this.updateThemeIcon(newTheme);
                });
            }
        }
    }

    updateThemeIcon(theme = null) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            if (window.ElementoThemes) {
                // Use the new theme system
                const currentTheme = window.ElementoThemes.getCurrentTheme();
                const currentIndex = window.ElementoThemes.getCurrentThemeIndex();
                
                // Get the icon from the new theme system
                const icons = [
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
                
                themeToggle.innerHTML = icons[currentIndex] || icons[0];
                themeToggle.title = `Current theme: ${window.ElementoThemes.getCurrentThemeName()}`;
            } else {
                // Fallback to old system
                const icons = {
                    'light': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                    </svg>`,
                    'dark': `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" transform="scale(-1, -1) rotate(-10)">
                        <path d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"/>
                    </svg>`
                };
                themeToggle.innerHTML = icons[theme] || icons['light'];
            }
        }
    }
}

// Auto-initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});

// Export for manual initialization if needed
window.Navbar = Navbar; 