import { getCurrentUser } from '@/lib/auth/session';
import { getUserScreeningHistory } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { HistoryContent } from '@/components/dashboard/HistoryContent';

export const metadata = {
  title: 'Screening History - IDD Benefits Navigator',
};

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const screenings = await getUserScreeningHistory(user.userId);

  return <HistoryContent screenings={screenings} />;
}
