/**
 * Tests for expired account cleanup job
 */

// Mock the db queries module
jest.mock('@/lib/db/queries', () => ({
  getExpiredSoftDeletes: jest.fn(),
  hardDeleteUser: jest.fn(),
}));

import { cleanupExpiredAccounts } from '../cleanup';
import { getExpiredSoftDeletes, hardDeleteUser } from '@/lib/db/queries';

// Cast mocks for type-safe usage
const mockGetExpiredSoftDeletes = getExpiredSoftDeletes as jest.MockedFunction<
  typeof getExpiredSoftDeletes
>;
const mockHardDeleteUser = hardDeleteUser as jest.MockedFunction<
  typeof hardDeleteUser
>;

describe('cleanupExpiredAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console output during tests
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call hardDeleteUser for each expired user', async () => {
    const expiredUsers = [
      { id: 1, email: 'user1@example.com', deletedAt: new Date('2026-01-01') },
      { id: 2, email: 'user2@example.com', deletedAt: new Date('2026-01-05') },
      { id: 3, email: 'user3@example.com', deletedAt: new Date('2026-01-10') },
    ];

    mockGetExpiredSoftDeletes.mockResolvedValue(expiredUsers as any);
    mockHardDeleteUser.mockResolvedValue({} as any);

    await cleanupExpiredAccounts();

    expect(mockGetExpiredSoftDeletes).toHaveBeenCalledTimes(1);
    expect(mockHardDeleteUser).toHaveBeenCalledTimes(3);
    expect(mockHardDeleteUser).toHaveBeenCalledWith(1);
    expect(mockHardDeleteUser).toHaveBeenCalledWith(2);
    expect(mockHardDeleteUser).toHaveBeenCalledWith(3);
  });

  test('should return count of deleted users', async () => {
    const expiredUsers = [
      { id: 10, email: 'a@example.com', deletedAt: new Date() },
      { id: 20, email: 'b@example.com', deletedAt: new Date() },
    ];

    mockGetExpiredSoftDeletes.mockResolvedValue(expiredUsers as any);
    mockHardDeleteUser.mockResolvedValue({} as any);

    const count = await cleanupExpiredAccounts();

    expect(count).toBe(2);
  });

  test('should return 0 when no expired users exist', async () => {
    mockGetExpiredSoftDeletes.mockResolvedValue([]);

    const count = await cleanupExpiredAccounts();

    expect(count).toBe(0);
    expect(mockHardDeleteUser).not.toHaveBeenCalled();
  });

  test('should handle errors gracefully and return 0 when getExpiredSoftDeletes fails', async () => {
    mockGetExpiredSoftDeletes.mockRejectedValue(new Error('Database connection failed'));

    const count = await cleanupExpiredAccounts();

    expect(count).toBe(0);
  });

  test('should continue processing when individual hardDeleteUser fails', async () => {
    const expiredUsers = [
      { id: 1, email: 'ok@example.com', deletedAt: new Date() },
      { id: 2, email: 'fail@example.com', deletedAt: new Date() },
      { id: 3, email: 'ok2@example.com', deletedAt: new Date() },
    ];

    mockGetExpiredSoftDeletes.mockResolvedValue(expiredUsers as any);
    mockHardDeleteUser
      .mockResolvedValueOnce({} as any)       // user 1 succeeds
      .mockRejectedValueOnce(new Error('FK constraint'))  // user 2 fails
      .mockResolvedValueOnce({} as any);       // user 3 succeeds

    const count = await cleanupExpiredAccounts();

    // Should still have attempted all three
    expect(mockHardDeleteUser).toHaveBeenCalledTimes(3);

    // Only 2 succeeded
    expect(count).toBe(2);
  });

  test('should log each successful deletion', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    const expiredUsers = [
      { id: 5, email: 'user@example.com', deletedAt: new Date() },
    ];

    mockGetExpiredSoftDeletes.mockResolvedValue(expiredUsers as any);
    mockHardDeleteUser.mockResolvedValue({} as any);

    await cleanupExpiredAccounts();

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hard-deleted expired account: user 5')
    );
  });

  test('should log errors for failed deletions', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    const expiredUsers = [
      { id: 99, email: 'fail@example.com', deletedAt: new Date() },
    ];

    mockGetExpiredSoftDeletes.mockResolvedValue(expiredUsers as any);
    mockHardDeleteUser.mockRejectedValue(new Error('DB error'));

    await cleanupExpiredAccounts();

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to hard-delete user 99'),
      expect.any(Error)
    );
  });
});
