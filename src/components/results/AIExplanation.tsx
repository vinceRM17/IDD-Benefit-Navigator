/**
 * AI Explanation Component
 *
 * Displays personalized, AI-adapted explanation below expert content.
 * Labeled transparently with "Personalized by AI" badge.
 * Gracefully handles failures by rendering nothing (expert content always shown).
 */

'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export interface AIExplanationProps {
  programName: string;
  expertDescription: string;
  expertNextSteps: string[];
  whatItCovers: string[];
  familyContext: {
    householdSize: number;
    monthlyIncome: number;
    hasDisabilityDiagnosis: boolean;
    age: number;
    hasInsurance: boolean;
    insuranceType?: string;
    receivesSSI?: boolean;
    receivesSNAP?: boolean;
    state: string;
  };
}

export function AIExplanation(props: AIExplanationProps) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchExplanation() {
      try {
        const response = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(props),
        });

        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.explanation) {
          setExplanation(data.explanation);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('[AIExplanation] Failed to fetch:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchExplanation();
  }, [props]);

  if (error || (!loading && !explanation)) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div
        className="mt-4 p-4 bg-secondary rounded-lg border border-border"
        aria-label={`Loading personalized explanation for ${props.programName}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Personalized by AI
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Personalizing explanation...</p>
      </div>
    );
  }

  // Success
  return (
    <section
      className="mt-4 p-4 bg-secondary rounded-lg border border-border"
      aria-label={`AI-personalized explanation for ${props.programName}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Personalized by AI
        </Badge>
      </div>

      <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {explanation}
      </div>

      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
        This explanation is adapted to your family&apos;s situation. The expert
        information above is the official source.
      </p>
    </section>
  );
}
