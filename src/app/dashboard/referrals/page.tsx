import { getCurrentUser } from '@/lib/auth/session';
import { getUserReferrals } from '@/lib/db/queries';
import { partnerOrganizations } from '@/content/resources/partners';
import Link from 'next/link';

export default async function ReferralsPage() {
  const user = await getCurrentUser();

  // Auth is enforced by dashboard layout, but defensive check
  if (!user) {
    return null;
  }

  const referrals = await getUserReferrals(user.userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Referrals</h1>
        <Link
          href="/referral"
          className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Referral
        </Link>
      </div>

      {referrals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">
            You haven't submitted any referrals yet.
          </p>
          <Link
            href="/referral"
            className="inline-block bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-blue-800"
          >
            Submit Your First Referral
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => {
            // Look up partner organization name
            const partner = partnerOrganizations.find(
              (org) => org.id === referral.partnerOrgId
            );
            const partnerName = partner?.name ?? 'Unknown Partner';

            // Format dates
            const sentDate = new Date(referral.sentAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            const viewedDate = referral.viewedAt
              ? new Date(referral.viewedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null;

            return (
              <div
                key={referral.id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {partnerName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Sent on {sentDate}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {referral.status === 'viewed' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Viewed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        Sent
                      </span>
                    )}
                  </div>
                </div>

                {viewedDate && (
                  <p className="text-sm text-gray-600">
                    Opened on {viewedDate}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Questions about your referrals?{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
