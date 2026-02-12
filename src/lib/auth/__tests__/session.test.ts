/**
 * Tests for JWT auth session module
 */

// Mock 'next/headers' before importing the module under test
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock the db queries module to avoid database dependency
jest.mock('@/lib/db/queries', () => ({
  saveScreening: jest.fn(),
}));

import { createAuthSession, verifySession } from '../session';

describe('Auth Session (JWT)', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    // Set a test session secret (required for JWT signing/verification)
    process.env.SESSION_SECRET = 'test-jwt-secret-key-at-least-32-chars-long-for-hs256';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('createAuthSession', () => {
    test('creates a valid JWT token string', async () => {
      const token = await createAuthSession(1, 'user@example.com');

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // JWT has three base64url-encoded parts separated by dots
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    test('creates token that can be verified', async () => {
      const token = await createAuthSession(42, 'test@example.com');

      const payload = await verifySession(token);

      expect(payload).not.toBeNull();
      expect(payload!.userId).toBe(42);
      expect(payload!.email).toBe('test@example.com');
    });

    test('includes userId and email in payload', async () => {
      const token = await createAuthSession(123, 'admin@iddnav.org');

      const payload = await verifySession(token);

      expect(payload).not.toBeNull();
      expect(payload!.userId).toBe(123);
      expect(payload!.email).toBe('admin@iddnav.org');
    });
  });

  describe('verifySession', () => {
    test('returns payload for a valid token', async () => {
      const token = await createAuthSession(7, 'valid@example.com');

      const payload = await verifySession(token);

      expect(payload).toEqual({
        userId: 7,
        email: 'valid@example.com',
      });
    });

    test('returns null for an invalid token', async () => {
      const payload = await verifySession('not-a-valid-jwt-token');

      expect(payload).toBeNull();
    });

    test('returns null for a token with wrong secret', async () => {
      // Create a token with the current secret
      const token = await createAuthSession(1, 'user@example.com');

      // Change the secret
      process.env.SESSION_SECRET = 'completely-different-secret-that-wont-match-at-all';

      // Re-import to pick up new secret — but since getSecret() reads env
      // at call time, just verifying with the changed env should fail
      const payload = await verifySession(token);

      expect(payload).toBeNull();
    });

    test('returns null for a tampered token', async () => {
      const token = await createAuthSession(1, 'user@example.com');

      // Tamper with the payload portion (second part of JWT)
      const parts = token.split('.');
      parts[1] = parts[1] + 'tampered';
      const tamperedToken = parts.join('.');

      const payload = await verifySession(tamperedToken);

      expect(payload).toBeNull();
    });

    test('returns null for an expired token', async () => {
      // We need to create a token that is already expired.
      // We use jose directly to create a short-lived token for testing.
      const { SignJWT } = await import('jose');

      const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);
      const expiredToken = await new SignJWT({
        userId: 1,
        email: 'expired@example.com',
        type: 'authenticated',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('0s') // Expires immediately
        .setIssuedAt(Math.floor(Date.now() / 1000) - 60) // Issued 60s ago
        .sign(secret);

      // Small delay to ensure the token is past its expiration
      await new Promise((resolve) => setTimeout(resolve, 50));

      const payload = await verifySession(expiredToken);

      expect(payload).toBeNull();
    });

    test('returns null for an empty string token', async () => {
      const payload = await verifySession('');

      expect(payload).toBeNull();
    });
  });

  describe('error handling', () => {
    test('throws when SESSION_SECRET is not set', async () => {
      delete process.env.SESSION_SECRET;

      await expect(
        createAuthSession(1, 'user@example.com')
      ).rejects.toThrow(/SESSION_SECRET/);
    });
  });
});
