import crypto from 'crypto';
import { encrypt, decrypt, EncryptedData } from './encryption';

/**
 * Session data structure
 */
export interface SessionData {
  id: string;                      // Random session ID
  createdAt: Date;                 // When session was created
  lastActivity: Date;              // Last access time (sliding window)
  isAuthenticated: boolean;        // Anonymous vs authenticated session
  data: Record<string, unknown>;   // User data (screening answers, etc.)
  expiresAt: Date;                 // Absolute expiration time
}

/**
 * Internal storage for encrypted session data
 */
interface StoredSession {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  isAuthenticated: boolean;
  encryptedData: EncryptedData;
  expiresAt: Date;
}

/**
 * In-memory session store
 * In production, this would be Redis or similar
 */
const sessionStore = new Map<string, StoredSession>();

/**
 * Default timeout durations in minutes
 */
const ANONYMOUS_TIMEOUT_MINUTES = 10;
const AUTHENTICATED_TIMEOUT_MINUTES = 15;

/**
 * Creates a new session with a cryptographically random ID
 *
 * @param options - Optional configuration
 * @param options.timeoutMinutes - Custom timeout duration (default: 10 for anonymous)
 * @returns The created session data
 *
 * @example
 * const session = createSession();
 * // Set cookie with session.id
 * // Store screening answers in session.data
 */
export function createSession(options?: {
  timeoutMinutes?: number;
}): SessionData {
  // Generate cryptographically random session ID (32 bytes = 64 hex chars)
  const sessionId = crypto.randomBytes(32).toString('hex');

  const now = new Date();
  const timeoutMinutes = options?.timeoutMinutes !== undefined
    ? options.timeoutMinutes
    : ANONYMOUS_TIMEOUT_MINUTES;
  const expiresAt = new Date(now.getTime() + timeoutMinutes * 60 * 1000);

  const sessionData: SessionData = {
    id: sessionId,
    createdAt: now,
    lastActivity: now,
    isAuthenticated: false,
    data: {},
    expiresAt,
  };

  // Encrypt the session data before storing
  const encryptedData = encrypt(JSON.stringify(sessionData.data));

  sessionStore.set(sessionId, {
    id: sessionId,
    createdAt: sessionData.createdAt,
    lastActivity: sessionData.lastActivity,
    isAuthenticated: sessionData.isAuthenticated,
    encryptedData,
    expiresAt,
  });

  return sessionData;
}

/**
 * Retrieves a session by ID, updating last activity time
 * Automatically destroys expired sessions
 *
 * @param sessionId - The session ID to retrieve
 * @returns The session data, or null if not found or expired
 *
 * @example
 * const session = getSession(sessionIdFromCookie);
 * if (!session) {
 *   // Session expired or invalid
 *   return redirect('/');
 * }
 */
export function getSession(sessionId: string): SessionData | null {
  const stored = sessionStore.get(sessionId);

  if (!stored) {
    return null;
  }

  const now = new Date();

  // Check if session has expired
  if (now > stored.expiresAt) {
    destroySession(sessionId);
    return null;
  }

  // Update last activity time (sliding window expiration)
  stored.lastActivity = now;

  // Extend expiration based on authentication status
  const timeoutMinutes = stored.isAuthenticated
    ? AUTHENTICATED_TIMEOUT_MINUTES
    : ANONYMOUS_TIMEOUT_MINUTES;

  stored.expiresAt = new Date(now.getTime() + timeoutMinutes * 60 * 1000);

  // Decrypt the session data
  const decryptedData = JSON.parse(decrypt(stored.encryptedData));

  return {
    id: stored.id,
    createdAt: stored.createdAt,
    lastActivity: stored.lastActivity,
    isAuthenticated: stored.isAuthenticated,
    data: decryptedData,
    expiresAt: stored.expiresAt,
  };
}

/**
 * Updates session data (re-encrypts before storing)
 *
 * @param sessionId - The session ID to update
 * @param data - The new session data
 * @param isAuthenticated - Optional: upgrade session to authenticated
 * @returns true if updated, false if session not found
 *
 * @example
 * updateSession(sessionId, { screening: answers }, true);
 */
export function updateSession(
  sessionId: string,
  data: Record<string, unknown>,
  isAuthenticated?: boolean
): boolean {
  const stored = sessionStore.get(sessionId);

  if (!stored) {
    return false;
  }

  const now = new Date();

  // Update authentication status if provided
  if (isAuthenticated !== undefined) {
    stored.isAuthenticated = isAuthenticated;

    // Extend timeout when upgrading to authenticated
    if (isAuthenticated) {
      stored.expiresAt = new Date(
        now.getTime() + AUTHENTICATED_TIMEOUT_MINUTES * 60 * 1000
      );
    }
  }

  // Encrypt the new data
  stored.encryptedData = encrypt(JSON.stringify(data));
  stored.lastActivity = now;

  return true;
}

/**
 * Permanently destroys a session, removing all data
 * This is how anonymous data is cleared (SECU-04 requirement)
 *
 * @param sessionId - The session ID to destroy
 *
 * @example
 * destroySession(sessionId);
 * // Clear session cookie
 */
export function destroySession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

/**
 * Cleans up expired sessions from the store
 * Should be run periodically (e.g., every 5 minutes)
 *
 * @returns Number of sessions destroyed
 *
 * @example
 * setInterval(() => {
 *   const cleaned = cleanExpiredSessions();
 *   console.log(`Cleaned ${cleaned} expired sessions`);
 * }, 5 * 60 * 1000);
 */
export function cleanExpiredSessions(): number {
  const now = new Date();
  let cleanedCount = 0;

  for (const [sessionId, stored] of sessionStore.entries()) {
    if (now > stored.expiresAt) {
      sessionStore.delete(sessionId);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

/**
 * Gets current session store size (for monitoring)
 */
export function getSessionCount(): number {
  return sessionStore.size;
}
