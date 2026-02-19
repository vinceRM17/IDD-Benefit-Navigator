import { getCurrentUser } from '@/lib/auth/session';
import { getUserScreeningHistory } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { ScreeningHistoryCard } from '@/components/dashboard/ScreeningHistoryCard';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Screening History - IDD Benefits Navigator',
};

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const screenings = await getUserScreeningHistory(user.userId);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
        Screening History
      </h1>

      {screenings.length > 0 ? (
        <div className="space-y-4">
          {screenings.map((screening) => (
            <ScreeningHistoryCard key={screening.id} screening={screening} />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="p-8">
            <p className="text-muted-foreground mb-4">
              No screenings yet. Start your first screening to see results here.
            </p>
            <Button asChild>
              <Link href="/screening">
                Start Screening
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
