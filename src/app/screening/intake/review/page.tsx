'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScreeningStore } from '@/lib/screening/store';
import { fullSchema } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import { formDataToHouseholdFacts, generateSessionId } from '@/lib/screening/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Sparkles, Pencil, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function ReviewPage() {
  const router = useRouter();
  const { formData, setResults, setEditing } = useScreeningStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('screening');
  const locale = useLocale();

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
        body: JSON.stringify({ ...householdFacts, locale }),
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
      setError(t('review.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-4');
  };

  const yesNo = (val: boolean | undefined) => val ? t('review.yes') : t('review.no');

  const workStatusLabels: Record<string, string> = {
    'employed': t('step4.employed'),
    'unemployed': t('step4.unemployed'),
    'unable-to-work': t('step4.unableToWork'),
    'student': t('step4.student'),
  };

  const diagnosisLabels: Record<string, string> = {
    'autism': t('step4.autism'),
    'cerebral-palsy': t('step4.cerebralPalsy'),
    'down-syndrome': t('step4.downSyndrome'),
    'epilepsy': t('step4.epilepsy'),
    'mental-health': t('step4.mentalHealth'),
    'other': t('step4.otherDiagnosis'),
  };

  const limitationLabels: Record<string, string> = {
    'daily-living': t('step4.dailyLiving'),
    'communication': t('step4.communication'),
    'mobility': t('step4.mobility'),
    'self-care': t('step4.selfCare'),
    'learning': t('step4.learning'),
    'social': t('step4.social'),
  };

  return (
    <QuestionCard
      title={t('review.title')}
      description={t('review.description')}
    >
      <div className="space-y-6">
        {/* Family Situation Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-heading font-semibold text-foreground">
              {t('review.familySituation')}
            </h3>
            <button
              type="button"
              onClick={() => { setEditing(true); router.push('/screening/intake/step-1'); }}
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              {t('review.edit')}
            </button>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.state')}</dt>
              <dd className="text-foreground font-medium">
                {formData.state || t('review.notProvided')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.householdSize')}</dt>
              <dd className="text-foreground font-medium">
                {formData.householdSize || t('review.notProvided')}
              </dd>
            </div>
          </dl>
        </div>

        <Separator />

        {/* Income & Benefits Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-heading font-semibold text-foreground">
              {t('review.incomeAndBenefits')}
            </h3>
            <button
              type="button"
              onClick={() => { setEditing(true); router.push('/screening/intake/step-2'); }}
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              {t('review.edit')}
            </button>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.monthlyIncome')}</dt>
              <dd className="text-foreground font-medium">
                ${formData.monthlyIncome || t('review.notProvided')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.receivesSSI')}</dt>
              <dd className="text-foreground font-medium">
                {yesNo(formData.receivesSSI)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.receivesSNAP')}</dt>
              <dd className="text-foreground font-medium">
                {yesNo(formData.receivesSNAP)}
              </dd>
            </div>
          </dl>
        </div>

        <Separator />

        {/* Diagnosis & Insurance Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-heading font-semibold text-foreground">
              {t('review.diagnosisAndInsurance')}
            </h3>
            <button
              type="button"
              onClick={() => { setEditing(true); router.push('/screening/intake/step-3'); }}
              className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              {t('review.edit')}
            </button>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.hasDisability')}</dt>
              <dd className="text-foreground font-medium">
                {yesNo(formData.hasDisabilityDiagnosis)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.age')}</dt>
              <dd className="text-foreground font-medium">
                {formData.age || t('review.notProvided')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t('review.hasInsurance')}</dt>
              <dd className="text-foreground font-medium">
                {yesNo(formData.hasInsurance)}
              </dd>
            </div>
            {formData.hasInsurance && formData.insuranceType && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('review.insuranceType')}</dt>
                <dd className="text-foreground font-medium">
                  {formData.insuranceType === 'employer'
                    ? t('review.employerProvided')
                    : formData.insuranceType === 'marketplace'
                    ? t('review.marketplaceACA')
                    : t('review.other')}
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
                  {t('review.functionalNeeds')}
                </h3>
                <button
                  type="button"
                  onClick={() => { setEditing(true); router.push('/screening/intake/step-4'); }}
                  className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" />
                  {t('review.edit')}
                </button>
              </div>
              <dl className="space-y-2 text-sm">
                {formData.workStatus && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('review.workStatus')}</dt>
                    <dd className="text-foreground font-medium">
                      {workStatusLabels[formData.workStatus] || formData.workStatus}
                    </dd>
                  </div>
                )}
                {formData.hasGuardian !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('review.hasGuardian')}</dt>
                    <dd className="text-foreground font-medium">
                      {yesNo(formData.hasGuardian)}
                    </dd>
                  </div>
                )}
                {formData.coOccurringDiagnoses && formData.coOccurringDiagnoses.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('review.coOccurring')}</dt>
                    <dd className="text-foreground font-medium">
                      {formData.coOccurringDiagnoses.map(d => diagnosisLabels[d] || d).join(', ')}
                    </dd>
                  </div>
                )}
                {formData.functionalLimitations && formData.functionalLimitations.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('review.areasNeedingHelp')}</dt>
                    <dd className="text-foreground font-medium">
                      {formData.functionalLimitations.map(l => limitationLabels[l] || l).join(', ')}
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
              {t('review.findingBenefits')}
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
                {t('common.tryAgain')}
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
                {t('common.startOver')}
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
                {t('review.fixIssues')}
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
            {t('common.previous')}
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
                {t('review.loadingButton')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-1" />
                {t('common.getMyResults')}
              </>
            )}
          </Button>
        </div>
      </div>
    </QuestionCard>
  );
}
