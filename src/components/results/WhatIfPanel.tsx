'use client';

import React, { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { simpleCompareEligibility } from '@/lib/screening/what-if';
import type { EnrichedResult } from '@/lib/results/types';

interface WhatIfPanelProps {
  programs: EnrichedResult[];
  currentIncome: number;
}

export function WhatIfPanel({ programs, currentIncome }: WhatIfPanelProps) {
  const [scenarioIncome, setScenarioIncome] = useState(currentIncome);

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
          What If My Income Changes?
        </h2>
        <p className="text-muted-foreground">
          Use the slider to explore how changes in your household income might
          affect which programs you qualify for.
        </p>
      </header>

      {/* Income slider */}
      <Card className="mb-6">
        <CardContent className="p-card-padding">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-foreground">
              Monthly household income
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
            label="Monthly household income"
            formatValue={(v) => `$${v.toLocaleString()} per month`}
            onChange={setScenarioIncome}
            className="mb-3"
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>
              Your current income:{' '}
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
                Reset to actual income
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
              <p>
                Move the slider to see how income changes could affect your
                eligibility.
              </p>
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
                      Programs You Might Gain
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
                      Programs You Might Lose
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
                      Programs Not Affected by Income
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
                  <p>
                    At this income level, your program eligibility would likely
                    stay the same.
                  </p>
                </CardContent>
              </Card>
            )}

            <p className="text-sm text-muted-foreground text-center">
              This is an estimate only. Actual eligibility depends on many
              factors beyond income. Contact each program for specific details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
