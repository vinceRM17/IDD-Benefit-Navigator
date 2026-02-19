'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScreeningStore } from '@/lib/screening/store';
import { fullSchema } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import { formDataToHouseholdFacts, generateSessionId } from '@/lib/screening/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Sparkles, Pencil, AlertCircle, Loader2 } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const { formData, setResults } = useScreeningStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetResults = async () => {
    setValidationErrors([]);
    setError(null);

    const result = fullSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.errors.map((err) => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      });
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      const householdFacts = formDataToHouseholdFacts(result.data);

      const response = await fetch('/api/screening/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(householdFacts),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate eligibility');
      }

      const screeningResults = await response.json();
      setResults(screeningResults);

      fetch('/api/screenings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screeningData: formData,
          results: screeningResults,
        }),
      }).catch(() => {});

      const sessionId = generateSessionId();
      router.push(`/screening/results/${sessionId}`);
    } catch (err) {
      console.error('Error evaluating screening:', err);
      setError(
        'Something went wrong while finding benefits for your family. Please try again or contact us for help.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-4');
  };

  return (
    <QuestionCard
      title="Review your answers"
      description="Please check that everything looks correct before we generate your results."
    >
      <div className="space-y-6">
        {/* Family Situation Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-heading font-semibold text-foreground">
              Family Situation
            </h3>
            <Link
              href="/screening/intake/step-1"
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">State:</dt>
              <dd className="text-foreground font-medium">
                {formData.state || 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Household size:</dt>
              <dd className="text-foreground font-medium">
                {formData.householdSize || 'Not provided'}
              </dd>
            </div>
          </dl>
        </div>

        <Separator />

        {/* Income & Benefits Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-heading font-semibold text-foreground">
              Income & Benefits
            </h3>
            <Link
              href="/screening/intake/step-2"
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Monthly income:</dt>
              <dd className="text-foreground font-medium">
                ${formData.monthlyIncome || 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Receives SSI:</dt>
              <dd className="text-foreground font-medium">
                {formData.receivesSSI ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Receives SNAP:</dt>
              <dd className="text-foreground font-medium">
                {formData.receivesSNAP ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </div>

        <Separator />

        {/* Diagnosis & Insurance Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-heading font-semibold text-foreground">
              Diagnosis & Insurance
            </h3>
            <Link
              href="/screening/intake/step-3"
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Has disability diagnosis:</dt>
              <dd className="text-foreground font-medium">
                {formData.hasDisabilityDiagnosis ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Age:</dt>
              <dd className="text-foreground font-medium">
                {formData.age || 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Has private insurance:</dt>
              <dd className="text-foreground font-medium">
                {formData.hasInsurance ? 'Yes' : 'No'}
              </dd>
            </div>
            {formData.hasInsurance && formData.insuranceType && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Insurance type:</dt>
                <dd className="text-foreground font-medium">
                  {formData.insuranceType === 'employer'
                    ? 'Employer-provided'
                    : formData.insuranceType === 'marketplace'
                    ? 'Marketplace/ACA'
                    : 'Other'}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Functional Needs Section (optional) */}
        {(formData.workStatus || formData.hasGuardian !== undefined || (formData.coOccurringDiagnoses && formData.coOccurringDiagnoses.length > 0) || (formData.functionalLimitations && formData.functionalLimitations.length > 0)) && (
          <>
            <Separator />
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-heading font-semibold text-foreground">
                  Functional Needs
                </h3>
                <Link
                  href="/screening/intake/step-4"
                  className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
              </div>
              <dl className="space-y-2 text-sm">
                {formData.workStatus && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Work status:</dt>
                    <dd className="text-foreground font-medium capitalize">
                      {formData.workStatus.replace(/-/g, ' ')}
                    </dd>
                  </div>
                )}
                {formData.hasGuardian !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Has legal guardian:</dt>
                    <dd className="text-foreground font-medium">
                      {formData.hasGuardian ? 'Yes' : 'No'}
                    </dd>
                  </div>
                )}
                {formData.coOccurringDiagnoses && formData.coOccurringDiagnoses.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Co-occurring conditions:</dt>
                    <dd className="text-foreground font-medium capitalize">
                      {formData.coOccurringDiagnoses.map(d => d.replace(/-/g, ' ')).join(', ')}
                    </dd>
                  </div>
                )}
                {formData.functionalLimitations && formData.functionalLimitations.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Areas needing help:</dt>
                    <dd className="text-foreground font-medium capitalize">
                      {formData.functionalLimitations.map(l => l.replace(/-/g, ' ')).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </>
        )}

        {/* Loading state */}
        {isLoading && (
          <div
            className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <p className="text-foreground font-medium">
              Finding benefits for your family...
            </p>
          </div>
        )}

        {/* API Error */}
        {error && (
          <div
            className="bg-destructive/5 border border-destructive/20 rounded-lg p-4"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-foreground">{error}</p>
            </div>
            <div className="flex gap-3 ml-8">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleGetResults}
              >
                Try Again
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  useScreeningStore.getState().reset();
                  router.push('/screening');
                }}
              >
                Start Over
              </Button>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <h4 className="text-foreground font-semibold">
                Please fix these issues:
              </h4>
            </div>
            <ul className="list-disc list-inside space-y-1 text-destructive text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-2">
          <Button type="button" variant="secondary" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            type="button"
            variant="warm"
            onClick={handleGetResults}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Finding benefits...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                Get My Results
              </>
            )}
          </Button>
        </div>
      </div>
    </QuestionCard>
  );
}
