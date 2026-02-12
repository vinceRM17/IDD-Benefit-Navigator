import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db/queries';
import { AccountDeletion } from '@/components/dashboard/AccountDeletion';
import { ReminderPreferences } from '@/components/dashboard/ReminderPreferences';

export const metadata = {
  title: 'Account Settings - IDD Benefits Navigator',
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const dbUser = await getUserByEmail(user.email);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Account Settings
      </h1>

      {/* Email Display */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Email</h2>
        <p className="text-gray-700">{user.email}</p>
      </div>

      {/* Recertification Reminders */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Recertification Reminders
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Get email reminders before your benefits need to be renewed. We'll
          estimate dates based on typical program cycles, or you can enter your
          actual dates.
        </p>
        <ReminderPreferences />
      </div>

      {/* Account Deletion */}
      <AccountDeletion
        deletedAt={dbUser?.deletedAt?.toISOString() ?? null}
      />
    </div>
  );
}
