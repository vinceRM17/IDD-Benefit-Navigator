'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useScreeningStore } from '@/lib/screening/store';
import { step2Schema, type Step2Data } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import { AccessibleInput, AccessibleRadioGroup } from '@/components/forms';

/**
 * Step 2: Income & Benefits
 * Collects monthly income and current benefit enrollment
 */
export default function Step2Page() {
  const router = useRouter();
  const { formData, setStepData } = useScreeningStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      monthlyIncome: formData.monthlyIncome || undefined,
      receivesSSI: formData.receivesSSI || false,
      receivesSNAP: formData.receivesSNAP || false,
    },
  });

  const monthlyIncomeValue = watch('monthlyIncome');
  const receivesSSIValue = watch('receivesSSI');
  const receivesSNAPValue = watch('receivesSNAP');

  const onSubmit = (data: Step2Data) => {
    setStepData(data);
    router.push('/screening/intake/step-3');
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-1');
  };

  return (
    <QuestionCard
      title="Your household income and current benefits"
      description="This information helps us understand what benefits you may already receive and what additional support might be available."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AccessibleInput
          id="monthlyIncome"
          label="What is your total monthly household income?"
          type="number"
          required
          helpText="Your total household income before taxes, per month"
          value={monthlyIncomeValue?.toString() || ''}
          onChange={(value) => {
            register('monthlyIncome').onChange({ target: { value } });
          }}
          error={errors.monthlyIncome?.message}
          placeholder="e.g., 2500"
        />

        <AccessibleRadioGroup
          name="receivesSSI"
          legend="Does anyone in your household receive SSI?"
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          required
          value={receivesSSIValue?.toString() || 'false'}
          onChange={(value) => {
            setValue('receivesSSI', value === 'true');
          }}
          error={errors.receivesSSI?.message}
        />

        <AccessibleRadioGroup
          name="receivesSNAP"
          legend="Does your household currently receive SNAP (food stamps)?"
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          required
          value={receivesSNAPValue?.toString() || 'false'}
          onChange={(value) => {
            setValue('receivesSNAP', value === 'true');
          }}
          error={errors.receivesSNAP?.message}
        />

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors min-h-[44px]"
          >
            Previous
          </button>
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
