'use client';

import React, { useState } from 'react';
import { EnrichedResult, BenefitInteraction } from '@/lib/results/types';

interface DownloadPDFButtonProps {
  results: EnrichedResult[];
  interactions: BenefitInteraction[];
}

/**
 * Button that triggers server-side PDF generation and download
 *
 * Follows download pattern from research: creates temporary anchor element,
 * triggers download, cleans up blob URL.
 *
 * Accessible: aria-label, disabled state, aria-busy, error announcements
 */
export function DownloadPDFButton({
  results,
  interactions,
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // POST to PDF generation endpoint
      const response = await fetch('/api/pdf/action-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          interactions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get blob from response
      const blob = await response.blob();

      // Create temporary anchor element and trigger download
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'benefit-action-plan.pdf';
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      setError('Unable to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isLoading}
        aria-label={isLoading ? 'Generating PDF...' : 'Download Your Action Plan as PDF'}
        aria-busy={isLoading}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating PDF...' : 'Download Your Action Plan (PDF)'}
      </button>

      {/* Error message with assertive announcement for screen readers */}
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
