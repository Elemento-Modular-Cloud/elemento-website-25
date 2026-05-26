import type { Locale } from '../i18n/config';

/**
 * Site-root prefix for assets/, css/, js/ (always absolute so /videos/ and /videos work).
 * Locale pages still load shared assets from the domain root (/css/…, not /it/css/…).
 */
export function assetBaseFor(_locale: Locale, _stem: string): string {
  return '/';
}
