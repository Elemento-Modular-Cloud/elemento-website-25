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
            const cmsUrl = window.ElementoI18n?.assetUrl
                ? window.ElementoI18n.assetUrl('CMS/provider-integrations.json')
                : 'CMS/provider-integrations.json';
            const testResponse = await fetch(cmsUrl, { method: 'HEAD' });
            console.log('🔍 File exists check:', testResponse.status);
            
            const response = await fetch(cmsUrl);
            console.log('📡 Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Loaded provider data:', data);

            this.uiLabels = data.ui || null;
            const locale = window.ElementoI18n ? window.ElementoI18n.getPageLocale() : 'en';
            if (this.uiLabels && this.uiLabels[locale]) {
                this.applyUiLabels(this.uiLabels[locale]);
            }
            
            // Transform and sort providers for display
            this.providers = this.sortProviders(this.transformProviderData(data));
            console.log('📋 Transformed providers:', this.providers.length, 'providers');
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
                        <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
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
     * Transform the new JSON format to the expected format
     */
    transformProviderData(data) {
        const providers = [];
        const supportedProviders = data.ELEMENTO_SUPPORTED_PROVIDERS;
        
        for (const [key, provider] of Object.entries(supportedProviders)) {
            const transformedProvider = {
                key,
                provider: provider.display_name,
                icon: provider.svg_filename || null,
                color: provider.color || '#666666',
                badgeVariant: this.getBadgeVariant(key),
                status: provider.status,
                vmManagement: 'na',
                objectStorage: 'na',
                blockStorage: 'na',
                networking: 'na',
                k8s: 'na',
                dbaas: 'na',
                bareMetal: 'na'
            };
            
            // Map services to the expected format
            provider.services.forEach(service => {
                switch (service.name) {
                    case 'vmManagement':
                        transformedProvider.vmManagement = service.support_level;
                        break;
                    case 'STaaS':
                        transformedProvider.objectStorage = service.support_level;
                        break;
                    case 'blockStorage':
                        transformedProvider.blockStorage = service.support_level;
                        break;
                    case 'networking':
                        transformedProvider.networking = service.support_level;
                        break;
                    case 'k8s':
                        transformedProvider.k8s = service.support_level;
                        break;
                    case 'dbaas':
                        transformedProvider.dbaas = service.support_level;
                        break;
                    case 'bareMetal':
                        transformedProvider.bareMetal = service.support_level;
                        break;
                }
            });
            
            providers.push(transformedProvider);
        }
        
        return providers;
    }

    getBadgeVariant(providerKey) {
        if (providerKey === 'aruba') return 'wide';
        return null;
    }

    providerIconUrl(filename) {
        if (!filename) return '';
        const path = `assets/logos/providers/${filename}`;
        if (window.ElementoI18n?.assetUrl) {
            return window.ElementoI18n.assetUrl(path);
        }
        return path;
    }

    formatProviderCell(provider) {
        if (!provider.icon) {
            return `<strong>${provider.provider}</strong>`;
        }
        const src = this.providerIconUrl(provider.icon);
        const color = /^#[0-9a-fA-F]{3,8}$/.test(provider.color) ? provider.color : '#666666';
        const badgeClass = ['provider-name-cell__badge'];
        if (provider.badgeVariant === 'wide') {
            badgeClass.push('provider-name-cell__badge--wide');
        }
        return `<span class="provider-name-cell"><span class="${badgeClass.join(' ')}" style="--provider-color: ${color}"><img class="provider-name-cell__icon" src="${src}" alt="" aria-hidden="true"></span><strong>${provider.provider}</strong></span>`;
    }

    /**
     * Render the comparison table
     */
    renderTable() {
        if (!this.tableContainer) return;

        const sortedProviders = this.sortProviders(this.providers);

        console.log('📊 Providers sorted:', sortedProviders.map(p => `${p.provider} (${p.status})`));

        const html = sortedProviders.map((provider, index) => {
            const rowClass = index % 2 === 0 ? 'comparison-table-row-alt' : 'comparison-table-row';
            
            return `
                <tr class="${rowClass}">
                    <td class="comparison-table-cell" translate="no">${this.formatProviderCell(provider)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.vmManagement)}">${this.formatSupportCell(provider.vmManagement)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.objectStorage)}">${this.formatSupportCell(provider.objectStorage)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.blockStorage)}">${this.formatSupportCell(provider.blockStorage)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.networking)}">${this.formatSupportCell(provider.networking)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.k8s)}">${this.formatSupportCell(provider.k8s)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.dbaas)}">${this.formatSupportCell(provider.dbaas)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.bareMetal)}">${this.formatSupportCell(provider.bareMetal)}</td>
                    <td class="comparison-table-cell-${this.getStatusClass(provider.status)}"><span class="provider-status-badge">${this.getStatusBadge(provider.status)}</span></td>
                </tr>
            `;
        }).join('');

        this.tableContainer.innerHTML = html;
        console.log('✅ Provider table rendered successfully');
    }

    applyUiLabels(labels) {
        document.querySelectorAll('.comparison-table thead th').forEach((th, i) => {
            if (i === 0 && labels.providerColumn) th.textContent = labels.providerColumn;
        });
        const cards = this.statusCards;
        if (!cards || cards.length < 3) return;
        const titles = [labels.supported, labels.partial, labels.planned];
        cards.forEach((card, i) => {
            const h = card.querySelector('h3');
            if (h && titles[i]) h.textContent = titles[i];
        });
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

        for (const status of Object.keys(groups)) {
            const providersInGroup = this.providers
                .filter((p) => p.status === status)
                .sort((a, b) => this.compareCommercialOrder(a, b));
            groups[status] = providersInGroup.map((p) => p.provider);
        }

        return groups;
    }

    /**
     * Market-facing provider order (lower = higher visibility).
     */
    getCommercialRank(providerKey) {
        const ranks = {
            aws: 10,
            azure: 11,
            google: 12,
            ibm: 20,
            oracle: 21,
            ovh: 30,
            scaleway: 31,
            hetzner: 32,
            upcloud: 33,
            linode: 35,
            leaseweb: 41,
            wasabi: 42,
            impossiblecloud: 43,
            clastix: 50,
            cubbit: 51,
            ionos: 52,
            aruba: 53,
            gigas: 54
        };
        return ranks[providerKey] ?? 999;
    }

    compareCommercialOrder(a, b) {
        const rankDiff = this.getCommercialRank(a.key) - this.getCommercialRank(b.key);
        if (rankDiff !== 0) return rankDiff;

        const scoreDiff = this.integrationScore(b) - this.integrationScore(a);
        if (scoreDiff !== 0) return scoreDiff;

        return a.provider.localeCompare(b.provider);
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
            'planned': '<i class="fas fa-calendar-days" style="color: var(--red);"></i>',
            'na': '<i class="fas fa-minus" style="color: var(--text-muted);"></i>',
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
            'partial': 'Ongoing',
            'planned': 'Planned',
            'na': ' ',
            'production': 'Production',
            'beta': 'Beta',
            'soon': 'Soon!',
            'development': 'Development'
        };
        return textMap[status] || 'Planned';
    }

    /**
     * Render icon + label on one line (avoids wrapped "Ongoing" cells).
     */
    formatSupportCell(status) {
        const icon = this.getStatusIcon(status);
        const text = this.getStatusText(status).trim();
        if (!text) {
            return `<span class="provider-support-cell">${icon}</span>`;
        }
        return `<span class="provider-support-cell">${icon}<span>${text}</span></span>`;
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
     * Score integration breadth for sorting (full > partial > planned > na).
     */
    integrationScore(provider) {
        const levels = [
            provider.vmManagement,
            provider.objectStorage,
            provider.blockStorage,
            provider.networking,
            provider.k8s,
            provider.dbaas,
            provider.bareMetal
        ];
        const weights = { full: 3, partial: 2, planned: 1, na: 0 };
        return levels.reduce((sum, level) => sum + (weights[level] ?? 0), 0);
    }

    /**
     * Sort providers: readiness tier, then commercial rank, then integration breadth, then name.
     */
    sortProviders(providers) {
        const statusPriority = {
            production: 1,
            soon: 2,
            beta: 3,
            development: 4
        };

        return [...providers].sort((a, b) => {
            const priorityA = statusPriority[a.status] ?? 999;
            const priorityB = statusPriority[b.status] ?? 999;
            if (priorityA !== priorityB) return priorityA - priorityB;

            return this.compareCommercialOrder(a, b);
        });
    }

    /**
     * Show error state
     */
    showError() {
        if (this.tableContainer) {
            this.tableContainer.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-muted);">
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

            const data = await response.json();
            this.providers = this.sortProviders(this.transformProviderData(data));
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