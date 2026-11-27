/**
 * Chatwoot Cloud live chat for elemento.cloud.
 * Anonymous visitors only. Identity / HMAC setUser is not used here.
 *
 * Consently (Elemento banner): classify app.chatwoot.com as Functionality.
 * Classify app.chatwoot.com as Functionality; remove app.productbridge.io when ProductBridge is fully retired.
 *
 * Chatwoot Cloud → Website inbox for elemento.cloud → paste websiteToken below.
 * Locale follows the site language (html[lang] / language switcher), not
 * the browser language alone.
 */
(function () {
  var BASE_URL = "https://app.chatwoot.com";
  var SDK_URL = BASE_URL + "/packs/js/sdk.js";
  // Website inbox token from Chatwoot Cloud (Settings → Inboxes → Configuration).
  // Override at runtime with window.ELEMENTO_CHATWOOT_TOKEN if needed.
  var WEBSITE_TOKEN = window.ELEMENTO_CHATWOOT_TOKEN || "2omctRgPYhethNFbXmRhiTTK";
  var BUTTON_BOTTOM = 20;
  var CLEARANCE = 12;
  var MOBILE_PANEL = 520;
  var raising = false;
  var observer = null;
  var bannerObserver = null;
  var placementQueued = false;
  var langHooked = false;

  function siteLocale() {
    var lang = (document.documentElement.lang || "en").toLowerCase();
    if (lang.indexOf("it") === 0) return "it";
    if (lang.indexOf("fr") === 0) return "fr";
    return "en";
  }

  function launcherTitle(locale) {
    if (locale === "it") return "Supporto";
    if (locale === "fr") return "Assistance";
    return "Support";
  }

  // Composer lives in a cross-origin Chatwoot iframe, so we cannot raise its
  // input font to 16px from here. On iOS Safari, inputs under that threshold zoom
  // the parent page — maximum-scale=1 stops that auto-zoom while still allowing
  // pinch-zoom on current iOS.
  function preventIosInputZoom() {
    var ua = navigator.userAgent || "";
    var iOS = /iPhone|iPad|iPod/i.test(ua)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!iOS) return;
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    var content = meta.getAttribute("content") || "width=device-width, initial-scale=1";
    if (/\bmaximum-scale\s*=/i.test(content)) return;
    meta.setAttribute("content", content.replace(/,?\s*$/, "") + ", maximum-scale=1");
  }
  preventIosInputZoom();

  function bubbleNodes() {
    return Array.prototype.slice.call(
      document.querySelectorAll(
        "#cw-bubble-holder, #cw-widget-holder, .woot-widget-bubble, .woot-widget-holder"
      )
    ).filter(function (el) {
      return el && el.parentNode === document.body;
    });
  }

  function raiseMessenger() {
    if (raising || !document.body) return;
    var nodes = bubbleNodes();
    if (!nodes.length) return;
    var children = document.body.children;
    var start = children.length - nodes.length;
    var alreadyLast = start >= 0 && nodes.every(function (el, i) {
      return children[start + i] === el;
    });
    if (alreadyLast) return;
    raising = true;
    nodes.forEach(function (el) { document.body.appendChild(el); });
    raising = false;
  }

  function primaryBubble() {
    return document.querySelector(".woot-widget-bubble:not(.woot--close)")
      || document.querySelector(".woot-widget-bubble");
  }

  function bannerCover() {
    var nodes = document.querySelectorAll("#cc-main .cm, #cc-main .pm");
    var button = primaryBubble();
    var slotLeft = button ? button.getBoundingClientRect().left : window.innerWidth - 72;
    var slotRight = button ? button.getBoundingClientRect().right : window.innerWidth - 20;
    var cover = 0;
    for (var i = 0; i < nodes.length; i++) {
      var cs = getComputedStyle(nodes[i]);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
      var rect = nodes[i].getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) continue;
      if (rect.right <= slotLeft || rect.left >= slotRight) continue;
      var fromBottom = window.innerHeight - rect.top;
      if (fromBottom > cover) cover = fromBottom;
    }
    return cover;
  }

  function placeMessenger() {
    var cover = bannerCover();
    var bottom = cover > BUTTON_BOTTOM ? Math.round(cover + CLEARANCE) : 0;
    var maxBottom = Math.max(BUTTON_BOTTOM, window.innerHeight - 68);
    if (bottom > maxBottom) bottom = maxBottom;
    var lifted = bottom > BUTTON_BOTTOM;
    var bottomPx = lifted ? bottom + "px" : "";
    document.querySelectorAll(".woot-widget-bubble").forEach(function (el) {
      el.style.bottom = bottomPx;
    });
    var holder = document.querySelector(".woot-widget-holder");
    if (holder) {
      var mobile = window.innerWidth <= MOBILE_PANEL;
      holder.style.bottom = !mobile && lifted
        ? (bottom + 56) + "px"
        : "";
    }
    watchBanner();
  }

  function watchBanner() {
    if (typeof ResizeObserver !== "function") return;
    var targets = document.querySelectorAll("#cc-main .cm, #cc-main .pm");
    if (!targets.length) {
      if (bannerObserver) {
        bannerObserver.disconnect();
        bannerObserver = null;
      }
      return;
    }
    if (!bannerObserver) bannerObserver = new ResizeObserver(queuePlace);
    bannerObserver.disconnect();
    for (var i = 0; i < targets.length; i++) bannerObserver.observe(targets[i]);
  }

  function queuePlace() {
    if (placementQueued) return;
    placementQueued = true;
    requestAnimationFrame(function () {
      placementQueued = false;
      placeMessenger();
    });
  }

  function syncLocale(locale) {
    var loc = locale || siteLocale();
    if (window.$chatwoot && typeof window.$chatwoot.setLocale === "function") {
      window.$chatwoot.setLocale(loc);
    }
    if (window.chatwootSettings) {
      window.chatwootSettings.locale = loc;
      window.chatwootSettings.launcherTitle = launcherTitle(loc);
    }
  }

  function hookLangToggle() {
    if (langHooked) return;
    langHooked = true;
    new MutationObserver(function () {
      syncLocale(siteLocale());
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  function onReady() {
    raiseMessenger();
    placeMessenger();
    syncLocale(siteLocale());
    hookLangToggle();
    if (!observer) {
      observer = new MutationObserver(function () {
        raiseMessenger();
        queuePlace();
      });
      if (document.body) observer.observe(document.body, { childList: true });
      window.addEventListener("resize", queuePlace);
    }
  }

  window.addEventListener("chatwoot:ready", onReady);
  window.addEventListener("chatwoot:opened", function () {
    document.documentElement.classList.add("cw-open");
    queuePlace();
  });
  window.addEventListener("chatwoot:closed", function () {
    document.documentElement.classList.remove("cw-open");
    queuePlace();
  });

  if (!WEBSITE_TOKEN) {
    console.warn("[Elemento Chatwoot] Set WEBSITE_TOKEN in js/chatwoot.js (or window.ELEMENTO_CHATWOOT_TOKEN).");
    return;
  }

  var locale = siteLocale();
  window.chatwootSettings = {
    position: "right",
    type: "expanded_bubble",
    launcherTitle: launcherTitle(locale),
    locale: locale,
    useBrowserLanguage: false,
    darkMode: "auto"
  };

  if (document.querySelector('script[src="' + SDK_URL + '"]')) return;

  var script = document.createElement("script");
  script.src = SDK_URL;
  script.async = true;
  script.defer = true;
  script.onload = function () {
    if (!window.chatwootSDK || typeof window.chatwootSDK.run !== "function") return;
    window.chatwootSDK.run({
      websiteToken: WEBSITE_TOKEN,
      baseUrl: BASE_URL
    });
  };
  document.head.appendChild(script);
})();
