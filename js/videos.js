/**
 * Videos hub — loads CMS/videos.json and renders an expandable grid.
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
        };
    }

    function resolveVideo(video) {
        const locale = window.ElementoI18n?.getPageLocale?.() ?? 'en';
        if (window.ElementoI18n?.resolveCmsEntry) {
            return window.ElementoI18n.resolveCmsEntry(video, locale);
        }
        return video;
    }

    function loadVideos() {
        const grid = document.getElementById('videos-grid');
        if (!grid) return;

        const lbl = getLabels();
        grid.innerHTML = `<div class="videos-loading"><i class="fas fa-spinner" aria-hidden="true"></i><p>${escapeHtml(lbl.loading)}</p></div>`;

        const videosUrl =
            typeof window !== 'undefined' && window.ElementoI18n?.assetUrl
                ? window.ElementoI18n.assetUrl('CMS/videos.json')
                : '/CMS/videos.json';

        fetch(videosUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                videos = Array.isArray(data) ? data.map(resolveVideo) : [];
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
