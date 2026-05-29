/**
 * Signup page — iframe embed: height, theme sync, and form-submitted redirect.
 */
(function () {
    const iframe = document.getElementById('signupIframe');
    if (!iframe) return;

    const MIN_HEIGHT = 640;

    function setIframeHeight() {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return;
            const height = Math.max(
                doc.body?.scrollHeight ?? 0,
                doc.documentElement?.scrollHeight ?? 0,
                MIN_HEIGHT
            );
            iframe.style.height = `${height + 24}px`;
        } catch {
            iframe.style.minHeight = `${MIN_HEIGHT}px`;
        }
    }

    function sendThemeToIframe() {
        if (!iframe.contentWindow) return;
        const theme =
            document.body.getAttribute('data-theme') ||
            document.body.className ||
            'theme-light';
        iframe.contentWindow.postMessage({ type: 'theme-change', theme }, '*');
    }

    iframe.addEventListener('load', function () {
        setIframeHeight();
        sendThemeToIframe();
        window.setTimeout(setIframeHeight, 300);
        window.setTimeout(setIframeHeight, 1200);
    });

    window.addEventListener('message', function (event) {
        if (event.data?.type === 'form-submitted') {
            const i18n = window.ElementoI18n;
            const successPath =
                i18n && typeof i18n.localeStemHref === 'function'
                    ? i18n.localeStemHref('signup-success', i18n.getPageLocale?.() ?? 'en')
                    : '/signup-success.html';
            window.location.href = successPath;
        }
        if (event.data?.type === 'iframe-resize' && typeof event.data.height === 'number') {
            iframe.style.height = `${Math.max(event.data.height, MIN_HEIGHT)}px`;
        }
    });

    const themeObserver = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            if (
                mutation.type === 'attributes' &&
                (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class')
            ) {
                sendThemeToIframe();
                break;
            }
        }
    });
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
    });

    iframe.addEventListener('error', function () {
        const section = iframe.closest('.signup-iframe-section');
        if (!section) return;
        section.innerHTML = `
            <div class="container" style="text-align: center; padding: var(--space-4xl) 0;">
                <p>Failed to load signup form. Please refresh the page or try again later.</p>
                <button type="button" class="btn btn-primary" onclick="location.reload()" style="margin-top: var(--space-md);">
                    Refresh Page
                </button>
            </div>`;
    });
})();
