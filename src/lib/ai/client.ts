/**
 * Anthropic Claude API client for AI personalization
 *
 * Provides singleton client instance for generating personalized benefit explanations.
 * Gracefully handles missing API key for development environments.
 */

import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

/**
 * Initialize and return Anthropic client
 *
 * Returns null if ANTHROPIC_API_KEY is not configured.
 * Logs warning on first access if key is missing.
 */
export function getAnthropicClient(): Anthropic | null {
  if (client !== null) {
    return client;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn(
      '[AI] ANTHROPIC_API_KEY not configured. AI explanations will be disabled. ' +
      'Set ANTHROPIC_API_KEY environment variable to enable personalized explanations.'
    );
    client = null;
    return null;
  }

  try {
    client = new Anthropic({
      apiKey,
    });
    return client;
  } catch (error) {
    console.error('[AI] Failed to initialize Anthropic client:', error);
    client = null;
    return null;
  }
}
