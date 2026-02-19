'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { WaitlistSignup } from './WaitlistSignup';
import { useTranslations } from 'next-intl';

interface StateCoverageBannerProps {
  stateCode: string;
  stateName: string;
  coverageLevel: 'full' | 'federal-only';
}

export function StateCoverageBanner({
  stateCode,
  stateName,
  coverageLevel,
}: StateCoverageBannerProps) {
  const t = useTranslations('results.coverage');

  if (coverageLevel === 'full') return null;

  return (
    <Card className="border-amber-200 bg-amber-50 mb-6">
      <CardContent className="p-card-padding">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-heading font-semibold text-amber-900">
                {t('title', { stateName })}
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                {t('description', { stateName })}
              </p>
            </div>
            <WaitlistSignup stateCode={stateCode} stateName={stateName} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
