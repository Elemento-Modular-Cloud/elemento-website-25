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
        currency: '€'
    };

    const comparisonLabels = {
        'vsphere-foundation': 'VMware vSphere Foundation + vSAN',
        'cloud-foundation': 'VMware Cloud Foundation (VCF)'
    };

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

        function getVMwarePricePerCoreYear() {
            const product = $('atomos-calc-comparison')?.value;
            return product === 'cloud-foundation' ? CONFIG.vmwareCloudFoundationPerCoreYear : CONFIG.vmwareVSphereFoundationPerCoreYear;
        }

        function getMultiYearDiscount(years) {
            if (years >= 5) return 0.20;
            if (years >= 3) return 0.15;
            return 0;
        }

        function calculate() {
            const { hosts, vms, years, storageTB, comparison, atomosSupport, totalCores } = getInputs();
            const vmwarePerCore = getVMwarePricePerCoreYear();
            const discount = getMultiYearDiscount(years);

            const vmwareHypervisorBase = totalCores * vmwarePerCore * years;
            const vmwareHypervisor = Math.round(vmwareHypervisorBase * (1 - discount));
            const vmwareStorageBase = storageTB * CONFIG.vmwareVSANPerTBYear * years;
            const vmwareStorage = Math.round(vmwareStorageBase * (1 - discount));
            const vmwareSupport = Math.round((vmwareHypervisor + vmwareStorage) * (CONFIG.vmwareSupportPercent / 100));
            const vmwareTotal = vmwareHypervisor + vmwareStorage + vmwareSupport;

            const atomosLicense = hosts * CONFIG.atomosPerHostYear * years;
            const supportPerHost = atomosSupport === 'pro' ? CONFIG.atomosSupportPro : CONFIG.atomosSupportBase;
            const atomosSupportCost = hosts * supportPerHost * years;
            const atomosTotal = atomosLicense + atomosSupportCost;

            const savings = vmwareTotal - atomosTotal;
            const savingsPercent = vmwareTotal > 0 ? Math.round((savings / vmwareTotal) * 100) : 0;
            const costPerVMYear = vms > 0 ? Math.round(vmwareTotal / years / vms) : 0;
            const costPerHostYear = hosts > 0 ? Math.round(vmwareTotal / years / hosts) : 0;

            const fmt = (n) => `${CONFIG.currency} ${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

            const setText = (el, text) => { if (el) el.textContent = text; };
            const setStyle = (el, prop, val) => { if (el) el.style[prop] = val; };

            setText($('atomos-calc-vmware-table-label'), comparisonLabels[comparison]);
            setText($('atomos-calc-vmware-hypervisor'), fmt(vmwareHypervisor));
            setText($('atomos-calc-vmware-storage'), fmt(vmwareStorage));
            setText($('atomos-calc-vmware-support'), fmt(vmwareSupport));
            setText($('atomos-calc-vmware-total'), fmt(vmwareTotal));

            setText($('atomos-calc-atomos-hypervisor'), fmt(atomosLicense));
            setText($('atomos-calc-atomos-storage'), 'Included');
            setText($('atomos-calc-atomos-support-cost'), fmt(atomosSupportCost));
            setText($('atomos-calc-atomos-total'), fmt(atomosTotal));

            setText($('atomos-calc-vmware-label'), comparisonLabels[comparison]);
            setText($('atomos-calc-vmware-cost'), fmt(vmwareTotal));
            setText($('atomos-calc-vmware-detail'), `Over ${years} year${years > 1 ? 's' : ''} • ${totalCores} cores licensed`);

            setText($('atomos-calc-atomos-cost'), fmt(atomosTotal));
            setText($('atomos-calc-atomos-detail'), `${atomosSupport === 'pro' ? 'Pro' : 'Base'} support • ${hosts} host${hosts > 1 ? 's' : ''}`);

            setText($('atomos-calc-metric-savings-pct'), `${savingsPercent}%`);
            setText($('atomos-calc-metric-cost-per-vm'), fmt(costPerVMYear));
            setText($('atomos-calc-metric-cost-per-host'), fmt(costPerHostYear));

            const maxCost = Math.max(vmwareTotal, atomosTotal, 1);
            const vmwarePct = maxCost > 0 ? (vmwareTotal / maxCost) * 100 : 0;
            const atomosPct = maxCost > 0 ? (atomosTotal / maxCost) * 100 : 0;
            setText($('atomos-calc-chart-vmware-label'), comparisonLabels[comparison]);
            setStyle($('atomos-calc-chart-vmware-fill'), 'width', vmwarePct + '%');
            setStyle($('atomos-calc-chart-atomos-fill'), 'width', atomosPct + '%');
            setText($('atomos-calc-chart-vmware-value'), fmt(vmwareTotal));
            setText($('atomos-calc-chart-atomos-value'), fmt(atomosTotal));
            setText($('atomos-calc-chart-legend-vmware'), comparisonLabels[comparison]);

            if (savings >= 0) {
                setText($('atomos-calc-savings-percent'), `Save up to ${savingsPercent}%`);
                setText($('atomos-calc-savings-amount'), `${fmt(savings)} over ${years} year${years > 1 ? 's' : ''}`);
                setText($('atomos-calc-savings-sub'), `With AtomOS instead of ${comparisonLabels[comparison]}`);
            } else {
                setText($('atomos-calc-savings-percent'), `VMware costs ${Math.abs(savingsPercent)}% less`);
                setText($('atomos-calc-savings-amount'), `${fmt(Math.abs(savings))} less with VMware over ${years} year${years > 1 ? 's' : ''}`);
                setText($('atomos-calc-savings-sub'), `AtomOS total exceeds ${comparisonLabels[comparison]} for this configuration`);
            }
        }

        const sliderInputPairs = [
            { slider: 'atomos-calc-hosts-slider', input: 'atomos-calc-hosts', min: 1, max: 500 },
            { slider: 'atomos-calc-cores-slider', input: 'atomos-calc-cores', min: 8, max: 256 },
            { slider: 'atomos-calc-vms-slider', input: 'atomos-calc-vms', min: 1, max: 10000 }
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

        ['atomos-calc-subscription', 'atomos-calc-storage', 'atomos-calc-comparison'].forEach(id => {
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
