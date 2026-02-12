/**
 * AI Explanation Component
 *
 * Displays personalized, AI-adapted explanation below expert content.
 * Labeled transparently with "Personalized by AI" badge.
 * Gracefully handles failures by rendering nothing (expert content always shown).
 */

'use client';

import { useEffect, useState } from 'react';

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
          // API error - fail silently
          setError(true);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.explanation) {
          setExplanation(data.explanation);
        } else {
          // AI unavailable or failed safety checks - fail silently
          setError(true);
        }
      } catch (err) {
        // Network error - fail silently
        console.error('[AIExplanation] Failed to fetch:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchExplanation();
  }, [props]);

  // Show nothing on error - expert content is always visible above
  if (error || (!loading && !explanation)) {
    return null;
  }

  // Loading state - subtle shimmer
  if (loading) {
    return (
      <div
        className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100"
        aria-label={`Loading personalized explanation for ${props.programName}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-white rounded border border-indigo-200">
            ✨ Personalized by AI
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-indigo-100 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-indigo-100 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-indigo-100 rounded animate-pulse w-4/6"></div>
        </div>
        <p className="text-xs text-indigo-600 mt-3">Personalizing explanation...</p>
      </div>
    );
  }

  // Success - show personalized explanation
  return (
    <section
      className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100"
      aria-label={`AI-personalized explanation for ${props.programName}`}
    >
      {/* Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 bg-white rounded border border-indigo-200">
          ✨ Personalized by AI
        </span>
      </div>

      {/* Personalized explanation text */}
      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
        {explanation}
      </div>

      {/* Footer note */}
      <p className="text-xs text-indigo-700 mt-3 pt-3 border-t border-indigo-200">
        This explanation is adapted to your family's situation. The expert
        information above is the official source.
      </p>
    </section>
  );
}
