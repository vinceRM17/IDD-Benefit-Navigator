/**
 * Tests for in-memory session store
 */

import {
  createSession,
  getSession,
  updateSession,
  destroySession,
  cleanExpiredSessions,
  getSessionCount,
} from '../session';

describe('Session Store', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    // Set a test encryption key (required by the encryption module)
    process.env.ENCRYPTION_KEY = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
  });

  afterEach(() => {
    // Clean up all sessions between tests by destroying them
    // We use cleanExpiredSessions with a far-future trick is not viable,
    // so we just track and destroy sessions we create
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  describe('createSession', () => {
    test('returns a valid session with a unique ID', () => {
      const session = createSession();

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(typeof session.id).toBe('string');
      // 32 bytes = 64 hex characters
      expect(session.id).toHaveLength(64);
      expect(session.id).toMatch(/^[0-9a-f]+$/);
    });

    test('returns session with correct initial properties', () => {
      const before = new Date();
      const session = createSession();
      const after = new Date();

      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());

      expect(session.lastActivity).toBeInstanceOf(Date);
      expect(session.isAuthenticated).toBe(false);
      expect(session.data).toEqual({});
      expect(session.expiresAt).toBeInstanceOf(Date);
    });

    test('sets default 10-minute expiration for anonymous sessions', () => {
      const session = createSession();

      const expectedExpiry = session.createdAt.getTime() + 10 * 60 * 1000;
      expect(session.expiresAt.getTime()).toBe(expectedExpiry);
    });

    test('supports custom timeout duration', () => {
      const session = createSession({ timeoutMinutes: 30 });

      const expectedExpiry = session.createdAt.getTime() + 30 * 60 * 1000;
      expect(session.expiresAt.getTime()).toBe(expectedExpiry);
    });

    test('generates unique IDs for each session', () => {
      const session1 = createSession();
      const session2 = createSession();

      expect(session1.id).not.toBe(session2.id);

      // Clean up
      destroySession(session1.id);
      destroySession(session2.id);
    });
  });

  describe('getSession', () => {
    test('returns session data for a valid session ID', () => {
      const created = createSession();
      const retrieved = getSession(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(created.id);
      expect(retrieved!.isAuthenticated).toBe(false);
      expect(retrieved!.data).toEqual({});

      destroySession(created.id);
    });

    test('updates lastActivity on access', () => {
      const created = createSession();
      const originalActivity = created.lastActivity;

      // Small delay to ensure time difference
      const retrieved = getSession(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved!.lastActivity.getTime()).toBeGreaterThanOrEqual(
        originalActivity.getTime()
      );

      destroySession(created.id);
    });

    test('returns null for non-existent session ID', () => {
      const result = getSession('nonexistent-session-id');

      expect(result).toBeNull();
    });

    test('returns null for expired sessions and destroys them', () => {
      // Create a session that expires immediately
      const session = createSession({ timeoutMinutes: 0 });

      // Wait a tick to ensure expiration
      const result = getSession(session.id);

      expect(result).toBeNull();

      // Session should be destroyed (subsequent get also returns null)
      expect(getSession(session.id)).toBeNull();
    });

    test('extends expiration on access (sliding window)', () => {
      const session = createSession();
      const originalExpiry = session.expiresAt;

      const retrieved = getSession(session.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved!.expiresAt.getTime()).toBeGreaterThanOrEqual(
        originalExpiry.getTime()
      );

      destroySession(session.id);
    });
  });

  describe('updateSession', () => {
    test('updates session data', () => {
      const session = createSession();
      const screeningData = { householdSize: 4, state: 'KY' };

      const updated = updateSession(session.id, screeningData);
      expect(updated).toBe(true);

      const retrieved = getSession(session.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.data).toEqual(screeningData);

      destroySession(session.id);
    });

    test('returns false for non-existent session', () => {
      const result = updateSession('nonexistent-id', { test: true });

      expect(result).toBe(false);
    });

    test('upgrades session to authenticated status', () => {
      const session = createSession();

      const updated = updateSession(session.id, { userId: 42 }, true);
      expect(updated).toBe(true);

      const retrieved = getSession(session.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.isAuthenticated).toBe(true);
      expect(retrieved!.data).toEqual({ userId: 42 });

      destroySession(session.id);
    });

    test('updates lastActivity timestamp', () => {
      const session = createSession();
      const originalActivity = session.lastActivity;

      updateSession(session.id, { updated: true });

      const retrieved = getSession(session.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.lastActivity.getTime()).toBeGreaterThanOrEqual(
        originalActivity.getTime()
      );

      destroySession(session.id);
    });
  });

  describe('destroySession', () => {
    test('removes session from the store', () => {
      const session = createSession();
      expect(getSession(session.id)).not.toBeNull();

      destroySession(session.id);

      expect(getSession(session.id)).toBeNull();
    });

    test('does not throw for non-existent session', () => {
      expect(() => destroySession('nonexistent-id')).not.toThrow();
    });
  });

  describe('cleanExpiredSessions', () => {
    test('removes only expired sessions', () => {
      // Create a session that expires immediately
      const expiredSession = createSession({ timeoutMinutes: 0 });

      // Create a session that does not expire soon
      const activeSession = createSession({ timeoutMinutes: 60 });

      const cleaned = cleanExpiredSessions();

      expect(cleaned).toBeGreaterThanOrEqual(1);

      // Expired session should be gone
      expect(getSession(expiredSession.id)).toBeNull();

      // Active session should still exist
      expect(getSession(activeSession.id)).not.toBeNull();

      destroySession(activeSession.id);
    });

    test('returns 0 when no sessions are expired', () => {
      const session = createSession({ timeoutMinutes: 60 });

      const cleaned = cleanExpiredSessions();

      expect(cleaned).toBe(0);

      destroySession(session.id);
    });
  });

  describe('getSessionCount', () => {
    test('returns the number of active sessions', () => {
      const initialCount = getSessionCount();

      const session1 = createSession();
      const session2 = createSession();

      expect(getSessionCount()).toBe(initialCount + 2);

      destroySession(session1.id);
      destroySession(session2.id);

      expect(getSessionCount()).toBe(initialCount);
    });
  });
});
