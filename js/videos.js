/**
 * Videos hub — loads CMS/videos.json and renders an expandable grid.
 */
(function () {
    let videos = [];

    document.addEventListener('DOMContentLoaded', loadVideos);

    function loadVideos() {
        const grid = document.getElementById('videos-grid');
        if (!grid) return;

        grid.innerHTML =
            '<div class="videos-loading"><i class="fas fa-spinner" aria-hidden="true"></i><p>Loading videos...</p></div>';

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
                videos = Array.isArray(data) ? data : [];
                updateVideosCount(videos.length);
                renderVideos();
            })
            .catch((err) => {
                console.error('Error loading videos:', err);
                grid.innerHTML =
                    '<div class="videos-empty"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i><h3>Error Loading Videos</h3><p>Unable to load videos. Please try again later.</p></div>';
            });
    }

    function updateVideosCount(count) {
        const el = document.getElementById('videos-count');
        if (el) el.textContent = count;
    }

    function renderVideos() {
        const grid = document.getElementById('videos-grid');
        if (!grid) return;

        if (!videos.length) {
            grid.innerHTML =
                '<div class="videos-empty"><i class="fas fa-video" aria-hidden="true"></i><h3>No Videos Yet</h3><p>Check back soon for recordings and resources.</p></div>';
            return;
        }

        grid.innerHTML = videos.map((video) => renderItem(video)).join('');
    }

    function renderItem(video) {
        const id = escapeHtml(video.id || '');
        const iframeTitle = escapeHtml(video.title || 'Video player');
        const tags = (video.tags || [])
            .map((t) => `<span class="video-tag">${escapeHtml(t)}</span>`)
            .join('');
        const featured = video.featured
            ? '<span class="video-featured-badge">Featured</span>'
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
                          )}" class="btn btn-secondary video-link-btn" target="_blank" rel="noopener noreferrer">Open resource</a></div>`
                        : embedUrl
                          ? `<div class="video-embed"><iframe loading="lazy" title="${iframeTitle}" src="${escapeHtml(
                                embedUrl
                            )}" allow="${escapeHtml(allow)}" referrerpolicy="${escapeHtml(
                                referrerPolicy
                            )}" allowfullscreen></iframe></div>`
                          : `<div class="video-embed video-embed--missing"><p>Missing embed URL.</p></div>`
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
