'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useScreeningStore } from '@/lib/screening/store';
import { step1Schema, type Step1Data } from '@/lib/screening/schema';
import { US_STATES } from '@/lib/data/states';
import { QuestionCard } from '@/components/screening/QuestionCard';
import { AccessibleInput, AccessibleSelect } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Build state options grouped by coverage level
const fullCoverageStates = US_STATES.filter(s => s.coverageLevel === 'full');
const federalOnlyStates = US_STATES.filter(s => s.coverageLevel === 'federal-only');

export default function Step1Page() {
  const router = useRouter();
  const formData = useScreeningStore((s) => s.formData);
  const setStepData = useScreeningStore((s) => s.setStepData);
  const t = useTranslations('screening');

  const stateOptions = [
    ...fullCoverageStates.map(s => ({
      value: s.code,
      label: `${s.name} — ${t('step1.stateFullCoverage')}`,
    })),
    ...federalOnlyStates.map(s => ({
      value: s.code,
      label: s.name,
    })),
  ];

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      state: formData.state || undefined,
      householdSize: formData.householdSize || undefined,
    },
  });

  const stateValue = watch('state');
  const householdSizeValue = watch('householdSize');

  const onSubmit = (data: Step1Data) => {
    setStepData(data);
    router.push('/screening/intake/step-2');
  };

  return (
    <QuestionCard
      title={t('step1.title')}
      description={t('step1.description')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AccessibleSelect
          id="state"
          label={t('step1.stateLabel')}
          options={stateOptions}
          required
          value={stateValue || ''}
          onChange={(value) => {
            setValue('state', value as Step1Data['state'], { shouldValidate: true });
          }}
          error={errors.state?.message}
          placeholder={t('step1.statePlaceholder')}
        />

        <AccessibleInput
          id="householdSize"
          label={t('step1.householdSizeLabel')}
          type="number"
          required
          helpText={t('step1.householdSizeHelp')}
          value={householdSizeValue?.toString() || ''}
          onChange={(value) => {
            setValue('householdSize', value === '' ? undefined as any : Number(value), { shouldValidate: true });
          }}
          error={errors.householdSize?.message}
          placeholder={t('step1.householdSizePlaceholder')}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {t('common.next')}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </form>
    </QuestionCard>
  );
}
