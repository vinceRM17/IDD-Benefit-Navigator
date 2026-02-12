import { getCurrentUser } from '@/lib/auth/session';
import { getUserScreeningHistory } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { ScreeningHistoryCard } from '@/components/dashboard/ScreeningHistoryCard';
import Link from 'next/link';

export const metadata = {
  title: 'Screening History - IDD Benefits Navigator',
};

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const screenings = await getUserScreeningHistory(user.userId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Screening History
      </h1>

      {screenings.length > 0 ? (
        <div className="space-y-4">
          {screenings.map((screening) => (
            <ScreeningHistoryCard key={screening.id} screening={screening} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          <p className="text-gray-600 mb-4">
            No screenings yet. Start your first screening to see results here.
          </p>
          <Link
            href="/screening"
            className="inline-block bg-blue-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
          >
            Start Screening
          </Link>
        </div>
      )}
    </div>
  );
}
