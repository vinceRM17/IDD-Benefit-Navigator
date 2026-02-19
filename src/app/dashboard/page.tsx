import { getCurrentUser } from '@/lib/auth/session';
import { getLatestScreening } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import type { ScreeningResults } from '@/lib/results/types';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata = {
  title: 'Your Benefits Dashboard - IDD Benefits Navigator',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const latestScreening = await getLatestScreening(user.userId);
  const results = latestScreening?.results as ScreeningResults | null;

  const likelyPrograms = results?.programs
    ?.filter((p) => p.confidence === 'likely')
    .map((p) => ({ programId: p.programId, name: p.content.name, confidence: 'likely' as const })) ?? [];

  const possiblePrograms = results?.programs
    ?.filter((p) => p.confidence === 'possible')
    .map((p) => ({ programId: p.programId, name: p.content.name, confidence: 'possible' as const })) ?? [];

  const screeningDate = latestScreening
    ? new Date(latestScreening.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  return (
    <DashboardContent
      hasResults={!!(latestScreening && results)}
      likelyPrograms={likelyPrograms}
      possiblePrograms={possiblePrograms}
      screeningDate={screeningDate}
    />
  );
}
