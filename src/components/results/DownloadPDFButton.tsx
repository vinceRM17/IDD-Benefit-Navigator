'use client';

import React, { useState } from 'react';
import { EnrichedResult, BenefitInteraction } from '@/lib/results/types';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('results.pdf');

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
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

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'benefit-action-plan.pdf';
      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="warm"
        onClick={handleDownload}
        disabled={isLoading}
        aria-label={isLoading ? t('generating') : t('downloadLabel')}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-1.5" />
        )}
        {isLoading ? t('generating') : t('download')}
      </Button>

      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-2 text-sm text-destructive flex items-center gap-1.5"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
