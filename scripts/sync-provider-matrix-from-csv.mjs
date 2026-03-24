/**
 * Sync: reads CMS/meson-provider-datasheet.csv and updates
 * CMS/provider-integrations.json support_level fields + bareMetal service.
 * Preserves regions and other metadata for existing providers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const csvPath = path.join(root, 'CMS/meson-provider-datasheet.csv');
const jsonPath = path.join(root, 'CMS/provider-integrations.json');

function cellToLevel(cell) {
    if (cell === undefined || cell === null) return 'na';
    const c = String(cell).trim();
    if (!c) return 'na';
    if (c === '✅') return 'full';
    if (c === '❌') return 'na';
    if (c === '⚙️') return 'partial';
    if (c.includes('⚖')) return 'partial';
    return 'na';
}

function costApiFromRow(billing, price) {
    const p = String(price ?? '').trim();
    const b = String(billing ?? '').trim();
    if (p) return cellToLevel(p);
    if (b) return cellToLevel(b);
    return 'na';
}

const COL = {
    billing: 1,
    objectstorage: 2,
    blockstorage: 3,
    vm: 4,
    kaas: 5,
    bareMetal: 6,
    sdn: 7,
    price: 8
};

const PROVIDER_KEYS = [
    ['Wasabi', 'wasabi'],
    ['Google', 'google'],
    ['Azure', 'azure'],
    ['Impossiblecloud', 'impossiblecloud'],
    ['UpCloud', 'upcloud'],
    ['Oracle', 'oracle'],
    ['IONOS', 'ionos'],
    ['Gigas', 'gigas'],
    ['ArubaCloud', 'arubacloud'],
    ['OVH', 'ovh'],
    ['Clastix', 'clastix'],
    ['Cubbit', 'cubbit'],
    ['Linode', 'linode'],
    ['Hetzner', 'hetzner'],
    ['Scaleway', 'scaleway'],
    ['AWS', 'aws'],
    ['Aruba', 'aruba'],
    ['Alibabacloud', 'alibabacloud'],
    ['Catalystcloud', 'catalystcloud'],
    ['Cloudferro', 'cloudferro'],
    ['Hidora', 'hidora'],
    ['Hexoscale', 'hexoscale'],
    ['Gridscale', 'gridscale'],
    ['Leafcloud', 'leafcloud'],
    ['Bluvault', 'bluvault'],
    ['Hostinger', 'hostinger'],
    ['Leaseweb', 'leaseweb'],
    ['IBM', 'ibm']
];

const DISPLAY_NAMES = {
    impossiblecloud: 'Impossible Cloud',
    arubacloud: 'Aruba Cloud',
    alibabacloud: 'Alibaba Cloud',
    catalystcloud: 'Catalyst Cloud',
    cloudferro: 'CloudFerro',
    hidora: 'Hidora',
    hexoscale: 'Hexoscale',
    gridscale: 'Gridscale',
    leafcloud: 'Leafcloud',
    bluvault: 'BluVault',
    hostinger: 'Hostinger',
    leaseweb: 'Leaseweb',
    cubbit: 'Cubbit',
    linode: 'Linode',
    hetzner: 'Hetzner',
    ibm: 'IBM Cloud'
};

function rowToLevels(row) {
    return {
        staas: cellToLevel(row[COL.objectstorage]),
        blockStorage: cellToLevel(row[COL.blockstorage]),
        vmManagement: cellToLevel(row[COL.vm]),
        k8s: cellToLevel(row[COL.kaas]),
        bareMetal: cellToLevel(row[COL.bareMetal]),
        networking: cellToLevel(row[COL.sdn]),
        costApi: costApiFromRow(row[COL.billing], row[COL.price])
    };
}

function patchService(services, name, level, create) {
    let s = services.find((x) => x.name === name);
    if (!s) {
        s = create();
        services.push(s);
    }
    s.support_level = level;
    if (s.regions === undefined) s.regions = {};
}

function applyLevelsToServices(services, levels) {
    patchService(
        services,
        'vmManagement',
        levels.vmManagement,
        () => ({
            name: 'vmManagement',
            display_name: 'VM Management',
            type: 'matcher',
            sub_type: 'vm',
            regions: {}
        })
    );
    patchService(
        services,
        'STaaS',
        levels.staas,
        () => ({
            name: 'STaaS',
            display_name: 'Storage as a Service',
            type: 'storage',
            sub_type: 'storage',
            regions: {}
        })
    );
    patchService(
        services,
        'blockStorage',
        levels.blockStorage,
        () => ({
            name: 'blockStorage',
            display_name: 'Block Storage',
            type: 'storage',
            sub_type: 'blockstorage',
            regions: {}
        })
    );
    patchService(
        services,
        'networking',
        levels.networking,
        () => ({
            name: 'networking',
            display_name: 'Networking',
            type: 'network',
            sub_type: 'network',
            regions: {}
        })
    );
    patchService(
        services,
        'k8s',
        levels.k8s,
        () => ({
            name: 'k8s',
            display_name: 'Kubernetes',
            type: 'service',
            sub_type: 'container',
            regions: {}
        })
    );
    patchService(
        services,
        'costApi',
        levels.costApi,
        () => ({
            name: 'costApi',
            display_name: 'Cost API',
            type: 'matcher',
            sub_type: 'billing',
            regions: {}
        })
    );
    patchService(
        services,
        'bareMetal',
        levels.bareMetal,
        () => ({
            name: 'bareMetal',
            display_name: 'Bare metal',
            type: 'service',
            sub_type: 'bare_metal',
            regions: {}
        })
    );
}

function minimalProvider(displayName, key, levels, status) {
    const p = {
        display_name: displayName,
        icon_classes: `${key}_icon`,
        source: 'fontawesome',
        color: '#666666',
        svg_filename: `${key}_icon.svg`,
        status,
        services: []
    };
    applyLevelsToServices(p.services, levels);
    return p;
}

const csvText = fs.readFileSync(csvPath, 'utf8');
const lines = csvText.trim().split(/\r?\n/);
const dataRows = lines.slice(1).filter((l) => l.trim());

const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const oldProviders = existing.ELEMENTO_SUPPORTED_PROVIDERS;

const newProviders = {};
const defaultStatus = 'development';

for (let i = 0; i < PROVIDER_KEYS.length; i++) {
    const [csvName, key] = PROVIDER_KEYS[i];
    const row = dataRows[i].split(',');
    if (row[0] !== csvName) {
        console.error(`Row mismatch at ${i}: expected ${csvName}, got ${row[0]}`);
        process.exit(1);
    }
    const levels = rowToLevels(row);
    let base = oldProviders[key];
    const displayName = DISPLAY_NAMES[key] || csvName.replace(/([a-z])([A-Z])/g, '$1 $2');

    if (!base) {
        base = minimalProvider(displayName, key, levels, defaultStatus);
    } else {
        base = JSON.parse(JSON.stringify(base));
        if (!base.services) base.services = [];
        applyLevelsToServices(base.services, levels);
    }

    if (!base.display_name) base.display_name = displayName;
    newProviders[key] = base;
}

existing.ELEMENTO_SUPPORTED_PROVIDERS = newProviders;
fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 4) + '\n', 'utf8');
console.log('Updated', jsonPath, 'with', Object.keys(newProviders).length, 'providers');
