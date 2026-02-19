import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db/queries';
import { SettingsContent } from '@/components/dashboard/SettingsContent';

export const metadata = {
  title: 'Account Settings - IDD Benefits Navigator',
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const dbUser = await getUserByEmail(user.email);

  return (
    <SettingsContent
      email={user.email}
      deletedAt={dbUser?.deletedAt?.toISOString() ?? null}
    />
  );
}
