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

// Build state options grouped by coverage level
const fullCoverageStates = US_STATES.filter(s => s.coverageLevel === 'full');
const federalOnlyStates = US_STATES.filter(s => s.coverageLevel === 'federal-only');

const stateOptions = [
  // Full coverage states first
  ...fullCoverageStates.map(s => ({
    value: s.code,
    label: `${s.name} — Full Coverage`,
  })),
  // Then all other states
  ...federalOnlyStates.map(s => ({
    value: s.code,
    label: s.name,
  })),
];

export default function Step1Page() {
  const router = useRouter();
  const formData = useScreeningStore((s) => s.formData);
  const setStepData = useScreeningStore((s) => s.setStepData);

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
      title="Tell us about your family"
      description="This helps us understand your household situation and which benefits might be available."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AccessibleSelect
          id="state"
          label="What state do you live in?"
          options={stateOptions}
          required
          value={stateValue || ''}
          onChange={(value) => {
            setValue('state', value as Step1Data['state'], { shouldValidate: true });
          }}
          error={errors.state?.message}
          placeholder="Select your state"
        />

        <AccessibleInput
          id="householdSize"
          label="How many people live in your home?"
          type="number"
          required
          helpText="Include everyone living in your home"
          value={householdSizeValue?.toString() || ''}
          onChange={(value) => {
            setValue('householdSize', value === '' ? undefined as any : Number(value), { shouldValidate: true });
          }}
          error={errors.householdSize?.message}
          placeholder="e.g., 4"
        />

        <div className="flex justify-end">
          <Button type="submit">
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </form>
    </QuestionCard>
  );
}
