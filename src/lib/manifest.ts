import manifest from '../data/pages-manifest.json';
import excludedPages from '../data/excluded-pages.json';
import type { Locale } from '../i18n/config';
import type { PageEntry } from './page-types';

const EXCLUDED = new Set(excludedPages as string[]);

export const PAGES = (manifest as PageEntry[]).filter((p) => !EXCLUDED.has(p.stem));

export function pagesByGroup(group: string, locale: Locale): PageEntry[] {
  return PAGES.filter((p) => p.group === group && p.locales.includes(locale));
}

export function pageByStem(stem: string, locale: Locale): PageEntry | undefined {
  return PAGES.find((p) => p.stem === stem && p.locales.includes(locale));
}
