/**
 * Next.js instrumentation hook
 * Runs once when the server starts — used for env validation and startup checks
 */

export async function register() {
  // Only validate on the server (not during edge middleware)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('./lib/env');
    validateEnv();
  }
}
