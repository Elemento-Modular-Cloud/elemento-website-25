/**
 * Matomo analytics — executed only after Iubenda Cookie Solution activates the script tag
 * (type="text/plain" + class="_iub_cs_activate" + data-iub-purposes).
 * Ensure data-iub-purposes matches the Statistics / Matomo purpose ID in your Iubenda dashboard.
 */
var _paq = window._paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function () {
    var u = '//matomo.elemento.cloud/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
})();
