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
import { shouldShowAge, shouldShowInsuranceType } from '@/lib/screening/conditional-logic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

  const showAge = shouldShowAge(hasDisabilityDiagnosisValue);
  const showInsuranceType = shouldShowInsuranceType(hasInsuranceValue);

  const onSubmit = (data: Step3Data) => {
    setStepData(data);
    router.push('/screening/intake/step-4');
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
            if (value === 'false') {
              setValue('age', undefined);
            }
          }}
          error={errors.hasDisabilityDiagnosis?.message}
        />

        {showAge && (
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
        )}

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
          <Button type="button" variant="secondary" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button type="submit">
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </form>
    </QuestionCard>
  );
}
