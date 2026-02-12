/**
 * Tests for environment variable validation module
 */

import { validateEnv } from '../env';

describe('validateEnv', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    // Reset process.env before each test to a clean state
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    // Restore original env after all tests
    process.env = ORIGINAL_ENV;
  });

  test('should pass when all required variables are set', () => {
    process.env.SESSION_SECRET = 'test-session-secret';
    process.env.ENCRYPTION_KEY = 'test-encryption-key';
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost/testdb';
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';

    // Optional vars also set
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.POSTMARK_SERVER_TOKEN = 'test-postmark-token';
    process.env.POSTMARK_FROM_EMAIL = 'test@example.com';

    expect(() => validateEnv()).not.toThrow();
  });

  test('should throw listing missing required variables', () => {
    // Remove all required env vars
    delete process.env.SESSION_SECRET;
    delete process.env.ENCRYPTION_KEY;
    delete process.env.DATABASE_URL;
    delete process.env.ANTHROPIC_API_KEY;

    expect(() => validateEnv()).toThrow(/Missing required environment variables/);
    expect(() => validateEnv()).toThrow(/SESSION_SECRET/);
    expect(() => validateEnv()).toThrow(/ENCRYPTION_KEY/);
    expect(() => validateEnv()).toThrow(/DATABASE_URL/);
    expect(() => validateEnv()).toThrow(/ANTHROPIC_API_KEY/);
  });

  test('should throw with hint text for each missing required variable', () => {
    delete process.env.SESSION_SECRET;
    delete process.env.ENCRYPTION_KEY;
    delete process.env.DATABASE_URL;
    delete process.env.ANTHROPIC_API_KEY;

    expect(() => validateEnv()).toThrow(/openssl rand -hex 32/);
    expect(() => validateEnv()).toThrow(/PostgreSQL connection string/);
    expect(() => validateEnv()).toThrow(/console\.anthropic\.com/);
  });

  test('should throw when only some required variables are missing', () => {
    process.env.SESSION_SECRET = 'test-session-secret';
    process.env.ENCRYPTION_KEY = 'test-encryption-key';
    delete process.env.DATABASE_URL;
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';

    expect(() => validateEnv()).toThrow(/DATABASE_URL/);
  });

  test('should warn but not throw for missing optional variables', () => {
    // Set all required vars
    process.env.SESSION_SECRET = 'test-session-secret';
    process.env.ENCRYPTION_KEY = 'test-encryption-key';
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost/testdb';
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';

    // Remove optional vars
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.POSTMARK_SERVER_TOKEN;
    delete process.env.POSTMARK_FROM_EMAIL;

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    expect(() => validateEnv()).not.toThrow();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Optional variables not set')
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('NEXT_PUBLIC_APP_URL')
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('POSTMARK_SERVER_TOKEN')
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('POSTMARK_FROM_EMAIL')
    );

    warnSpy.mockRestore();
  });

  test('should not warn when optional variables are present', () => {
    // Set all vars
    process.env.SESSION_SECRET = 'test-session-secret';
    process.env.ENCRYPTION_KEY = 'test-encryption-key';
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost/testdb';
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.POSTMARK_SERVER_TOKEN = 'test-postmark-token';
    process.env.POSTMARK_FROM_EMAIL = 'test@example.com';

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    validateEnv();

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  test('should reference .env.example in error message', () => {
    delete process.env.SESSION_SECRET;
    delete process.env.ENCRYPTION_KEY;
    delete process.env.DATABASE_URL;
    delete process.env.ANTHROPIC_API_KEY;

    expect(() => validateEnv()).toThrow(/\.env\.example/);
  });
});
