import { getCurrentUser } from '@/lib/auth/session';
import { getUserReferrals } from '@/lib/db/queries';
import { partnerOrganizations } from '@/content/resources/partners';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Plus, ArrowRight } from 'lucide-react';

export default async function ReferralsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const referrals = await getUserReferrals(user.userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">My Referrals</h1>
        <Button size="sm" asChild>
          <Link href="/referral">
            <Plus className="h-4 w-4 mr-1" />
            New Referral
          </Link>
        </Button>
      </div>

      {referrals.length === 0 ? (
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t submitted any referrals yet.
            </p>
            <Button asChild>
              <Link href="/referral">
                Submit Your First Referral
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => {
            const partner = partnerOrganizations.find(
              (org) => org.id === referral.partnerOrgId
            );
            const partnerName = partner?.name ?? 'Unknown Partner';

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
              <Card key={referral.id}>
                <CardContent className="p-card-padding">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-lg font-heading font-semibold text-foreground">
                        {partnerName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Sent on {sentDate}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {referral.status === 'viewed' ? (
                        <Badge variant="success">Viewed</Badge>
                      ) : (
                        <Badge variant="warm">Sent</Badge>
                      )}
                    </div>
                  </div>

                  {viewedDate && (
                    <p className="text-sm text-muted-foreground">
                      Opened on {viewedDate}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Separator className="mt-8" />
      <p className="text-sm text-muted-foreground">
        Questions about your referrals?{' '}
        <Link href="/contact" className="text-primary hover:text-primary/80">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
