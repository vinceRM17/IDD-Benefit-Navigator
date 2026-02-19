/**
 * ProgramSummaryCard Component
 * Compact card for the Overview tab showing program name, confidence badge, and one-line description
 */

'use client';

import { EnrichedResult } from '@/lib/results/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ProgramSummaryCardProps {
  result: EnrichedResult;
  onViewDetails: () => void;
}

export function ProgramSummaryCard({ result, onViewDetails }: ProgramSummaryCardProps) {
  const { content, confidence } = result;

  const badgeVariant = confidence === 'likely' ? 'success' as const : 'warm' as const;
  const badgeText = confidence === 'likely' ? 'Likely Eligible' : 'May Be Eligible';

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-4 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-base font-heading font-semibold text-foreground truncate">
            {content.name}
          </h3>
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{content.description}</p>
      </div>
      <button
        onClick={onViewDetails}
        className="text-sm font-medium text-primary hover:text-primary/80 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded inline-flex items-center gap-1"
      >
        View details
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
