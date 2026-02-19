'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { WaitlistSignup } from './WaitlistSignup';

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
  if (coverageLevel === 'full') return null;

  return (
    <Card className="border-amber-200 bg-amber-50 mb-6">
      <CardContent className="p-card-padding">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-heading font-semibold text-amber-900">
                Federal Programs Only for {stateName}
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                We currently show federal programs (SSI, SSDI, SNAP) for {stateName}.
                State-specific programs like Medicaid waivers are not yet available.
                Sign up below to be notified when we add full {stateName} coverage.
              </p>
            </div>
            <WaitlistSignup stateCode={stateCode} stateName={stateName} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
