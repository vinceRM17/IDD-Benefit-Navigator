'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useScreeningStore } from '@/lib/screening/store';
import { step1Schema, type Step1Data } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import { AccessibleInput, AccessibleSelect } from '@/components/forms';

/**
 * Step 1: Family Situation
 * Collects state and household size
 */
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
      state: formData.state || 'KY',
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
          options={[{ value: 'KY', label: 'Kentucky' }]}
          required
          value={stateValue || ''}
          onChange={(value) => {
            setValue('state', value as 'KY', { shouldValidate: true });
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
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px]"
          >
            Next
          </button>
        </div>
      </form>
    </QuestionCard>
  );
}
