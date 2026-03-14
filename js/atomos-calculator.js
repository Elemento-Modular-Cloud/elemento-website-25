/**
 * AtomOS Price Calculator — Component loader and logic
 * Usage: Add <div data-atomos-calculator></div> and include this script + atomos-calculator.css
 */
(function() {
    'use strict';

    const CONFIG = {
        vmwareVSphereFoundationPerCoreYear: 180,
        vmwareCloudFoundationPerCoreYear: 350,
        vmwareVSANPerTBYear: 120,
        vmwareSupportPercent: 18,
        atomosPerHostYear: 600,
        atomosSupportBase: 1200,
        atomosSupportPro: 2000,
        currency: '€',
        /* Nutanix: per-node/year (AHV+HCI bundle, estimated) */
        nutanixPerNodeYear: 4500,
        /* Sangfor HCI: per-node/year (estimated, typically lower than Nutanix) */
        sangforPerNodeYear: 3000,
        /* Hyper-V: Windows Server Datacenter per-core/year (amortized 5yr or subscription) */
        hypervPerCoreYear: 85
    };

    const comparisonLabels = {
        'vsphere-foundation': 'VMware vSphere Foundation + vSAN',
        'cloud-foundation': 'VMware Cloud Foundation (VCF)',
        'nutanix': 'Nutanix (AHV + HCI)',
        'sangfor': 'Sangfor HCI',
        'hyperv': 'Microsoft Hyper-V (Windows Server)'
    };

    const comparisonShortLabels = {
        'vsphere-foundation': 'VMware',
        'cloud-foundation': 'VMware',
        'nutanix': 'Nutanix',
        'sangfor': 'Sangfor',
        'hyperv': 'Hyper-V'
    };

    const comparisonsWithStoragePricing = ['vsphere-foundation', 'cloud-foundation'];
    const comparisonsWithCoresPricing = ['vsphere-foundation', 'cloud-foundation', 'hyperv'];

    function getComponentBasePath() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        const depth = Math.max(0, segments.length - 1);
        return '../'.repeat(depth);
    }

    function ensureCSSLoaded() {
        if (document.querySelector('link[href*="atomos-calculator.css"]')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = getComponentBasePath() + 'css/atomos-calculator.css';
        document.head.appendChild(link);
    }

    async function loadComponentHTML() {
        const url = getComponentBasePath() + 'components/atomos-price-comparator.html';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load calculator component');
        return response.text();
    }

    function initCalculator(container) {
        const $ = (id) => container.querySelector('#' + id);

        function getInputs() {
            const hosts = parseInt($('atomos-calc-hosts')?.value, 10) || 1;
            const coresPerHost = parseInt($('atomos-calc-cores')?.value, 10) || 16;
            const vms = parseInt($('atomos-calc-vms')?.value, 10) || 1;
            const years = parseInt($('atomos-calc-subscription')?.value, 10) || 3;
            const storageTB = parseInt($('atomos-calc-storage')?.value, 10) || 12;
            const comparison = $('atomos-calc-comparison')?.value || 'vsphere-foundation';
            const atomosSupport = $('atomos-calc-support-tier')?.value || 'base';
            const effectiveCoresPerHost = Math.max(16, coresPerHost);
            const totalCores = hosts * effectiveCoresPerHost;
            return { hosts, coresPerHost, vms, years, storageTB, comparison, atomosSupport, totalCores };
        }

        function getMultiYearDiscount(years) {
            if (years >= 5) return 0.20;
            if (years >= 3) return 0.15;
            return 0;
        }

        function getCompetitorCosts(comparison, hosts, totalCores, storageTB, years) {
            const discount = getMultiYearDiscount(years);
            const mult = 1 - discount;

            switch (comparison) {
                case 'vsphere-foundation':
                case 'cloud-foundation': {
                    const perCore = comparison === 'cloud-foundation' ? CONFIG.vmwareCloudFoundationPerCoreYear : CONFIG.vmwareVSphereFoundationPerCoreYear;
                    const hypervisor = Math.round(totalCores * perCore * years * mult);
                    const storage = Math.round(storageTB * CONFIG.vmwareVSANPerTBYear * years * mult);
                    const support = Math.round((hypervisor + storage) * (CONFIG.vmwareSupportPercent / 100));
                    return { hypervisor, storage, support, total: hypervisor + storage + support, storageLabel: 'Storage / vSAN' };
                }
                case 'nutanix': {
                    const total = Math.round(hosts * CONFIG.nutanixPerNodeYear * years * mult);
                    return { hypervisor: total, storage: 0, support: 0, total, storageLabel: 'Storage' };
                }
                case 'sangfor': {
                    const total = Math.round(hosts * CONFIG.sangforPerNodeYear * years * mult);
                    return { hypervisor: total, storage: 0, support: 0, total, storageLabel: 'Storage' };
                }
                case 'hyperv': {
                    const hypervisor = Math.round(totalCores * CONFIG.hypervPerCoreYear * years * mult);
                    return { hypervisor, storage: 0, support: 0, total: hypervisor, storageLabel: 'Storage' };
                }
                default:
                    return { hypervisor: 0, storage: 0, support: 0, total: 0, storageLabel: 'Storage' };
            }
        }

        function calculate() {
            const { hosts, vms, years, storageTB, comparison, atomosSupport, totalCores } = getInputs();
            const comp = getCompetitorCosts(comparison, hosts, totalCores, storageTB, years);

            const atomosLicense = hosts * CONFIG.atomosPerHostYear * years;
            const supportPerHost = atomosSupport === 'pro' ? CONFIG.atomosSupportPro : CONFIG.atomosSupportBase;
            const atomosSupportCost = hosts * supportPerHost * years;
            const atomosTotal = atomosLicense + atomosSupportCost;

            const savings = comp.total - atomosTotal;
            const savingsPercent = comp.total > 0 ? Math.round((savings / comp.total) * 100) : 0;
            const costPerVMYear = vms > 0 ? Math.round(comp.total / years / vms) : 0;
            const costPerHostYear = hosts > 0 ? Math.round(comp.total / years / hosts) : 0;

            const fmt = (n) => `${CONFIG.currency} ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

            const setText = (el, text) => { if (el) el.textContent = text; };
            const setStyle = (el, prop, val) => { if (el) el.style[prop] = val; };

            const compLabel = comparisonLabels[comparison];
            const compShort = comparisonShortLabels[comparison] || compLabel;
            setText($('atomos-calc-vmware-table-label'), compLabel);
            setText($('atomos-calc-chart-title'), `AtomOS vs ${compLabel}`);

            const pageTitle = document.querySelector('#atomos-page-title');
            const pageSubtitle = document.querySelector('#atomos-page-subtitle');
            if (pageTitle) pageTitle.textContent = `Compare Costs — AtomOS vs ${compShort}`;
            if (pageSubtitle) pageSubtitle.textContent = `Calculate how much you could save with AtomOS compared to ${compShort}. Discover how our virtualization solution helps you escape rising costs, without compromising enterprise-level reliability.`;
            document.title = `Compare Costs — AtomOS vs ${compShort} | Elemento Cloud`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', `Calculate how much you could save with AtomOS compared to ${compShort}. Compare virtualization costs and discover enterprise-level reliability at a fraction of the price.`);
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', `Compare Costs — AtomOS vs ${compShort} | Elemento Cloud`);
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.setAttribute('content', `Calculate how much you could save with AtomOS compared to ${compShort}. Compare virtualization costs and discover enterprise-level reliability.`);
            const twTitle = document.querySelector('meta[name="twitter:title"]');
            if (twTitle) twTitle.setAttribute('content', `Compare Costs — AtomOS vs ${compShort} | Elemento Cloud`);
            const twDesc = document.querySelector('meta[name="twitter:description"]');
            if (twDesc) twDesc.setAttribute('content', `Calculate how much you could save with AtomOS compared to ${compShort}.`);
            setText($('atomos-calc-details-summary'), `How did we compute AtomOS vs ${compLabel}?`);
            setText($('atomos-calc-details-intro'), `Detailed breakdown of AtomOS vs ${compLabel} cost comparison and computation.`);
            setText($('atomos-calc-metric-label-vm'), `${compLabel} cost per VM/year`);
            setText($('atomos-calc-metric-label-host'), `${compLabel} cost per host/year`);
            setText($('atomos-calc-vmware-hypervisor'), fmt(comp.hypervisor));
            setText($('atomos-calc-vmware-storage'), comp.storage > 0 ? fmt(comp.storage) : 'Included');
            setText($('atomos-calc-vmware-support'), comp.support > 0 ? fmt(comp.support) : 'Included');
            setText($('atomos-calc-vmware-total'), fmt(comp.total));

            setText($('atomos-calc-atomos-hypervisor'), fmt(atomosLicense));
            setText($('atomos-calc-atomos-storage'), 'Included');
            setText($('atomos-calc-atomos-support-cost'), fmt(atomosSupportCost));
            setText($('atomos-calc-atomos-total'), fmt(atomosTotal));

            setText($('atomos-calc-vmware-label'), comparisonLabels[comparison]);
            setText($('atomos-calc-vmware-cost'), fmt(comp.total));
            const detailSuffix = (comparison === 'nutanix' || comparison === 'sangfor') ? 'nodes' : 'cores';
            setText($('atomos-calc-vmware-detail'), `Over ${years} year${years > 1 ? 's' : ''} • ${totalCores} ${detailSuffix}`);

            setText($('atomos-calc-atomos-cost'), fmt(atomosTotal));
            setText($('atomos-calc-atomos-detail'), `${atomosSupport === 'pro' ? 'Pro' : 'Base'} support • ${hosts} host${hosts > 1 ? 's' : ''}`);

            setText($('atomos-calc-metric-savings-pct'), `${savingsPercent}%`);
            setText($('atomos-calc-metric-cost-per-vm'), fmt(costPerVMYear));
            setText($('atomos-calc-metric-cost-per-host'), fmt(costPerHostYear));

            const maxCost = Math.max(comp.total, atomosTotal, 1);
            const compPct = maxCost > 0 ? (comp.total / maxCost) * 100 : 0;
            const atomosPct = maxCost > 0 ? (atomosTotal / maxCost) * 100 : 0;
            setText($('atomos-calc-chart-vmware-label'), comparisonLabels[comparison]);
            setStyle($('atomos-calc-chart-vmware-fill'), 'width', compPct + '%');
            setStyle($('atomos-calc-chart-atomos-fill'), 'width', atomosPct + '%');
            setText($('atomos-calc-chart-vmware-value'), fmt(comp.total));
            setText($('atomos-calc-chart-atomos-value'), fmt(atomosTotal));
            setText($('atomos-calc-chart-legend-vmware'), comparisonLabels[comparison]);

            if (savings >= 0) {
                setText($('atomos-calc-savings-percent'), `Save up to ${savingsPercent}%`);
                setText($('atomos-calc-savings-amount'), `${fmt(savings)} over ${years} year${years > 1 ? 's' : ''}`);
                setText($('atomos-calc-savings-sub'), `With AtomOS instead of ${comparisonLabels[comparison]}`);
            } else {
                setText($('atomos-calc-savings-percent'), `${comparisonLabels[comparison]} costs ${Math.abs(savingsPercent)}% less`);
                setText($('atomos-calc-savings-amount'), `${fmt(Math.abs(savings))} less with ${comparisonLabels[comparison]} over ${years} year${years > 1 ? 's' : ''}`);
                setText($('atomos-calc-savings-sub'), `AtomOS total exceeds ${comparisonLabels[comparison]} for this configuration`);
            }

            updateSliderAvailability();
        }

        function updateSliderAvailability() {
            const comparison = $('atomos-calc-comparison')?.value || 'vsphere-foundation';
            const storageEnabled = comparisonsWithStoragePricing.includes(comparison);
            const coresEnabled = comparisonsWithCoresPricing.includes(comparison);
            const storageSlider = $('atomos-calc-storage-slider');
            const storageInput = $('atomos-calc-storage');
            const coresSlider = $('atomos-calc-cores-slider');
            const coresInput = $('atomos-calc-cores');
            const storageWrap = container.querySelector('#atomos-calc-storage-wrap');
            const coresGroup = container.querySelector('#atomos-calc-cores-wrap');
            const storageHint = $('atomos-calc-storage-hint');
            const coresHint = $('atomos-calc-cores-hint');
            [storageSlider, storageInput].forEach(el => { if (el) el.disabled = !storageEnabled; });
            [coresSlider, coresInput].forEach(el => { if (el) el.disabled = !coresEnabled; });
            if (storageWrap) storageWrap.classList.toggle('atomos-input-disabled', !storageEnabled);
            if (coresGroup) coresGroup.classList.toggle('atomos-input-disabled', !coresEnabled);
            if (storageHint) storageHint.setAttribute('aria-hidden', storageEnabled);
            if (coresHint) coresHint.setAttribute('aria-hidden', coresEnabled);
        }

        const sliderInputPairs = [
            { slider: 'atomos-calc-hosts-slider', input: 'atomos-calc-hosts', min: 1, max: 500 },
            { slider: 'atomos-calc-cores-slider', input: 'atomos-calc-cores', min: 8, max: 256 },
            { slider: 'atomos-calc-vms-slider', input: 'atomos-calc-vms', min: 1, max: 10000 },
            { slider: 'atomos-calc-storage-slider', input: 'atomos-calc-storage', min: 2, max: 48 }
        ];

        sliderInputPairs.forEach(({ slider, input, min, max }) => {
            const s = $(slider);
            const i = $(input);
            if (!s || !i) return;
            const sliderMax = parseInt(s.max, 10);
            s.addEventListener('input', () => {
                i.value = s.value;
                calculate();
            });
            function syncFromInput() {
                let v = parseInt(i.value, 10);
                if (isNaN(v)) v = min;
                v = Math.max(min, Math.min(max, v));
                i.value = v;
                s.value = Math.min(v, sliderMax);
                calculate();
            }
            i.addEventListener('input', syncFromInput);
            i.addEventListener('change', syncFromInput);
        });

        ['atomos-calc-subscription', 'atomos-calc-comparison'].forEach(id => {
            const el = $(id);
            if (el) el.addEventListener('change', calculate);
        });

        container.querySelectorAll('.support-level-card').forEach(card => {
            card.addEventListener('click', () => {
                const value = card.getAttribute('data-value');
                const hidden = $('atomos-calc-support-tier');
                if (hidden && value) {
                    hidden.value = value;
                    container.querySelectorAll('.support-level-card').forEach(c => {
                        const isSelected = c.getAttribute('data-value') === value;
                        c.classList.toggle('selected', isSelected);
                        c.setAttribute('aria-pressed', isSelected);
                    });
                    calculate();
                }
            });
        });

        calculate();
    }

    async function init() {
        const placeholders = document.querySelectorAll('[data-atomos-calculator]');
        if (!placeholders.length) return;

        ensureCSSLoaded();

        try {
            const html = await loadComponentHTML();
            const first = placeholders[0];
            first.innerHTML = html;
            first.removeAttribute('data-atomos-calculator');
            const container = first.querySelector('.atomos-calculator-container') || first;
            initCalculator(container);
        } catch (err) {
            console.error('AtomOS calculator failed to load:', err);
            placeholders.forEach(p => {
                p.innerHTML = '<p class="component-error">Failed to load cost calculator. Please refresh the page.</p>';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
