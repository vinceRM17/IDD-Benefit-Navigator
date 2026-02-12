/**
 * ProgramSummaryCard Component
 * Compact card for the Overview tab showing program name, confidence badge, and one-line description
 */

'use client';

import { EnrichedResult } from '@/lib/results/types';

interface ProgramSummaryCardProps {
  result: EnrichedResult;
  onViewDetails: () => void;
}

export function ProgramSummaryCard({ result, onViewDetails }: ProgramSummaryCardProps) {
  const { content, confidence } = result;

  const badgeClass =
    confidence === 'likely'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-yellow-100 text-yellow-800 border-yellow-300';

  const badgeText = confidence === 'likely' ? 'Likely Eligible' : 'May Be Eligible';

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {content.name}
          </h3>
          <span
            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${badgeClass} whitespace-nowrap`}
          >
            {badgeText}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{content.description}</p>
      </div>
      <button
        onClick={onViewDetails}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
      >
        View details
      </button>
    </div>
  );
}
