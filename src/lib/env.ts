/**
 * Environment variable validation
 * Checks all required variables on startup and fails fast with clear messages
 */

interface EnvVar {
  key: string;
  required: boolean;
  hint: string;
}

const ENV_VARS: EnvVar[] = [
  // Security — app will crash without these
  {
    key: 'SESSION_SECRET',
    required: true,
    hint: 'Generate with: openssl rand -hex 32',
  },
  {
    key: 'ENCRYPTION_KEY',
    required: true,
    hint: 'Generate with: openssl rand -hex 32',
  },

  // Database
  {
    key: 'DATABASE_URL',
    required: true,
    hint: 'PostgreSQL connection string (e.g. postgresql://user:pass@host/db)',
  },

  // AI personalization
  {
    key: 'ANTHROPIC_API_KEY',
    required: true,
    hint: 'Anthropic API key from console.anthropic.com',
  },

  // Optional — app works without these but with reduced functionality
  {
    key: 'NEXT_PUBLIC_APP_URL',
    required: false,
    hint: 'Public URL of the app (defaults to http://localhost:3000)',
  },
  {
    key: 'POSTMARK_SERVER_TOKEN',
    required: false,
    hint: 'Postmark API token for sending emails (emails disabled without this)',
  },
  {
    key: 'POSTMARK_FROM_EMAIL',
    required: false,
    hint: 'Sender email address for Postmark',
  },
];

export function validateEnv(): void {
  const missing: EnvVar[] = [];
  const warnings: EnvVar[] = [];

  for (const v of ENV_VARS) {
    if (!process.env[v.key]) {
      if (v.required) {
        missing.push(v);
      } else {
        warnings.push(v);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn(
      `[env] Optional variables not set (reduced functionality):\n` +
        warnings.map((v) => `  - ${v.key}: ${v.hint}`).join('\n')
    );
  }

  if (missing.length > 0) {
    const message =
      `Missing required environment variables:\n` +
      missing.map((v) => `  - ${v.key}: ${v.hint}`).join('\n') +
      `\n\nSee .env.example for reference.`;

    console.error(`[env] ${message}`);
    throw new Error(message);
  }
}
