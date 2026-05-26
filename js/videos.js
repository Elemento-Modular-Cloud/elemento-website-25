/**
 * Videos hub — loads CMS/videos.json and renders an expandable grid.
 */
(function () {
    let videos = [];
    let expandedId = null;

    document.addEventListener('DOMContentLoaded', loadVideos);

    function loadVideos() {
        const grid = document.getElementById('videos-grid');
        if (!grid) return;

        grid.innerHTML =
            '<div class="videos-loading"><i class="fas fa-spinner" aria-hidden="true"></i><p>Loading videos...</p></div>';

        fetch('CMS/videos.json')
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

        grid.innerHTML = videos.map((video) => renderCard(video)).join('');
        bindCardInteractions(grid);
    }

    function renderCard(video) {
        const id = escapeHtml(video.id || '');
        const title = escapeHtml(video.title || 'Untitled');
        const summary = escapeHtml(video.summary || '');
        const date = video.date ? formatDate(video.date) : '';
        const thumbnail = escapeHtml(getThumbnail(video));
        const tags = (video.tags || [])
            .map((t) => `<span class="video-tag">${escapeHtml(t)}</span>`)
            .join('');
        const featured = video.featured
            ? '<span class="video-featured-badge">Featured</span>'
            : '';
        const isLink = video.provider === 'link';
        const playLabel = isLink ? 'Open resource' : 'Play video';
        const cardClass = `video-card${video.featured ? ' video-card--featured' : ''}${isLink ? ' video-card--link' : ''}`;
        const interactiveAttrs = isLink
            ? ''
            : ` tabindex="0" role="button" aria-expanded="false" aria-label="${title}. ${playLabel}."`;

        return `
            <article
                class="${cardClass}"
                data-video-id="${id}"
                data-provider="${escapeHtml(video.provider || '')}"${interactiveAttrs}
            >
                <div class="video-card-header">
                    <div class="video-thumbnail">
                        <img src="${thumbnail}" alt="" loading="lazy" width="480" height="270">
                        <span class="video-play-overlay" aria-hidden="true">
                            <i class="fas ${isLink ? 'fa-external-link-alt' : 'fa-play'}"></i>
                        </span>
                    </div>
                    <div class="video-content">
                        ${featured}
                        <h2 class="video-title">${title}</h2>
                        ${date ? `<p class="video-meta">${date}</p>` : ''}
                        ${summary ? `<p class="video-summary">${summary}</p>` : ''}
                        ${tags ? `<div class="video-tags">${tags}</div>` : ''}
                        ${
                            isLink
                                ? `<a href="${escapeHtml(video.url || '#')}" class="btn btn-secondary video-link-btn" target="_blank" rel="noopener noreferrer">Open resource</a>`
                                : `<button type="button" class="btn btn-secondary video-play-btn">${playLabel}</button>`
                        }
                    </div>
                </div>
                <div class="video-embed-panel" hidden>
                    <div class="video-embed"></div>
                </div>
            </article>
        `;
    }

    function bindCardInteractions(grid) {
        grid.querySelectorAll('.video-card').forEach((card) => {
            const provider = card.dataset.provider;
            if (provider === 'link') return;

            const playBtn = card.querySelector('.video-play-btn');
            const handler = (e) => {
                if (e.target.closest('.video-link-btn')) return;
                e.preventDefault();
                toggleCard(card);
            };

            card.addEventListener('click', handler);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard(card);
                }
            });
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleCard(card);
                });
            }
        });
    }

    function toggleCard(card) {
        const id = card.dataset.videoId;
        const video = videos.find((v) => v.id === id);
        if (!video || video.provider === 'link') return;

        const isExpanded = card.classList.contains('is-expanded');

        document.querySelectorAll('.video-card.is-expanded').forEach((other) => {
            if (other !== card) collapseCard(other);
        });

        if (isExpanded) {
            collapseCard(card);
            expandedId = null;
        } else {
            expandCard(card, video);
            expandedId = id;
        }
    }

    function expandCard(card, video) {
        card.classList.add('is-expanded');
        card.setAttribute('aria-expanded', 'true');

        const panel = card.querySelector('.video-embed-panel');
        const embedRoot = card.querySelector('.video-embed');
        if (!panel || !embedRoot) return;

        panel.hidden = false;

        if (!embedRoot.querySelector('iframe')) {
            const iframe = createEmbedIframe(video);
            if (iframe) embedRoot.appendChild(iframe);
        }

        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function collapseCard(card) {
        card.classList.remove('is-expanded');
        card.setAttribute('aria-expanded', 'false');

        const panel = card.querySelector('.video-embed-panel');
        if (panel) panel.hidden = true;
    }

    function createEmbedIframe(video) {
        const src = getEmbedUrl(video);
        if (!src) return null;

        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = video.title || 'Video player';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute(
            'allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        );
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        return iframe;
    }

    function getEmbedUrl(video) {
        const provider = video.provider;
        if (provider === 'youtube' && video.videoId) {
            return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.videoId)}`;
        }
        if (provider === 'vimeo' && video.videoId) {
            return `https://player.vimeo.com/video/${encodeURIComponent(video.videoId)}`;
        }
        if (provider === 'iframe' && video.embedUrl) {
            return video.embedUrl;
        }
        return null;
    }

    function getThumbnail(video) {
        if (video.thumbnail) return video.thumbnail;
        if (video.provider === 'youtube' && video.videoId) {
            return `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
        }
        return 'assets/img/banner.webp';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
})();
