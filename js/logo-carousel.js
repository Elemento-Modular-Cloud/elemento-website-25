/**
 * Dynamic Logo Carousel
 * Loads company logos from success-stories.json and creates a continuous scrolling carousel
 */

class LogoCarousel {
    constructor(containerId, dataUrl) {
        this.container = document.getElementById(containerId);
        this.dataUrl = dataUrl;
        this.companies = [];
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Initializing Logo Carousel...');
            await this.loadCompanies();
            console.log(`📊 Loaded ${this.companies.length} company logos`);
            this.render();
            console.log('✅ Logo carousel initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing logo carousel:', error);
            this.showFallback();
        }
    }
    
    async loadCompanies() {
        const response = await fetch(this.dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.companies = await response.json();
    }
    
    render() {
        if (!this.container || this.companies.length === 0) {
            console.log('❌ Container not found or no companies loaded');
            return;
        }
        
        console.log('�� Rendering logo carousel with', this.companies.length, 'companies');
        
        // Create the logo track with duplicated logos for seamless scrolling
        const logoItems = this.companies.map(company => this.renderLogoItem(company)).join('');
        const duplicatedLogos = logoItems + logoItems; // Duplicate for seamless loop
        
        this.container.innerHTML = `
            <div class="logo-track">
                ${duplicatedLogos}
            </div>
        `;
        
        // Add event listeners for hover effects
        this.bindEvents();
    }
    
    renderLogoItem(company) {
        return `
            <div class="logo-item" data-company="${company.company}">
                <img src="${company.logo}" 
                     alt="${company.company} logo" 
                     class="company-logo-carousel"
                     onload="this.classList.add('loaded')" 
                     onerror="this.style.display='none'; this.parentElement.style.display='none';">
            </div>
        `;
    }
    
    bindEvents() {
        const logoTrack = this.container.querySelector('.logo-track');
        const logoItems = this.container.querySelectorAll('.logo-item');
        
        // Pause animation on hover
        if (logoTrack) {
            logoTrack.addEventListener('mouseenter', () => {
                logoTrack.style.animationPlayState = 'paused';
            });
            
            logoTrack.addEventListener('mouseleave', () => {
                logoTrack.style.animationPlayState = 'running';
            });
        }
        
        // Add click events to logo items (optional - for future functionality)
        logoItems.forEach(item => {
            item.addEventListener('click', () => {
                const companyName = item.dataset.company;
                console.log(`Clicked on ${companyName} logo`);
                // Future: Could open a modal with company details or navigate to success story
            });
        });
    }
    
    showFallback() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="logo-carousel-fallback">
                    <p>Trusted by leading companies across industries</p>
                    <div class="fallback-logos">
                        <div class="fallback-logo">OLCI Engineering</div>
                        <div class="fallback-logo">Marcopolo Spa</div>
                        <div class="fallback-logo">Brandsider Srl</div>
                        <div class="fallback-logo">360 Aligners Academy</div>
                        <div class="fallback-logo">Giacomo Tomatis Srl</div>
                        <div class="fallback-logo">Dynamo Spa</div>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize the logo carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const logoCarouselContainer = document.getElementById('logo-carousel');
    if (logoCarouselContainer) {
        new LogoCarousel('logo-carousel', 'CMS/success-stories.json');
    }
});
