// Electros Download Links Handler
// Fetches latest release data from GitHub and populates download links and checksums

// Wait for DOM to be ready
function domReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

// Fetch and process the release data
async function getAssetLinks() {
    try {
        console.log('Fetching latest release data from GitHub API...');
        const response = await fetch('https://api.github.com/repos/Elemento-Modular-Cloud/Electros/releases/latest');
        
        if (!response.ok) {
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }
        
        const releaseData = await response.json();
        const assetLinks = {};
        const assetHashes = {
            md5: {},
            sha256: {}
        };

        // Parse checksums from the body
        if (releaseData.body) {
            const lines = releaseData.body.split('\n');
            let currentFile = '';
            
            for (const line of lines) {
                // Check for file name lines (they start with ##)
                if (line.startsWith('## ') && !line.startsWith('## Platform')) {
                    currentFile = line.replace('## ', '').trim();
                }
                // Extract MD5
                else if (line.startsWith('MD5:')) {
                    const md5 = line.replace('MD5:', '').trim();
                    if (currentFile) {
                        assetHashes.md5[currentFile] = md5;
                    }
                }
                // Extract SHA256
                else if (line.startsWith('SHA256:')) {
                    const sha256 = line.replace('SHA256:', '').trim();
                    if (currentFile) {
                        assetHashes.sha256[currentFile] = sha256;
                    }
                }
            }
        }

        console.log('Processing assets...');
        releaseData.assets.forEach((asset) => {
            let baseName = asset.name;
            // Only store the direct download URLs
            if (!baseName.endsWith('.md5') && !baseName.endsWith('.sha256')) {
                assetLinks[baseName] = asset.browser_download_url;
            }
        });

        const platformMap = {
            'linux-appimage': 'ai',
            'linux': 'deb',
            'mac': 'dmg',
            'win': 'exe'
        };

        const archs = ['x64', 'arm64'];
        
        for (const [platform, type] of Object.entries(platformMap)) {
            var loc_platform = platform;
            if (platform === 'linux-appimage') {
                loc_platform = 'linux';
            }

            for (const arch of archs) {
                if (loc_platform === 'win' && arch === 'arm64') continue;

                const btnId = arch === 'arm64' ? `${type}-arm-btn` : `${type}-x64-btn`;
                const btnElement = document.querySelector(`#${btnId}`);
                
                const assetName = Object.keys(assetLinks).find(name => 
                    name.includes(loc_platform) && 
                    name.includes(arch) && 
                    name.endsWith(`.${type === 'ai' ? 'AppImage' : type}`)
                );

                if (btnElement && assetName) {
                    btnElement.href = assetLinks[assetName];
                    // Update button text to show it's ready
                    btnElement.classList.add('download-ready');
                }

                const md5Id = arch === 'arm64' ? `${type}-arm-md5` : `${type}-x64-md5`;
                const md5Element = document.querySelector(`#${md5Id}`);
                if (md5Element && assetHashes.md5[assetName]) {
                    md5Element.textContent = `MD5: ${assetHashes.md5[assetName]}`;
                    md5Element.classList.add('checksum-ready');
                }

                const sha256Id = arch === 'arm64' ? `${type}-arm-sha256` : `${type}-x64-sha256`;
                const sha256Element = document.querySelector(`#${sha256Id}`);
                if (sha256Element && assetHashes.sha256[assetName]) {
                    sha256Element.textContent = `SHA256: ${assetHashes.sha256[assetName]}`;
                    sha256Element.classList.add('checksum-ready');
                }
            }
        }

        console.log('Successfully populated download links and checksums');
        return { assetLinks, assetHashes };
    } catch (error) {
        console.error('Error occurred in getAssetLinks:', error);
        
        // Show error state on buttons
        const downloadButtons = document.querySelectorAll('[id$="-btn"]');
        downloadButtons.forEach(btn => {
            if (btn.href === '#' || btn.href === '') {
                btn.textContent = 'Download Unavailable';
                btn.classList.add('download-error');
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        });
        
        return null;
    }
}

// Initialize when DOM is ready
domReady(function() {
    console.log('Electros download script initialized');
    
    // Execute the function
    getAssetLinks().then(result => {
        if (!result) {
            console.error('Failed to process assets');
        }
    }).catch(error => {
        console.error('Unhandled error:', error);
    });
});

// Also support manual initialization if needed
window.initElectrosDownloads = getAssetLinks;