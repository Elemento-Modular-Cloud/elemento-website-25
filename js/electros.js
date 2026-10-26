// Electros Download Links Handler
// Fetches latest GitHub release and populates download links, checksums, and version label.

function domReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

const RELEASE_API = 'https://api.github.com/repos/Elemento-Modular-Cloud/Electros/releases/latest';

/** @type {Array<{ id: string, os: string, arch: string, ext: string }>} */
const DOWNLOAD_TARGETS = [
    { id: 'ai-x64-btn', os: 'linux', arch: 'x64', ext: 'AppImage' },
    { id: 'ai-arm-btn', os: 'linux', arch: 'arm64', ext: 'AppImage' },
    { id: 'deb-x64-btn', os: 'linux', arch: 'x64', ext: 'deb' },
    { id: 'deb-arm-btn', os: 'linux', arch: 'arm64', ext: 'deb' },
    { id: 'rpm-x64-btn', os: 'linux', arch: 'x64', ext: 'rpm' },
    { id: 'rpm-arm-btn', os: 'linux', arch: 'arm64', ext: 'rpm' },
    { id: 'dmg-x64-btn', os: 'mac', arch: 'x64', ext: 'dmg' },
    { id: 'dmg-arm-btn', os: 'mac', arch: 'arm64', ext: 'dmg' },
    { id: 'exe-x64-btn', os: 'win', arch: 'x64', ext: 'exe' },
];

function parseChecksums(body) {
    const md5 = {};
    const sha256 = {};
    if (!body) return { md5, sha256 };

    let currentFile = '';
    for (const line of body.split('\n')) {
        if (line.startsWith('## ') && !line.startsWith('## Platform')) {
            currentFile = line.replace('## ', '').trim();
        } else if (line.startsWith('MD5:') && currentFile) {
            md5[currentFile] = line.replace('MD5:', '').trim();
        } else if (line.startsWith('SHA256:') && currentFile) {
            sha256[currentFile] = line.replace('SHA256:', '').trim();
        }
    }
    return { md5, sha256 };
}

function findAssetName(assetLinks, os, arch, ext) {
    const needle = `-${os}-${arch}.${ext}`.toLowerCase();
    return Object.keys(assetLinks).find((name) => name.toLowerCase().endsWith(needle)) || null;
}

function formatReleaseDate(iso) {
    if (!iso) return '';
    try {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(iso));
    } catch {
        return iso.slice(0, 10);
    }
}

function updateReleaseMeta(releaseData) {
    const tag = releaseData.tag_name || '';
    const date = formatReleaseDate(releaseData.published_at);
    const notesUrl = releaseData.html_url
        || (tag
            ? `https://github.com/Elemento-Modular-Cloud/Electros/releases/tag/${encodeURIComponent(tag)}`
            : 'https://github.com/Elemento-Modular-Cloud/Electros/releases/latest');

    const label = document.getElementById('electros-release-label');
    if (label && tag) {
        label.textContent = date
            ? `Current desktop release: ${tag} — ${date}. Review the release notes before deploying.`
            : `Current desktop release: ${tag}. Review the release notes before deploying.`;
    }

    const notes = document.getElementById('electros-release-notes');
    if (notes) {
        notes.href = notesUrl;
        if (tag) notes.textContent = `Release notes (${tag})`;
    }

    document.querySelectorAll('[data-electros-version]').forEach((el) => {
        if (tag) el.textContent = tag;
    });
}

function setChecksum(id, prefix, value) {
    const el = document.getElementById(id);
    if (!el || !value) return;
    el.textContent = `${prefix} ${value}`;
    el.classList.add('checksum-ready');
}

function markUnavailable(btn) {
    btn.classList.add('download-error');
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
    btn.setAttribute('aria-disabled', 'true');
    if (btn.getAttribute('href') === '#' || !btn.getAttribute('href')) {
        btn.removeAttribute('href');
    }
}

async function getAssetLinks() {
    try {
        const response = await fetch(RELEASE_API);
        if (!response.ok) {
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }

        const releaseData = await response.json();
        updateReleaseMeta(releaseData);

        const assetLinks = {};
        releaseData.assets.forEach((asset) => {
            const baseName = asset.name;
            if (!baseName.endsWith('.md5') && !baseName.endsWith('.sha256')) {
                assetLinks[baseName] = asset.browser_download_url;
            }
        });

        const assetHashes = parseChecksums(releaseData.body);
        let rpmMissingChecksum = false;

        DOWNLOAD_TARGETS.forEach(({ id, os, arch, ext }) => {
            const btn = document.getElementById(id);
            const assetName = findAssetName(assetLinks, os, arch, ext);
            if (!btn || !assetName) return;

            btn.href = assetLinks[assetName];
            btn.classList.add('download-ready');
            btn.classList.remove('download-error');
            btn.removeAttribute('aria-disabled');

            const prefix = id.replace(/-btn$/, '');
            setChecksum(`${prefix}-md5`, 'MD5', assetHashes.md5[assetName]);
            setChecksum(`${prefix}-sha256`, 'SHA256', assetHashes.sha256[assetName]);

            if (ext === 'rpm' && !assetHashes.sha256[assetName] && !assetHashes.md5[assetName]) {
                rpmMissingChecksum = true;
            }
        });

        const rpmNote = document.getElementById('electros-rpm-checksum-note');
        if (rpmNote) {
            rpmNote.hidden = !rpmMissingChecksum;
        }

        return { assetLinks, assetHashes, tag: releaseData.tag_name };
    } catch (error) {
        console.error('Error occurred in getAssetLinks:', error);

        document.querySelectorAll('#download [id$="-btn"]').forEach((btn) => {
            const href = btn.getAttribute('href');
            if (!href || href === '#') markUnavailable(btn);
        });

        const label = document.getElementById('electros-release-label');
        if (label) {
            label.textContent = 'Unable to load the latest release right now. Try again shortly, or open the releases page on GitHub.';
        }

        return null;
    }
}

domReady(function () {
    getAssetLinks().catch((error) => {
        console.error('Unhandled error:', error);
    });
});

window.initElectrosDownloads = getAssetLinks;
