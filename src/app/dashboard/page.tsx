import { getCurrentUser } from '@/lib/auth/session';
import { getLatestScreening } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { ScreeningResults } from '@/lib/results/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ClipboardList, History } from 'lucide-react';

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
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
        Your Benefits Dashboard
      </h1>
      <p className="text-muted-foreground mb-8">Welcome back</p>

      {latestScreening && results ? (
        <div>
          {/* Latest Screening Summary */}
          <Card className="mb-6">
            <CardContent className="p-card-padding">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  Most Recent Screening
                </h2>
                <span className="text-sm text-muted-foreground">
                  {new Date(latestScreening.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {likelyPrograms.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Programs You Likely Qualify For
                  </h3>
                  <div className="space-y-2">
                    {likelyPrograms.map((p) => (
                      <div
                        key={p.programId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                        <span className="text-foreground">{p.content.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {possiblePrograms.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Programs You May Qualify For
                  </h3>
                  <div className="space-y-2">
                    {possiblePrograms.map((p) => (
                      <div
                        key={p.programId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                        <span className="text-foreground">{p.content.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {likelyPrograms.length === 0 && possiblePrograms.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No programs matched in your last screening. Your situation may change — try screening again anytime.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Links */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/history"
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <History className="h-3.5 w-3.5" />
              View Full History
            </Link>
            <Link
              href="/screening"
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Start New Screening
            </Link>
          </div>
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-3">
              Welcome to Benefits Navigator
            </h2>
            <p className="text-muted-foreground mb-6">
              Answer a few simple questions about your family to find out which
              benefits you may qualify for. It only takes a few minutes.
            </p>
            <Button size="lg" asChild>
              <Link href="/screening">
                Start Your First Screening
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
