// Navbar Component
class Navbar {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    getBasePath() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        
        // Handle different deployment scenarios:
        // 1. GitHub Pages: /elemento-website-25/index.html -> need to go up one level
        // 2. Local development: /index.html -> no need to go up
        // 3. Local subdirectory: /blog-posts/post.html -> need to go up one level
        
        // For GitHub Pages, we need to go up one level from the repository root
        // For local development, we need to go up one level if we're in a subdirectory
        if (pathParts.length > 1) {
            return '../';
        }
        return './';
    }

    getActiveClass(page) {
        return this.currentPage === page ? 'active' : '';
    }

    render() {
        const basePath = this.getBasePath();
        
        // Use absolute paths from the root to avoid path issues
        const pathParts = window.location.pathname.split('/').filter(part => part !== '');
        const rootPath = "./" //pathParts.length > 1 ? '/' + pathParts[0] + '/' : '/';

        
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <a href="${rootPath}index.html" class="logo">
                        <div class="logo-icon"></div>
                        <span class="elemento-brand">Elemento</span>
                    </a>
                    
                    <ul class="nav-menu">
                        <li><a href="${rootPath}index.html" class="nav-link ${this.getActiveClass('index.html')}">Home</a></li>
                        <li class="dropdown">
                            <a href="${rootPath}products.html" class="nav-link ${this.getActiveClass('products.html')}">Products <span class="dropdown-arrow">▼</span></a>
                            <div class="dropdown-menu">
                                <div class="container">
                                    <ul>
                                        <li><a href="${rootPath}atomos.html" class="dropdown-link ${this.getActiveClass('atomos.html')}">
                                            <img src="${rootPath}assets/logos/Atomos.svg" alt="Atomos icon" class="product-icon">
                                            <span class="">Atomos</span>
                                        </a></li>
                                        <li><a href="${rootPath}electros.html" class="dropdown-link ${this.getActiveClass('electros.html')}">
                                            <img src="${rootPath}assets/logos/Electros.svg" alt="Electros icon" class="product-icon">
                                            <span class="">Electros</span>
                                        </a></li>
                                        <li><a href="${rootPath}cloud-network.html" class="dropdown-link ${this.getActiveClass('cloud-network.html')}">
                                            <img src="${rootPath}assets/logos/Cloud Network.svg" alt="Cloud Network icon" class="product-icon">
                                            <span class="">Cloud Network</span>
                                        </a></li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li><a href="${rootPath}technology.html" class="nav-link ${this.getActiveClass('technology.html')}">Technology</a></li>
                        <li><a href="${rootPath}about.html" class="nav-link ${this.getActiveClass('about.html')}">About</a></li>
                        <li><a href="${rootPath}contact.html" class="nav-link ${this.getActiveClass('contact.html')}">Contact</a></li>
                        <li><a href="${rootPath}blog.html" class="nav-link ${this.getActiveClass('blog.html')}">Blog</a></li>
                    </ul>
                    
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
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            
            if (dropdownLink && dropdownMenu) {
                // Desktop hover functionality
                dropdown.addEventListener('mouseenter', () => {
                    if (window.innerWidth > 768) {
                        dropdownMenu.classList.add('show');
                    }
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    if (window.innerWidth > 768) {
                        dropdownMenu.classList.remove('show');
                    }
                });
                
                // Mobile/tablet click functionality
                dropdownLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Close other dropdowns first
                        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                            if (menu !== dropdownMenu) {
                                menu.classList.remove('show');
                            }
                        });
                        
                        // Toggle current dropdown
                        dropdownMenu.classList.toggle('show');
                    }
                });
                
                // Close dropdown when clicking outside (for mobile)
                document.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768 && !dropdown.contains(e.target) && dropdownMenu.classList.contains('show')) {
                        dropdownMenu.classList.remove('show');
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

            // Close mobile menu when clicking on a link (but not dropdown triggers)
            const navLinks = document.querySelectorAll('.nav-link:not(.dropdown .nav-link), .dropdown-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    // Also close any open dropdowns
                    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                        menu.classList.remove('show');
                    });
                });
            });
        }
    }



    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            // Load saved theme
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

    updateThemeIcon(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
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

// Auto-initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});

// Export for manual initialization if needed
window.Navbar = Navbar; 