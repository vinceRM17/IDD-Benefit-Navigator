'use client';

import React from 'react';
import Link from 'next/link';
import type { Screening } from '@/lib/db/schema';
import { ScreeningHistoryCard } from '@/components/dashboard/ScreeningHistoryCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HistoryContentProps {
  screenings: Screening[];
}

export function HistoryContent({ screenings }: HistoryContentProps) {
  const t = useTranslations('dashboard.history');

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
        {t('title')}
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
              {t('noScreenings')}
            </p>
            <Button asChild>
              <Link href="/screening">
                {t('startScreening')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
