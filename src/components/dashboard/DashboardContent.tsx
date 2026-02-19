'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardList, History } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProgramSummary {
  programId: string;
  name: string;
  confidence: 'likely' | 'possible';
}

interface DashboardContentProps {
  hasResults: boolean;
  likelyPrograms: ProgramSummary[];
  possiblePrograms: ProgramSummary[];
  screeningDate?: string;
}

export function DashboardContent({
  hasResults,
  likelyPrograms,
  possiblePrograms,
  screeningDate,
}: DashboardContentProps) {
  const t = useTranslations('dashboard.main');

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
        {t('title')}
      </h1>
      <p className="text-muted-foreground mb-8">{t('welcomeBack')}</p>

      {hasResults ? (
        <div>
          {/* Latest Screening Summary */}
          <Card className="mb-6">
            <CardContent className="p-card-padding">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  {t('mostRecent')}
                </h2>
                {screeningDate && (
                  <span className="text-sm text-muted-foreground">
                    {screeningDate}
                  </span>
                )}
              </div>

              {likelyPrograms.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {t('likelyQualify')}
                  </h3>
                  <div className="space-y-2">
                    {likelyPrograms.map((p) => (
                      <div
                        key={p.programId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                        <span className="text-foreground">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {possiblePrograms.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {t('mayQualify')}
                  </h3>
                  <div className="space-y-2">
                    {possiblePrograms.map((p) => (
                      <div
                        key={p.programId}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                        <span className="text-foreground">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {likelyPrograms.length === 0 && possiblePrograms.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  {t('noMatches')}
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
              {t('viewHistory')}
            </Link>
            <Link
              href="/screening"
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              {t('startNew')}
            </Link>
          </div>
        </div>
      ) : (
        <Card className="text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-3">
              {t('welcomeTitle')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('welcomeDescription')}
            </p>
            <Button size="lg" asChild>
              <Link href="/screening">
                {t('startFirst')}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
