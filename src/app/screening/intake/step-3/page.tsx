'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useScreeningStore } from '@/lib/screening/store';
import { step3Schema, type Step3Data } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import {
  AccessibleInput,
  AccessibleRadioGroup,
  AccessibleSelect,
} from '@/components/forms';
import { shouldShowInsuranceType } from '@/lib/screening/conditional-logic';

/**
 * Step 3: Diagnosis & Insurance
 * Collects disability diagnosis, age, and insurance information
 * Conditionally shows insurance type field based on hasInsurance answer
 */
export default function Step3Page() {
  const router = useRouter();
  const { formData, setStepData } = useScreeningStore();

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      hasDisabilityDiagnosis: formData.hasDisabilityDiagnosis || false,
      age: formData.age || undefined,
      hasInsurance: formData.hasInsurance || false,
      insuranceType: formData.insuranceType || undefined,
    },
  });

  const hasDisabilityDiagnosisValue = watch('hasDisabilityDiagnosis');
  const ageValue = watch('age');
  const hasInsuranceValue = watch('hasInsurance');
  const insuranceTypeValue = watch('insuranceType');

  const showInsuranceType = shouldShowInsuranceType(hasInsuranceValue);

  const onSubmit = (data: Step3Data) => {
    setStepData(data);
    router.push('/screening/intake/review');
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-2');
  };

  return (
    <QuestionCard
      title="Diagnosis and insurance"
      description="This information helps us understand your family member's needs and current coverage."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AccessibleRadioGroup
          name="hasDisabilityDiagnosis"
          legend="Has your family member been diagnosed with an intellectual or developmental disability?"
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          required
          value={hasDisabilityDiagnosisValue?.toString() || 'false'}
          onChange={(value) => {
            setValue('hasDisabilityDiagnosis', value === 'true');
          }}
          error={errors.hasDisabilityDiagnosis?.message}
        />

        <AccessibleInput
          id="age"
          label="How old is your family member with a disability?"
          type="number"
          required
          helpText="Enter their current age in years"
          value={ageValue?.toString() || ''}
          onChange={(value) => {
            setValue('age', value === '' ? undefined as any : Number(value), { shouldValidate: true });
          }}
          error={errors.age?.message}
          placeholder="e.g., 12"
        />

        <AccessibleRadioGroup
          name="hasInsurance"
          legend="Does your family member have private health insurance?"
          options={[
            { value: 'true', label: 'Yes' },
            { value: 'false', label: 'No' },
          ]}
          required
          value={hasInsuranceValue?.toString() || 'false'}
          onChange={(value) => {
            setValue('hasInsurance', value === 'true');
            // Clear insurance type if changing to no insurance
            if (value === 'false') {
              setValue('insuranceType', undefined);
            }
          }}
          error={errors.hasInsurance?.message}
        />

        {showInsuranceType && (
          <AccessibleSelect
            id="insuranceType"
            label="What type of insurance?"
            options={[
              { value: 'employer', label: 'Employer-provided insurance' },
              { value: 'marketplace', label: 'Marketplace/ACA insurance' },
              { value: 'none', label: 'Other' },
            ]}
            required
            value={insuranceTypeValue || ''}
            onChange={(value) => {
              setValue('insuranceType', value as 'employer' | 'marketplace' | 'none', { shouldValidate: true });
            }}
            error={errors.insuranceType?.message}
            placeholder="Select insurance type"
          />
        )}

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
