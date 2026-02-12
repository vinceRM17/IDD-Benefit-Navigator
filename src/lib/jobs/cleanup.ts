import { getExpiredSoftDeletes, hardDeleteUser } from '@/lib/db/queries';

/**
 * Hard-delete accounts whose 14-day soft delete grace period has expired
 * Per user decision: "14-day soft delete grace period, then hard delete"
 */
export async function cleanupExpiredAccounts(): Promise<number> {
  try {
    const expiredUsers = await getExpiredSoftDeletes();
    let deletedCount = 0;

    for (const user of expiredUsers) {
      try {
        await hardDeleteUser(user.id);
        console.log(`Hard-deleted expired account: user ${user.id}`);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to hard-delete user ${user.id}:`, error);
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('Error in cleanupExpiredAccounts:', error);
    return 0;
  }
}
