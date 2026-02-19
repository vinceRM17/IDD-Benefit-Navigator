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
import { useTranslations } from 'next-intl';

export default function Step3Page() {
  const router = useRouter();
  const { formData, setStepData } = useScreeningStore();
  const t = useTranslations('screening');

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

  const yesNo = [
    { value: 'true', label: t('review.yes') },
    { value: 'false', label: t('review.no') },
  ];

  const onSubmit = (data: Step3Data) => {
    setStepData(data);
    router.push('/screening/intake/step-4');
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-2');
  };

  return (
    <QuestionCard
      title={t('step3.title')}
      description={t('step3.description')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AccessibleRadioGroup
          name="hasDisabilityDiagnosis"
          legend={t('step3.hasDisabilityLabel')}
          options={yesNo}
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
            label={t('step3.ageLabel')}
            type="number"
            required
            helpText={t('step3.ageHelp')}
            value={ageValue?.toString() || ''}
            onChange={(value) => {
              setValue('age', value === '' ? undefined as any : Number(value), { shouldValidate: true });
            }}
            error={errors.age?.message}
            placeholder={t('step3.agePlaceholder')}
          />
        )}

        <AccessibleRadioGroup
          name="hasInsurance"
          legend={t('step3.hasInsuranceLabel')}
          options={yesNo}
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
            label={t('step3.insuranceTypeLabel')}
            options={[
              { value: 'employer', label: t('step3.insuranceEmployer') },
              { value: 'marketplace', label: t('step3.insuranceMarketplace') },
              { value: 'none', label: t('step3.insuranceOther') },
            ]}
            required
            value={insuranceTypeValue || ''}
            onChange={(value) => {
              setValue('insuranceType', value as 'employer' | 'marketplace' | 'none', { shouldValidate: true });
            }}
            error={errors.insuranceType?.message}
            placeholder={t('step3.insuranceTypePlaceholder')}
          />
        )}

        <div className="flex justify-between mt-8">
          <Button type="button" variant="secondary" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('common.previous')}
          </Button>
          <Button type="submit">
            {t('common.next')}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </form>
    </QuestionCard>
  );
}
