/**
 * Tests for AES-256-GCM encryption/decryption module
 */

import { encrypt, decrypt, EncryptedData } from '../encryption';

describe('Encryption', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    // Set a test encryption key (64 hex chars = 32 bytes)
    process.env.ENCRYPTION_KEY = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('should round-trip encrypt and decrypt correctly', () => {
    const plaintext = 'sensitive health data for IDD benefits screening';

    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(plaintext);
  });

  test('should round-trip with empty string', () => {
    const plaintext = '';

    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(plaintext);
  });

  test('should round-trip with special characters and unicode', () => {
    const plaintext = 'Child has IDD diagnosis (autism spectrum). Income: $2,500/mo. Notes: "needs waiver"';

    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(plaintext);
  });

  test('should round-trip with JSON data', () => {
    const data = {
      householdSize: 4,
      monthlyIncome: 2000,
      hasDisabilityDiagnosis: true,
      state: 'KY',
    };
    const plaintext = JSON.stringify(data);

    const encrypted = encrypt(plaintext);
    const decrypted = decrypt(encrypted);

    expect(JSON.parse(decrypted)).toEqual(data);
  });

  test('should produce different ciphertext for same plaintext (random IV)', () => {
    const plaintext = 'same data encrypted twice';

    const encrypted1 = encrypt(plaintext);
    const encrypted2 = encrypt(plaintext);

    // IVs should be different
    expect(encrypted1.iv).not.toBe(encrypted2.iv);

    // Ciphertext should be different
    expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted);

    // But both should decrypt to the same plaintext
    expect(decrypt(encrypted1)).toBe(plaintext);
    expect(decrypt(encrypted2)).toBe(plaintext);
  });

  test('should return EncryptedData with iv, authTag, and encrypted fields', () => {
    const encrypted = encrypt('test data');

    expect(encrypted).toHaveProperty('iv');
    expect(encrypted).toHaveProperty('authTag');
    expect(encrypted).toHaveProperty('encrypted');

    // All values should be hex-encoded strings
    expect(encrypted.iv).toMatch(/^[0-9a-f]+$/);
    expect(encrypted.authTag).toMatch(/^[0-9a-f]+$/);
    expect(encrypted.encrypted).toMatch(/^[0-9a-f]+$/);

    // IV should be 16 bytes = 32 hex chars
    expect(encrypted.iv).toHaveLength(32);

    // Auth tag should be 16 bytes = 32 hex chars
    expect(encrypted.authTag).toHaveLength(32);
  });

  test('should fail decryption with tampered ciphertext', () => {
    const encrypted = encrypt('sensitive data');

    const tampered: EncryptedData = {
      ...encrypted,
      encrypted: encrypted.encrypted.replace(
        encrypted.encrypted[0],
        encrypted.encrypted[0] === 'a' ? 'b' : 'a'
      ),
    };

    expect(() => decrypt(tampered)).toThrow(/tampered/i);
  });

  test('should fail decryption with tampered auth tag', () => {
    const encrypted = encrypt('sensitive data');

    const tampered: EncryptedData = {
      ...encrypted,
      authTag: 'ff'.repeat(16), // Replace auth tag entirely
    };

    expect(() => decrypt(tampered)).toThrow(/tampered/i);
  });

  test('should fail decryption with tampered IV', () => {
    const encrypted = encrypt('sensitive data');

    const tampered: EncryptedData = {
      ...encrypted,
      iv: 'ff'.repeat(16), // Replace IV entirely
    };

    expect(() => decrypt(tampered)).toThrow(/tampered/i);
  });

  test('should throw when ENCRYPTION_KEY is not set', () => {
    delete process.env.ENCRYPTION_KEY;

    expect(() => encrypt('test')).toThrow(/ENCRYPTION_KEY/);
  });
});
