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
        
        // If we're in a subdirectory (like blog-posts/), we need to go up one level
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
        
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <a href="${basePath}index.html" class="logo">
                        <div class="logo-icon">E</div>
                        <span>Elemento</span>
                    </a>
                    
                    <ul class="nav-menu">
                        <li><a href="${basePath}index.html" class="nav-link ${this.getActiveClass('index.html')}">Home</a></li>
                        <li><a href="${basePath}products.html" class="nav-link ${this.getActiveClass('products.html')}">Products</a></li>
                        <li><a href="${basePath}technology.html" class="nav-link ${this.getActiveClass('technology.html')}">Technology</a></li>
                        <li><a href="${basePath}about.html" class="nav-link ${this.getActiveClass('about.html')}">About</a></li>
                        <li><a href="${basePath}contact.html" class="nav-link ${this.getActiveClass('contact.html')}">Contact</a></li>
                        <li><a href="${basePath}blog.html" class="nav-link ${this.getActiveClass('blog.html')}">Blog</a></li>
                    </ul>
                    
                    <div class="nav-controls">
                        <button class="theme-toggle" aria-label="Toggle theme">🌞</button>
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

        // Initialize mobile menu functionality
        this.initMobileMenu();
        // Initialize theme toggle functionality
        this.initThemeToggle();
    }

    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
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
            themeToggle.textContent = theme === 'dark' ? '🌙' : '🌞';
        }
    }
}

// Auto-initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});

// Export for manual initialization if needed
window.Navbar = Navbar; 