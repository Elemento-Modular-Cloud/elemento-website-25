/** Form slugs that have a chrome-free `/forms/embed/{slug}.html` route for iframes. */
export const FORM_EMBED_SLUGS = ['signup', 'getintouch'] as const;

export type FormEmbedSlug = (typeof FORM_EMBED_SLUGS)[number];

export function isFormEmbedSlug(slug: string): slug is FormEmbedSlug {
  return (FORM_EMBED_SLUGS as readonly string[]).includes(slug);
}
