/**
 * Atomosphere product page — locale-specific Gumlet embeds (EN / IT).
 */
(function () {
    const GUMLET_ALLOW =
        'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write;';

    document.addEventListener('DOMContentLoaded', loadAtomosphereVideos);

    function getPageLocale() {
        return window.ElementoI18n?.getPageLocale?.() ?? 'en';
    }

    function getCmsPath(locale) {
        return locale === 'it' ? 'CMS/atomosphere-videos.json' : 'CMS/atomosphere-videos-en.json';
    }

    function getVideoList(data, locale) {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object') {
            const list = data[locale] || data.it || [];
            return Array.isArray(list) ? list : [];
        }
        return [];
    }

    function loadAtomosphereVideos() {
        const grid = document.getElementById('atomosphere-videos-grid');
        if (!grid) return;

        const locale = getPageLocale();
        const cmsPath = getCmsPath(locale);
        const url =
            typeof window !== 'undefined' && window.ElementoI18n?.assetUrl
                ? window.ElementoI18n.assetUrl(cmsPath)
                : `/${cmsPath}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const videos = getVideoList(data, locale).filter((v) => v.embedUrl);
                if (!videos.length) {
                    grid.closest('section')?.remove();
                    return;
                }
                grid.innerHTML = videos.map((video) => renderCard(video)).join('');
            })
            .catch((err) => {
                console.error('Error loading Atomosphere videos:', err);
                grid.closest('section')?.remove();
            });
    }

    function renderCard(video) {
        const title = escapeHtml(video.title || 'Video');
        const embedUrl = escapeHtml(video.embedUrl);
        const allow = escapeHtml(
            typeof video.allow === 'string' && video.allow.trim() ? video.allow.trim() : GUMLET_ALLOW
        );
        const referrerPolicy = escapeHtml(
            typeof video.referrerPolicy === 'string' && video.referrerPolicy.trim()
                ? video.referrerPolicy.trim()
                : 'origin'
        );

        return `
            <article class="atomosphere-video-card fade-in visible">
                <h3 class="atomosphere-video-title">${title}</h3>
                <div class="atomosphere-video-embed">
                    <iframe
                        loading="lazy"
                        title="${title}"
                        src="${embedUrl}"
                        referrerpolicy="${referrerPolicy}"
                        allow="${allow}"
                        allowfullscreen
                    ></iframe>
                </div>
            </article>
        `;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
})();
