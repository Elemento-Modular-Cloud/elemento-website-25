/**
 * Download provider SVG logos into assets/logos/providers/.
 * Run: node scripts/fetch-provider-logos.mjs
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'assets/logos/providers');

/** @type {Record<string, { urls?: string[], fallback?: { label: string, color: string } }>} */
const providers = {
    'wasabi_icon.svg': {
        urls: [
            'https://cdn.simpleicons.org/wasabi/00C65E',
            'https://www.vectorlogo.zone/logos/wasabi/wasabi-icon.svg'
        ]
    },
    'google_icon.svg': {
        urls: [
            'https://cdn.simpleicons.org/googlecloud/4285F4',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg'
        ]
    },
    'azure_icon.svg': {
        urls: [
            'https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg'
        ]
    },
    'oracle_icon.svg': {
        urls: [
            'https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg'
        ]
    },
    'ionos_icon.svg': { urls: ['https://cdn.simpleicons.org/ionos/003D8F'] },
    'ovh_icon.svg': { urls: ['https://cdn.simpleicons.org/ovh/123F6D'] },
    'hetzner_icon.svg': { urls: ['https://cdn.simpleicons.org/hetzner/D50C2D'] },
    'scaleway_icon.svg': { urls: ['https://cdn.simpleicons.org/scaleway/4F0599'] },
    'aws_icon.svg': {
        urls: [
            'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg',
            'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg'
        ]
    },
    'ibm_icon.svg': { urls: ['https://www.vectorlogo.zone/logos/ibm/ibm-icon.svg'] },
    'linode_icon.svg': { urls: ['https://www.vectorlogo.zone/logos/linode/linode-icon.svg'] },
    'upcloud_icon.svg': { urls: ['https://cdn.simpleicons.org/upcloud/7B68EE'] },
    'clastix_icon.svg': { urls: ['https://clastix.io/favicon.svg'] },
    'impossiblecloud_icon.svg': {
        urls: [
            'https://cdn.prod.website-files.com/68c131eb11585667f0c266dc/68de3292cd80a4a11b09aabc_IC_Logo_green-black.svg'
        ]
    },
    'gigas_icon.svg': {
        urls: ['https://www.gigas.com/static/images/logos/logo-gigas-25.svg']
    },
    'arubacloud_icon.svg': {
        urls: [
            'https://www.arubacloud.com/.resources/aruba/webresources/cloud/images/common/aruba-cloud-logo.svg'
        ]
    },
    'aruba_icon.svg': {
        urls: [
            'https://www.arubacloud.com/.resources/aruba/webresources/cloud/images/common/logo.svg'
        ],
        fallback: { label: 'A', color: '#FF6600' }
    },
    'cubbit_icon.svg': {
        urls: [
            'https://cdn.prod.website-files.com/67a4c547ac46cdf433fcc313/67c95ac020711b4dce0b94ac_webclip-cubbit.svg'
        ]
    },
    'leaseweb_icon.svg': {
        urls: [
            'https://raw.githubusercontent.com/detain/svg-logos/master/svg/l/leaseweb.svg'
        ],
        fallback: { label: 'LW', color: '#F7931E' },
        postProcess: (svg) => {
            const symbol = svg.match(/<path d="M126\.836[\s\S]*?fill="#0b314c"\/>/);
            if (!symbol) return svg;
            return `<svg xmlns="http://www.w3.org/2000/svg" width="170" height="141" viewBox="3.895 29.322 170 140.703" role="img" aria-hidden="true">\n  ${symbol[0]}\n</svg>\n`;
        }
    }
};

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, { headers: { 'User-Agent': 'ElementoWebsiteBot/1.0' } }, (res) => {
            if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
                fetchUrl(new URL(res.headers.location, url).href).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                reject(new Error(`${url} -> ${res.statusCode}`));
                return;
            }
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
        req.on('error', reject);
        req.setTimeout(15000, () => req.destroy(new Error('timeout')));
    });
}

function fallbackSvg(label, color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-hidden="true">
  <rect width="64" height="64" rx="12" fill="${color}"/>
  <text x="32" y="38" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${label}</text>
</svg>`;
}

async function downloadOne(file, config) {
    const urls = config.urls || [];
    for (const url of urls) {
        try {
            let body = await fetchUrl(url);
            if (!body.includes('<svg') && !body.includes('<?xml')) {
                throw new Error('not svg');
            }
            if (config.postProcess) {
                body = config.postProcess(body.trim());
            }
            fs.writeFileSync(path.join(outDir, file), body.trim() + '\n');
            console.log('OK', file, '<-', url);
            return true;
        } catch (e) {
            console.log('FAIL', file, url, e.message);
        }
    }
    if (config.fallback) {
        const svg = fallbackSvg(config.fallback.label, config.fallback.color);
        fs.writeFileSync(path.join(outDir, file), svg + '\n');
        console.log('FALLBACK', file, config.fallback.label);
        return true;
    }
    return false;
}

fs.mkdirSync(outDir, { recursive: true });

let ok = 0;
for (const [file, config] of Object.entries(providers)) {
    if (await downloadOne(file, config)) ok++;
}
console.log(`Saved ${ok}/${Object.keys(providers).length} icons to ${outDir}`);
