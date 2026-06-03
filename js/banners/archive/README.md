# Top announcement banner archive

Reference copies of retired or replaced site-wide top banners. The live banner is rendered by `renderBanner()` in `js/navbar.js` on every page that loads the navbar.

## Files

| File | Description |
|------|-------------|
| `keynote-2025.html` | Markup only (for preview or docs) |
| `keynote-2025.renderBanner-snippet.js` | Exact `return` template used in `navbar.js` |
| `keynote-2025.css` | Keynote-specific styles (blur photo, orange glow); merge into `style.css` with `--keynote` modifier |

## AtomOS discount (current)

- **Markup:** `atomos-discount.html`, `atomos-discount.renderBanner-snippet.js`
- **Styles:** `css/style.css` — `.announcement-banner--atomos-discount` (animated `--blue-dark` / `--blue` / `--blue-light` gradient + shine)
- **Link:** AtomOS shop URL (see `renderBanner()` in `navbar.js`)
- **Copy:** `src/i18n/ui/{en,it,fr}.json` → `banner.atomosDiscountText` / `banner.atomosDiscountAria`
- **Scope:** all pages with `#navbar-placeholder` + `navbar.js` (not embedded iframes)

## Keynote 2025 (retired)

- **Active from:** restored June 2026 (see git history)
- **URL:** https://youtube.com/live/urhPkWeF3Yg
- **Scope:** was English home only via `isHomePage()` (retired)
- **Styles:** `css/style.css` — section `/* Announcement Banner */`; background `assets/img/keynote_2025_bg.jpeg` on `.announcement-banner::before`
- **Navbar offset:** `.navbar.has-banner { top: 60px; }`

To disable the live banner without deleting this archive, return `''` from `renderBanner()` after copying any changes here first.
