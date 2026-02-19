'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useScreeningStore } from '@/lib/screening/store';
import { step2Schema, type Step2Data } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';
import { AccessibleInput, AccessibleRadioGroup } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Step2Page() {
  const router = useRouter();
  const { formData, setStepData, editing, setEditing } = useScreeningStore();
  const t = useTranslations('screening');

  const {
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
    if (editing) {
      setEditing(false);
      router.push('/screening/intake/review');
    } else {
      router.push('/screening/intake/step-3');
    }
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-1');
  };

  const yesNo = [
    { value: 'true', label: t('review.yes') },
    { value: 'false', label: t('review.no') },
  ];

  return (
    <QuestionCard
      title={t('step2.title')}
      description={t('step2.description')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AccessibleInput
          id="monthlyIncome"
          label={t('step2.monthlyIncomeLabel')}
          type="number"
          required
          helpText={t('step2.monthlyIncomeHelp')}
          value={monthlyIncomeValue?.toString() || ''}
          onChange={(value) => {
            setValue('monthlyIncome', value === '' ? undefined as any : Number(value), { shouldValidate: true });
          }}
          error={errors.monthlyIncome?.message}
          placeholder={t('step2.monthlyIncomePlaceholder')}
        />

        <AccessibleRadioGroup
          name="receivesSSI"
          legend={t('step2.receivesSSILabel')}
          helpText={t('step2.receivesSSIHelp')}
          options={yesNo}
          required
          value={receivesSSIValue?.toString() || 'false'}
          onChange={(value) => {
            setValue('receivesSSI', value === 'true');
          }}
          error={errors.receivesSSI?.message}
        />

        <AccessibleRadioGroup
          name="receivesSNAP"
          legend={t('step2.receivesSNAPLabel')}
          helpText={t('step2.receivesSNAPHelp')}
          options={yesNo}
          required
          value={receivesSNAPValue?.toString() || 'false'}
          onChange={(value) => {
            setValue('receivesSNAP', value === 'true');
          }}
          error={errors.receivesSNAP?.message}
        />

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
