/**
 * CSRF token generation and validation
 * Uses HMAC-SHA256 for token security
 */

import { createHmac, randomBytes } from 'crypto';

/**
 * Generate a CSRF token
 * @param secret - CSRF secret from environment
 * @returns Base64-encoded CSRF token
 */
export function generateToken(secret: string): string {
  // Generate random data
  const randomData = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  const payload = `${randomData}:${timestamp}`;

  // Create HMAC signature
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  // Return token as payload:signature
  const token = `${payload}:${signature}`;
  return Buffer.from(token).toString('base64');
}

/**
 * Validate a CSRF token
 * @param token - Base64-encoded CSRF token
 * @param secret - CSRF secret from environment
 * @param maxAgeMs - Maximum age of token in milliseconds (default: 1 hour)
 * @returns True if token is valid, false otherwise
 */
export function validateToken(
  token: string,
  secret: string,
  maxAgeMs: number = 3600000 // 1 hour
): boolean {
  try {
    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 3) {
      return false;
    }

    const [randomData, timestamp, providedSignature] = parts;
    const payload = `${randomData}:${timestamp}`;

    // Verify signature
    const hmac = createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    if (providedSignature !== expectedSignature) {
      return false;
    }

    // Check timestamp
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (tokenAge > maxAgeMs) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
