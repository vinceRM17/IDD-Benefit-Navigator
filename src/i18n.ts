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
  const [common, screening, results, resources, auth, dashboard, referral, pages] = await Promise.all([
    import(`./messages/${locale}/common.json`),
    import(`./messages/${locale}/screening.json`),
    import(`./messages/${locale}/results.json`),
    import(`./messages/${locale}/resources.json`),
    import(`./messages/${locale}/auth.json`),
    import(`./messages/${locale}/dashboard.json`),
    import(`./messages/${locale}/referral.json`),
    import(`./messages/${locale}/pages.json`),
  ]);

  return {
    common: common.default,
    screening: screening.default,
    results: results.default,
    resources: resources.default,
    auth: auth.default,
    dashboard: dashboard.default,
    referral: referral.default,
    pages: pages.default,
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const auth = require(`./messages/${locale}/auth.json`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dashboard = require(`./messages/${locale}/dashboard.json`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const referral = require(`./messages/${locale}/referral.json`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pages = require(`./messages/${locale}/pages.json`);

  return { common, screening, results, resources, auth, dashboard, referral, pages };
}
