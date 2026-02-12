'use client';

import React from 'react';
import type { Screening } from '@/lib/db/schema';
import type { ScreeningResults } from '@/lib/results/types';

interface ScreeningHistoryCardProps {
  screening: Screening;
}

export function ScreeningHistoryCard({ screening }: ScreeningHistoryCardProps) {
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{completedDate}</p>
          <div className="mt-1 flex items-center gap-2">
            {versionLabel && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {versionLabel}
              </span>
            )}
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              {state.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {likelyCount + possibleCount} programs
          </p>
          <p className="text-xs text-gray-500">
            {likelyCount} likely, {possibleCount} possible
          </p>
        </div>
      </div>

      <div className="mt-4">
        <a
          href={`/screening/results/${results?.sessionId ?? 'latest'}`}
          className="text-blue-700 hover:underline text-sm font-medium"
        >
          View Results
        </a>
      </div>
    </div>
  );
}
