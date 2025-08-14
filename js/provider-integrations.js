/**
 * Provider Integrations Table Handler
 * Automatically populates provider integration tables from JSON data
 */

console.log('📦 Provider Integrations Handler script loaded');

class ProviderIntegrationsHandler {
    constructor() {
        this.providers = [];
        this.tableContainer = null;
        this.statusCards = null;
        this.initialized = false;
    }

    /**
     * Initialize the handler
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup the handler and load data
     */
    setup() {
        console.log('🚀 Initializing Provider Integrations Handler...');
        
        // Find the table container
        this.tableContainer = document.querySelector('.comparison-table tbody');
        this.statusCards = document.querySelectorAll('.grid.grid-3 .card');
        
        console.log('🎯 Table container found:', !!this.tableContainer);
        console.log('🎯 Status cards found:', this.statusCards.length);
        
        if (!this.tableContainer) {
            console.error('❌ Could not find comparison table tbody');
            console.error('🔍 Available tables:', document.querySelectorAll('table').length);
            console.error('🔍 Available tbody elements:', document.querySelectorAll('tbody').length);
            return;
        }

        // Load data from JSON
        this.loadData();
    }

    /**
     * Load data from JSON
     */
    async loadData() {
        try {
            console.log('🔍 Attempting to fetch provider-integrations.json...');
            
            // Test if the file exists first
            const testResponse = await fetch('CMS/provider-integrations.json', { method: 'HEAD' });
            console.log('🔍 File exists check:', testResponse.status);
            
            const response = await fetch('CMS/provider-integrations.json');
            console.log('📡 Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.providers = await response.json();
            console.log('📊 Loaded provider data:', this.providers.length, 'providers');
            console.log('📋 First provider:', this.providers[0]);
            this.renderTable();
            this.renderStatusCards();
        } catch (error) {
            console.error('❌ Failed to load provider data:', error);
            console.error('📍 Error details:', {
                message: error.message,
                stack: error.stack
            });
            
            // Show a more detailed error message
            if (this.tableContainer) {
                this.tableContainer.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            <p>Failed to load provider data.</p>
                            <p style="font-size: 0.8rem; margin-top: 1rem;">Error: ${error.message}</p>
                            <p style="font-size: 0.8rem;">Please check the browser console for details.</p>
                        </td>
                    </tr>
                `;
            }
        }
    }

    /**
     * Render the comparison table
     */
    renderTable() {
        if (!this.tableContainer) return;

        // Sort providers by status priority
        const sortedProviders = this.sortProvidersByStatus(this.providers);
        console.log('📊 Sorted providers by status:', sortedProviders.map(p => `${p.provider} (${p.status})`));

        const html = sortedProviders.map((provider, index) => {
            const rowClass = index % 2 === 0 ? 'comparison-table-row-alt' : 'comparison-table-row';
            
            return `
                <tr class="${rowClass}">
                    <td class="comparison-table-cell"><strong>${provider.provider}</strong></td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.vmManagement)}">${this.getStatusIcon(provider.vmManagement)} ${this.getStatusText(provider.vmManagement)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.storageAas)}">${this.getStatusIcon(provider.storageAas)} ${this.getStatusText(provider.storageAas)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.networking)}">${this.getStatusIcon(provider.networking)} ${this.getStatusText(provider.networking)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.k8s)}">${this.getStatusIcon(provider.k8s)} ${this.getStatusText(provider.k8s)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.costApi)}">${this.getStatusIcon(provider.costApi)} ${this.getStatusText(provider.costApi)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.status)}">${this.getStatusBadge(provider.status)}</td>
                </tr>
            `;
        }).join('');

        this.tableContainer.innerHTML = html;
        console.log('✅ Provider table rendered successfully');
    }

    /**
     * Render status summary cards
     */
    renderStatusCards() {
        if (!this.statusCards || this.statusCards.length < 3) return;

        const statusGroups = this.groupProvidersByStatus();
        
        // Production Ready card
        if (this.statusCards[0]) {
            const productionProviders = statusGroups.production || [];
            this.statusCards[0].querySelector('p').textContent = productionProviders.join(', ');
        }

        // Beta Testing card
        if (this.statusCards[1]) {
            const betaProviders = [...(statusGroups.beta || []), ...(statusGroups.soon || [])];
            this.statusCards[1].querySelector('p').textContent = betaProviders.join(', ');
        }

        // In Development card
        if (this.statusCards[2]) {
            const devProviders = statusGroups.development || [];
            this.statusCards[2].querySelector('p').textContent = devProviders.join(', ');
        }

        console.log('✅ Status cards updated successfully');
    }

    /**
     * Group providers by status
     */
    groupProvidersByStatus() {
        const groups = {};
        
        this.providers.forEach(provider => {
            const status = provider.status;
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(provider.provider);
        });

        return groups;
    }

    /**
     * Get CSS class for status
     */
    getStatusClass(status) {
        const statusMap = {
            'full': 'success',
            'partial': 'warning',
            'planned': 'error',
            'na': 'error',
            'production': 'success',
            'beta': 'warning',
            'soon': 'success',
            'development': 'error'
        };
        return statusMap[status] || 'error';
    }

    /**
     * Get status icon
     */
    getStatusIcon(status) {
        const iconMap = {
            'full': '<i class="fas fa-check" style="color: var(--green);"></i>',
            'partial': '<i class="fas fa-clock" style="color: var(--yellow);"></i>',
            'planned': '<i class="fas fa-times" style="color: var(--red);"></i>',
            'na': '',
            'production': '<i class="fas fa-check" style="color: var(--green);"></i>',
            'beta': '<i class="fas fa-clock" style="color: var(--yellow);"></i>',
            'soon': '<i class="fas fa-check" style="color: var(--green);"></i>',
            'development': '<i class="fas fa-times" style="color: var(--red);"></i>'
        };
        return iconMap[status] || '<i class="fas fa-times" style="color: var(--red);"></i>';
    }

    /**
     * Get status text
     */
    getStatusText(status) {
        const textMap = {
            'full': 'Full',
            'partial': 'Partial',
            'planned': 'Planned',
            'na': 'N/A',
            'production': 'Production',
            'beta': 'Beta',
            'soon': 'Soon!',
            'development': 'Development'
        };
        return textMap[status] || 'Planned';
    }

    /**
     * Get status badge
     */
    getStatusBadge(status) {
        const badgeMap = {
            'production': '<span style="background: var(--green); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Production</span>',
            'beta': '<span style="background: var(--yellow); color: black; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Beta</span>',
            'soon': '<span style="background: var(--purple); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Soon!</span>',
            'development': '<span style="background: var(--red); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Development</span>'
        };
        return badgeMap[status] || '<span style="background: var(--red); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Development</span>';
    }

    /**
     * Sort providers by status priority
     */
    sortProvidersByStatus(providers) {
        // Define status priority order (highest to lowest)
        const statusPriority = {
            'production': 1,
            'soon': 2,
            'beta': 3,
            'development': 4
        };

        return [...providers].sort((a, b) => {
            const priorityA = statusPriority[a.status] || 999;
            const priorityB = statusPriority[b.status] || 999;
            
            // If same priority, sort alphabetically by provider name
            if (priorityA === priorityB) {
                return a.provider.localeCompare(b.provider);
            }
            
            return priorityA - priorityB;
        });
    }

    /**
     * Show error state
     */
    showError() {
        if (this.tableContainer) {
            this.tableContainer.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <p>Failed to load provider data. Please check the data files.</p>
                    </td>
                </tr>
            `;
        }
    }

    /**
     * Update data programmatically
     */
    updateData(newProviders) {
        this.providers = newProviders;
        this.renderTable();
        this.renderStatusCards();
    }

    /**
     * Load data from external source
     */
    async loadFromURL(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.providers = await response.json();
            this.renderTable();
            this.renderStatusCards();
            console.log('✅ Data loaded from external source:', url);
        } catch (error) {
            console.error('❌ Failed to load data from URL:', error);
            this.showError();
        }
    }
}

// Initialize when DOM is loaded
console.log('🔄 Setting up Provider Integrations Handler initialization...');

if (document.readyState === 'loading') {
    console.log('⏳ DOM still loading, adding event listener...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOM loaded, initializing Provider Integrations Handler...');
        window.providerIntegrationsHandler = new ProviderIntegrationsHandler();
        window.providerIntegrationsHandler.init();
    });
} else {
    console.log('✅ DOM already loaded, initializing Provider Integrations Handler immediately...');
    window.providerIntegrationsHandler = new ProviderIntegrationsHandler();
    window.providerIntegrationsHandler.init();
}

// Export for global access
window.ProviderIntegrationsHandler = ProviderIntegrationsHandler; 