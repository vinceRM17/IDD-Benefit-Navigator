import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/db/queries';
import { AccountDeletion } from '@/components/dashboard/AccountDeletion';
import { ReminderPreferences } from '@/components/dashboard/ReminderPreferences';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export const metadata = {
  title: 'Account Settings - IDD Benefits Navigator',
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const dbUser = await getUserByEmail(user.email);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
        Account Settings
      </h1>

      {/* Email Display */}
      <Card className="mb-6">
        <CardContent className="p-card-padding">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email
          </h2>
          <p className="text-foreground/80">{user.email}</p>
        </CardContent>
      </Card>

      {/* Recertification Reminders */}
      <Card className="mb-6">
        <CardContent className="p-card-padding">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
            Recertification Reminders
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Get email reminders before your benefits need to be renewed. We&apos;ll
            estimate dates based on typical program cycles, or you can enter your
            actual dates.
          </p>
          <ReminderPreferences />
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <AccountDeletion
        deletedAt={dbUser?.deletedAt?.toISOString() ?? null}
      />
    </div>
  );
}
