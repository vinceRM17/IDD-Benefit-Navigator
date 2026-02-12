import bcrypt from 'bcryptjs';

/**
 * Number of salt rounds for bcrypt hashing
 * HIPAA minimum for 2026 is 12 rounds
 */
export const SALT_ROUNDS = 12;

/**
 * Hashes a password using bcrypt with 12 salt rounds
 *
 * @param password - The plaintext password to hash
 * @returns Promise resolving to the bcrypt hash
 *
 * @example
 * const hash = await hashPassword('user-password-123');
 * // Store hash in database
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a password against a bcrypt hash using constant-time comparison
 *
 * @param password - The plaintext password to verify
 * @param hash - The bcrypt hash to verify against
 * @returns Promise resolving to true if password matches, false otherwise
 *
 * @example
 * const isValid = await verifyPassword('user-password-123', storedHash);
 * if (isValid) {
 *   // Password is correct
 * }
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
