'use client';

import React, { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { simpleCompareEligibility } from '@/lib/screening/what-if';
import type { EnrichedResult } from '@/lib/results/types';
import { useTranslations } from 'next-intl';

interface WhatIfPanelProps {
  programs: EnrichedResult[];
  currentIncome: number;
}

export function WhatIfPanel({ programs, currentIncome }: WhatIfPanelProps) {
  const [scenarioIncome, setScenarioIncome] = useState(currentIncome);
  const t = useTranslations('results.whatIf');

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US')}`;

  const diff = useMemo(
    () => simpleCompareEligibility(programs, currentIncome, scenarioIncome),
    [programs, currentIncome, scenarioIncome]
  );

  const hasChanges = diff.gained.length > 0 || diff.lost.length > 0;
  const isAtBaseline = scenarioIncome === currentIncome;

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {t('title')}
        </h2>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </header>

      {/* Income slider */}
      <Card className="mb-6">
        <CardContent className="p-card-padding">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-foreground">
              {t('incomeLabel')}
            </label>
            <span className="text-lg font-heading font-bold text-primary">
              {formatCurrency(scenarioIncome)}
            </span>
          </div>

          <Slider
            value={scenarioIncome}
            min={0}
            max={10000}
            step={50}
            label={t('incomeLabel')}
            formatValue={(v) => `$${v.toLocaleString()}`}
            onChange={setScenarioIncome}
            className="mb-3"
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>
              {t('currentIncome')}:{' '}
              <strong className="text-foreground">
                {formatCurrency(currentIncome)}
              </strong>
            </span>
            <span>$10,000</span>
          </div>

          {!isAtBaseline && (
            <div className="mt-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScenarioIncome(currentIncome)}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                {t('resetToActualIncome')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results diff */}
      <div aria-live="polite" aria-atomic="true">
        {isAtBaseline ? (
          <Card>
            <CardContent className="p-card-padding text-center text-muted-foreground">
              <p>{t('moveSlider')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {diff.gained.length > 0 && (
              <Card className="border-l-4 border-l-emerald-500">
                <CardContent className="p-card-padding">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-heading font-semibold text-foreground">
                      {t('gained')}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {diff.gained.map((name) => (
                      <Badge key={name} variant="success">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {diff.lost.length > 0 && (
              <Card className="border-l-4 border-l-red-400">
                <CardContent className="p-card-padding">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <h3 className="font-heading font-semibold text-foreground">
                      {t('lost')}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {diff.lost.map((name) => (
                      <Badge key={name} variant="destructive">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {diff.unchanged.length > 0 && (
              <Card>
                <CardContent className="p-card-padding">
                  <div className="flex items-center gap-2 mb-3">
                    <Minus className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-heading font-semibold text-foreground">
                      {t('unchanged')}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {diff.unchanged.map((name) => (
                      <Badge key={name} variant="secondary">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!hasChanges && (
              <Card>
                <CardContent className="p-card-padding text-center text-muted-foreground">
                  <p>{t('noChange')}</p>
                </CardContent>
              </Card>
            )}

            <p className="text-sm text-muted-foreground text-center">
              {t('disclaimer')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
