/**
 * Rewrite root-relative asset paths in legacy HTML body for nested locales (e.g. /it/).
 */
export function prefixBodyAssets(html: string, assetBase: string): string {
  const base = assetBase || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;

  let out = html;

  const rewrite = (attr: string, root: string) => {
    const re = new RegExp(`(${attr}=["'])(?:\\.\\/?)?(${root})`, 'g');
    out = out.replace(re, `$1${prefix}$2`);
  };

  rewrite('src', 'assets');
  rewrite('href', 'assets');
  rewrite('src', 'components');
  rewrite('href', 'components');
  rewrite('src', 'CMS');
  rewrite('href', 'CMS');
  rewrite('src', 'css');
  rewrite('href', 'css');
  rewrite('src', 'js');
  rewrite('href', 'js');

  out = out.replace(/url\(\s*['"]?(?:\.\/)?assets\//g, `url(${prefix}assets/`);
  out = out.replace(/url\(\s*['"]?(?:\.\/)?CMS\//g, `url(${prefix}CMS/`);

  return out;
}

/** Prefix a single site-root-relative URL (CMS/…, assets/…). */
export function prefixAssetPath(path: string, assetBase: string): string {
  if (!path || !assetBase) return path;
  if (/^(https?:|\/\/|\/|data:|#)/.test(path)) return path;
  const clean = path.replace(/^\.\//, '');
  if (clean.startsWith(assetBase)) return clean;
  return assetBase + clean;
}

/** Rewrite internal *.html links to depth-relative paths (works on custom domain + GitHub Pages). */
export function prefixBodyPageLinks(html: string, stem: string): string {
  const folderDepth = stem === 'index' ? 0 : stem.split('/').length - 1;
  const prefix = folderDepth === 0 ? '' : '../'.repeat(folderDepth);

  return html.replace(/(\shref=["'])([^"'#]+)(["'])/gi, (match, open, href, close) => {
    if (/^(https?:|\/\/|mailto:|tel:|#|javascript:)/i.test(href)) return match;

    let filename: string | null = null;
    if (href.startsWith('/')) {
      const m = href.match(/^\/([^/?#]+\.html)$/);
      if (m) filename = m[1];
    } else {
      const clean = href.replace(/^\.\//, '');
      if (/^[^/?#]+\.html$/.test(clean)) filename = clean;
    }
    if (!filename) return match;

    return `${open}${prefix}${filename}${close}`;
  });
}
