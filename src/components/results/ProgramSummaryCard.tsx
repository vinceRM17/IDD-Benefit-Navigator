/**
 * ProgramSummaryCard Component
 * Compact card for the Overview tab showing program name, confidence badge, and one-line description
 */

'use client';

import { EnrichedResult } from '@/lib/results/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProgramSummaryCardProps {
  result: EnrichedResult;
  onViewDetails: () => void;
}

export function ProgramSummaryCard({ result, onViewDetails }: ProgramSummaryCardProps) {
  const { content, confidence, programId } = result;
  const t = useTranslations('results');
  const pt = useTranslations('programs');

  // Get translated name and description
  let translatedName = content.name;
  let translatedDescription = content.description;
  try {
    const nameVal = pt.raw(`${programId}.name`);
    if (typeof nameVal === 'string' && !nameVal.startsWith('programs.')) translatedName = nameVal;
    const descVal = pt.raw(`${programId}.description`);
    if (typeof descVal === 'string' && !descVal.startsWith('programs.')) translatedDescription = descVal;
  } catch { /* use defaults */ }

  const badgeVariant = confidence === 'likely' ? 'success' as const : 'warm' as const;
  const badgeText = confidence === 'likely' ? t('badges.likelyEligible') : t('badges.mayBeEligible');

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-base font-heading font-semibold text-foreground truncate">
            {translatedName}
          </h3>
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">{translatedDescription}</p>
      </div>
      <button
        onClick={onViewDetails}
        className="text-sm font-medium text-primary hover:text-primary/80 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded inline-flex items-center gap-1 self-end sm:self-auto"
      >
        {t('summary.viewDetails')}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
