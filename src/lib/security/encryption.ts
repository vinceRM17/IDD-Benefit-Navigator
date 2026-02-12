import crypto from 'crypto';

// Fixed application salt for key derivation (not a secret, prevents rainbow tables)
const KEY_DERIVATION_SALT = 'benefits-navigator-2026';

/**
 * Encrypted data structure with IV, auth tag, and ciphertext
 */
export interface EncryptedData {
  iv: string;        // Initialization vector (hex-encoded)
  authTag: string;   // GCM authentication tag (hex-encoded)
  encrypted: string; // Ciphertext (hex-encoded)
}

/**
 * Derives a 256-bit encryption key from the ENCRYPTION_KEY environment variable
 */
function deriveKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is required for data encryption. ' +
      'Generate one with: openssl rand -hex 32'
    );
  }

  // Derive a 256-bit key using scrypt
  return crypto.scryptSync(encryptionKey, KEY_DERIVATION_SALT, 32);
}

/**
 * Encrypts plaintext using AES-256-GCM authenticated encryption
 *
 * @param plaintext - The data to encrypt
 * @returns EncryptedData object with IV, auth tag, and ciphertext
 *
 * @example
 * const encrypted = encrypt('sensitive health data');
 * // Store encrypted.iv, encrypted.authTag, encrypted.encrypted
 */
export function encrypt(plaintext: string): EncryptedData {
  const key = deriveKey();

  // Generate a random 16-byte IV for this encryption operation
  const iv = crypto.randomBytes(16);

  // Create cipher with AES-256-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  // Encrypt the plaintext
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    encrypted: encrypted,
  };
}

/**
 * Decrypts data that was encrypted with the encrypt() function
 *
 * @param data - The encrypted data object
 * @returns The original plaintext
 * @throws Error if authentication fails (data was tampered with)
 *
 * @example
 * const plaintext = decrypt(encryptedData);
 */
export function decrypt(data: EncryptedData): string {
  const key = deriveKey();

  // Convert hex strings back to buffers
  const iv = Buffer.from(data.iv, 'hex');
  const authTag = Buffer.from(data.authTag, 'hex');

  // Create decipher with AES-256-GCM
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

  // Set the authentication tag
  decipher.setAuthTag(authTag);

  try {
    // Decrypt the ciphertext
    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    throw new Error(
      'Decryption failed: data may have been tampered with or encryption key is incorrect'
    );
  }
}
