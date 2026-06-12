/**
 * Videos hub — locale-specific catalogs:
 * - English: CMS/videos-en.json (separate embed URLs)
 * - Italian: CMS/videos.json (it key)
 * - French: redirect to English or Italian (no local catalog)
 */
(function () {
    let videos = [];

    document.addEventListener('DOMContentLoaded', loadVideos);

    function getLabels() {
        const v = window.__I18N__?.ui?.videos ?? {};
        return {
            loading: v.loading ?? 'Loading videos…',
            errorTitle: v.errorTitle ?? 'Error Loading Videos',
            errorBody: v.errorBody ?? 'Unable to load videos. Please try again later.',
            emptyTitle: v.emptyTitle ?? 'No Videos Yet',
            emptyBody: v.emptyBody ?? 'Check back soon for recordings and resources.',
            videosLabel: v.videosLabel ?? 'videos',
            videoLabel: v.videoLabel ?? 'video',
            featured: v.featured ?? 'Featured',
            openResource: v.openResource ?? 'Open resource',
            missingEmbed: v.missingEmbed ?? 'Missing embed URL.',
            localeRedirectTitle: v.localeRedirectTitle ?? 'Videos available in English and Italian',
            localeRedirectBody:
                v.localeRedirectBody ??
                'Our recordings are not available in French yet. Browse the video library in English or Italian.',
            watchEnglish: v.watchEnglish ?? 'Watch videos in English',
            watchItalian: v.watchItalian ?? 'Watch videos in Italian',
        };
    }

    function getPageLocale() {
        return window.ElementoI18n?.getPageLocale?.() ?? 'en';
    }

    function getVideosCmsPath(locale) {
        return locale === 'en' ? 'CMS/videos-en.json' : 'CMS/videos.json';
    }

    function getVideosList(data, locale) {
        if (Array.isArray(data)) {
            return data;
        }
        if (data && typeof data === 'object') {
            const list = data[locale] || data.it || [];
            return Array.isArray(list) ? list : [];
        }
        return [];
    }

    function hasPlayableMedia(video) {
        if (video.provider === 'link') return Boolean(video.url);
        if (video.provider === 'youtube' || video.provider === 'vimeo') return Boolean(video.videoId);
        if (video.provider === 'gumlet' || video.provider === 'iframe') return Boolean(video.embedUrl);
        return Boolean(video.embedUrl || video.videoId || video.url);
    }

    function renderLocaleRedirect() {
        const grid = document.getElementById('videos-grid');
        if (!grid) return;

        const controls = document.querySelector('.videos-controls');
        if (controls) controls.hidden = true;

        const lbl = getLabels();
        const enHref = window.ElementoI18n?.pageHref?.('videos.html', 'en') ?? '/videos.html';
        const itHref = window.ElementoI18n?.pageHref?.('videos.html', 'it') ?? '/it/videos.html';

        grid.innerHTML = `
            <div class="videos-empty videos-locale-redirect">
                <i class="fas fa-language" aria-hidden="true"></i>
                <h3>${escapeHtml(lbl.localeRedirectTitle)}</h3>
                <p>${escapeHtml(lbl.localeRedirectBody)}</p>
                <div class="videos-locale-redirect__actions">
                    <a href="${escapeHtml(enHref)}" class="btn btn-primary">${escapeHtml(lbl.watchEnglish)}</a>
                    <a href="${escapeHtml(itHref)}" class="btn btn-secondary">${escapeHtml(lbl.watchItalian)}</a>
                </div>
            </div>
        `;
    }

    function loadVideos() {
        const grid = document.getElementById('videos-grid');
        if (!grid) return;

        const lbl = getLabels();
        const locale = getPageLocale();

        if (locale === 'fr') {
            renderLocaleRedirect();
            return;
        }

        grid.innerHTML = `<div class="videos-loading"><i class="fas fa-spinner" aria-hidden="true"></i><p>${escapeHtml(lbl.loading)}</p></div>`;

        const cmsPath = getVideosCmsPath(locale);
        const videosUrl =
            typeof window !== 'undefined' && window.ElementoI18n?.assetUrl
                ? window.ElementoI18n.assetUrl(cmsPath)
                : `/${cmsPath}`;

        fetch(videosUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                videos = getVideosList(data, locale).filter(hasPlayableMedia);
                updateVideosCount(videos.length);
                renderVideos();
            })
            .catch((err) => {
                console.error('Error loading videos:', err);
                grid.innerHTML = `<div class="videos-empty"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i><h3>${escapeHtml(lbl.errorTitle)}</h3><p>${escapeHtml(lbl.errorBody)}</p></div>`;
            });
    }

    function updateVideosCount(count) {
        const el = document.getElementById('videos-count');
        const lbl = getLabels();
        if (el) {
            el.textContent = count;
            const controls = el.closest('.videos-controls');
            if (controls && !controls.dataset.i18nReady) {
                const word = count === 1 ? lbl.videoLabel : lbl.videosLabel;
                controls.innerHTML = `<span><span id="videos-count">${count}</span> ${escapeHtml(word)}</span>`;
                controls.dataset.i18nReady = '1';
            }
        }
    }

    function renderVideos() {
        const grid = document.getElementById('videos-grid');
        if (!grid) return;

        const lbl = getLabels();

        if (!videos.length) {
            grid.innerHTML = `<div class="videos-empty"><i class="fas fa-video" aria-hidden="true"></i><h3>${escapeHtml(lbl.emptyTitle)}</h3><p>${escapeHtml(lbl.emptyBody)}</p></div>`;
            return;
        }

        grid.innerHTML = videos.map((video) => renderItem(video, lbl)).join('');
    }

    function renderItem(video, lbl) {
        const id = escapeHtml(video.id || '');
        const iframeTitle = escapeHtml(video.title || 'Video player');
        const tags = (video.tags || [])
            .map((t) => `<span class="video-tag">${escapeHtml(t)}</span>`)
            .join('');
        const featured = video.featured
            ? `<span class="video-featured-badge">${escapeHtml(lbl.featured)}</span>`
            : '';
        const metaBlock =
            featured || tags
                ? `<div class="video-content">${featured}${tags ? `<div class="video-tags">${tags}</div>` : ''}</div>`
                : '';
        const isLink = video.provider === 'link';
        const cardClass = `video-card${video.featured ? ' video-card--featured' : ''}${isLink ? ' video-card--link' : ''}`;
        const embedUrl = !isLink ? getEmbedUrl(video) : null;
        const allow =
            typeof video.allow === 'string' && video.allow.trim()
                ? video.allow.trim()
                : 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write;';
        const referrerPolicy =
            typeof video.referrerPolicy === 'string' && video.referrerPolicy.trim()
                ? video.referrerPolicy.trim()
                : 'strict-origin-when-cross-origin';

        return `
            <article
                class="${cardClass}"
                data-video-id="${id}"
                data-provider="${escapeHtml(video.provider || '')}"
            >
                ${metaBlock}
                ${
                    isLink
                        ? `<div class="video-link-row"><a href="${escapeHtml(
                              video.url || '#'
                          )}" class="btn btn-secondary video-link-btn" target="_blank" rel="noopener noreferrer">${escapeHtml(lbl.openResource)}</a></div>`
                        : embedUrl
                          ? `<div class="video-embed"><iframe loading="lazy" title="${iframeTitle}" src="${escapeHtml(
                                embedUrl
                            )}" allow="${escapeHtml(allow)}" referrerpolicy="${escapeHtml(
                                referrerPolicy
                            )}" allowfullscreen></iframe></div>`
                          : `<div class="video-embed video-embed--missing"><p>${escapeHtml(lbl.missingEmbed)}</p></div>`
                }
            </article>
        `;
    }

    function getEmbedUrl(video) {
        const provider = video.provider;
        if (provider === 'youtube' && video.videoId) {
            return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.videoId)}`;
        }
        if (provider === 'vimeo' && video.videoId) {
            return `https://player.vimeo.com/video/${encodeURIComponent(video.videoId)}`;
        }
        if (provider === 'gumlet' && video.embedUrl) {
            return video.embedUrl;
        }
        if (provider === 'iframe' && video.embedUrl) {
            return video.embedUrl;
        }
        return null;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
})();
