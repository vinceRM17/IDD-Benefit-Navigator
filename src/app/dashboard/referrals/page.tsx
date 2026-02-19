import { getCurrentUser } from '@/lib/auth/session';
import { getUserReferrals } from '@/lib/db/queries';
import { partnerOrganizations } from '@/content/resources/partners';
import { ReferralsContent } from '@/components/dashboard/ReferralsContent';

export default async function ReferralsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const referrals = await getUserReferrals(user.userId);

  const referralData = referrals.map((referral) => {
    const partner = partnerOrganizations.find(
      (org) => org.id === referral.partnerOrgId
    );

    return {
      id: referral.id,
      partnerName: partner?.name ?? 'Unknown Partner',
      sentAt: referral.sentAt.toISOString(),
      viewedAt: referral.viewedAt?.toISOString() ?? null,
      status: referral.status,
    };
  });

  return <ReferralsContent referrals={referralData} />;
}
