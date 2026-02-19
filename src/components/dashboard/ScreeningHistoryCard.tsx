'use client';

import React from 'react';
import type { Screening } from '@/lib/db/schema';
import type { ScreeningResults } from '@/lib/results/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ScreeningHistoryCardProps {
  screening: Screening;
}

export function ScreeningHistoryCard({ screening }: ScreeningHistoryCardProps) {
  const t = useTranslations('dashboard.history');
  const results = screening.results as ScreeningResults | null;
  const completedDate = new Date(screening.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const likelyCount = results?.programs?.filter(
    (p) => p.confidence === 'likely'
  ).length ?? 0;

  const possibleCount = results?.programs?.filter(
    (p) => p.confidence === 'possible'
  ).length ?? 0;

  const state = results?.state ?? 'KY';
  const versionLabel = screening.version > 1 ? `Screening #${screening.version}` : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-card-padding">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{completedDate}</p>
            <div className="mt-1 flex items-center gap-2">
              {versionLabel && (
                <Badge variant="secondary">{versionLabel}</Badge>
              )}
              <Badge variant="outline">
                {state.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {t('programs', { count: likelyCount + possibleCount })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('likely', { count: likelyCount })}, {t('possible', { count: possibleCount })}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <a
            href={`/screening/results/${results?.sessionId ?? 'latest'}`}
            className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
          >
            {t('viewResults')}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
