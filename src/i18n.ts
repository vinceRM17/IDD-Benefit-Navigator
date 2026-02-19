/**
 * i18n configuration for the IDD Benefits Navigator
 * Supports English and Spanish with client-side locale switching
 */

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/**
 * Load all messages for a given locale
 */
export async function getMessages(locale: Locale) {
  const [common, screening, results, resources] = await Promise.all([
    import(`./messages/${locale}/common.json`),
    import(`./messages/${locale}/screening.json`),
    import(`./messages/${locale}/results.json`),
    import(`./messages/${locale}/resources.json`),
  ]);

  return {
    common: common.default,
    screening: screening.default,
    results: results.default,
    resources: resources.default,
  };
}

/**
 * Synchronous message loader for client components
 */
export function getMessagesSync(locale: Locale) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const common = require(`./messages/${locale}/common.json`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const screening = require(`./messages/${locale}/screening.json`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const results = require(`./messages/${locale}/results.json`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const resources = require(`./messages/${locale}/resources.json`);

  return { common, screening, results, resources };
}
