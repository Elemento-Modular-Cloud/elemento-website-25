/**
 * HyperMonitor live incident ticker — sliding titles at the bottom of the page.
 */
(function () {
  if (window.self !== window.top) return;

  const REFRESH_MS = 60_000;
  const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
  const IDLE = {
    id: "idle",
    title: "All feeds nominal — monitoring provider status pages",
    severity: "low",
    status: "resolved",
    providers: ["HyperMonitor"],
    active: false,
    updatedAt: new Date().toISOString(),
    href: "/overview",
  };

  function isLocal() {
    return LOCAL_HOSTS.has(location.hostname);
  }

  function homeBase() {
    if (window.__HYPERMONITOR_ORIGIN__) return String(window.__HYPERMONITOR_ORIGIN__).replace(/\/+$/, "");
    return isLocal() ? "http://localhost:3000" : "https://hypermonitor.elemento.cloud";
  }

  function apiUrl() {
    const key = window.__HYPERMONITOR_TICKER_KEY__;
    const url = new URL("/api/ticker", homeBase());
    if (key) url.searchParams.set("key", String(key));
    return url.toString();
  }

  function severityClass(severity) {
    const map = { critical: "badge-critical", high: "badge-high", medium: "badge-medium", low: "badge-low" };
    return map[severity] || "badge-unknown";
  }

  function statusClass(status) {
    const map = {
      investigating: "status-investigating",
      identified: "status-identified",
      monitoring: "status-monitoring",
      resolved: "status-resolved",
      planned: "status-maintenance-scheduled",
      scheduled: "status-maintenance-scheduled",
      ongoing: "status-maintenance-ongoing",
    };
    return map[status] || "status-unknown";
  }

  function formatRelative(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  function itemHref(item) {
    if (item.id === "idle") return `${homeBase()}/overview`;
    const path = item.href || `/groups/${item.id}`;
    return path.startsWith("http") ? path : `${homeBase()}${path}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function segmentHtml(item) {
    const providers = item.providers && item.providers.length ? item.providers.join(" · ") : "UNKNOWN";
    const critical = item.active && item.severity === "critical" ? " atc-ticker-item--critical" : "";
    const idle = item.id === "idle" ? " atc-ticker-item--static" : "";
    const inner = `
      <span class="atc-ticker-severity ${severityClass(item.severity)}">${escapeHtml(item.severity)}</span>
      <span class="atc-ticker-dot" aria-hidden="true">◆</span>
      <span class="atc-ticker-provider">${escapeHtml(providers)}</span>
      <span class="atc-ticker-dot" aria-hidden="true">◆</span>
      <span class="atc-ticker-status ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
      <span class="atc-ticker-dot" aria-hidden="true">◆</span>
      <span class="atc-ticker-title">${escapeHtml(item.title)}</span>
      <span class="atc-ticker-dot" aria-hidden="true">◆</span>
      <span class="atc-ticker-time">${escapeHtml(formatRelative(item.updatedAt))}</span>
      ${item.active ? "" : '<span class="atc-ticker-resolved">CLR</span>'}
      ${item.confirmationLevel === "corroborated" ? '<span class="atc-ticker-corroborated" title="Corroborated by secondary feed">CORR</span>' : ""}
    `;
    if (item.id === "idle") {
      return `<span class="atc-ticker-item${idle}${critical}">${inner}</span>`;
    }
    return `<a class="atc-ticker-item${critical}" href="${escapeHtml(itemHref(item))}" target="_blank" rel="noopener">${inner}</a>`;
  }

  function renderTrack(root, items) {
    const display = items.length ? items : [IDLE];
    const loop = display.concat(display);
    const duration = Math.max(45, display.length * 8);
    root.style.setProperty("--atc-duration", `${duration}s`);
    const track = root.querySelector(".atc-ticker-track");
    if (!track) return;
    track.innerHTML = loop.map(segmentHtml).join("");
  }

  function mount() {
    if (document.getElementById("hypermonitor-live-ticker")) return;
    const root = document.createElement("div");
    root.id = "hypermonitor-live-ticker";
    root.className = "atc-ticker atc-ticker--fixed";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Live incident ticker");
    root.innerHTML = `
      <div class="atc-ticker-label" aria-hidden="true">
        <span class="atc-ticker-live-dot"></span>
        LIVE
      </div>
      <div class="atc-ticker-viewport">
        <div class="atc-ticker-track"></div>
      </div>
    `;
    document.body.appendChild(root);
    document.body.classList.add("has-hypermonitor-ticker");
    document.documentElement.classList.add("has-hypermonitor-ticker");
    renderTrack(root, []);
    return root;
  }

  async function load(root) {
    try {
      const res = await fetch(apiUrl(), { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const items = await res.json();
      renderTrack(root, Array.isArray(items) ? items : []);
    } catch {
      renderTrack(root, []);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const root = mount();
    if (!root) return;
    load(root);
    window.setInterval(() => load(root), REFRESH_MS);
  });
})();
