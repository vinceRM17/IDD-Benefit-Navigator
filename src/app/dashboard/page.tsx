import { getCurrentUser } from '@/lib/auth/session';
import { getLatestScreening } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { ScreeningResults } from '@/lib/results/types';

export const metadata = {
  title: 'Your Benefits Dashboard - IDD Benefits Navigator',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const latestScreening = await getLatestScreening(user.userId);
  const results = latestScreening?.results as ScreeningResults | null;

  const likelyPrograms = results?.programs?.filter((p) => p.confidence === 'likely') ?? [];
  const possiblePrograms = results?.programs?.filter((p) => p.confidence === 'possible') ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Your Benefits Dashboard
      </h1>
      <p className="text-gray-600 mb-8">Welcome back</p>

      {latestScreening && results ? (
        <div>
          {/* Latest Screening Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Most Recent Screening
              </h2>
              <span className="text-sm text-gray-500">
                {new Date(latestScreening.completedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Likely Programs */}
            {likelyPrograms.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Programs You Likely Qualify For
                </h3>
                <div className="space-y-2">
                  {likelyPrograms.map((p) => (
                    <div
                      key={p.programId}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-900">{p.content.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Possible Programs */}
            {possiblePrograms.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Programs You May Qualify For
                </h3>
                <div className="space-y-2">
                  {possiblePrograms.map((p) => (
                    <div
                      key={p.programId}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-900">{p.content.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {likelyPrograms.length === 0 && possiblePrograms.length === 0 && (
              <p className="text-gray-600 text-sm">
                No programs matched in your last screening. Your situation may change — try screening again anytime.
              </p>
            )}
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/history"
              className="text-blue-700 hover:underline text-sm font-medium"
            >
              View Full History
            </Link>
            <Link
              href="/screening"
              className="text-blue-700 hover:underline text-sm font-medium"
            >
              Start New Screening
            </Link>
          </div>
        </div>
      ) : (
        /* No screenings yet */
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Welcome to Benefits Navigator
          </h2>
          <p className="text-gray-600 mb-6">
            Answer a few simple questions about your family to find out which
            benefits you may qualify for. It only takes a few minutes.
          </p>
          <Link
            href="/screening"
            className="inline-block bg-blue-700 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
          >
            Start Your First Screening
          </Link>
        </div>
      )}
    </div>
  );
}
