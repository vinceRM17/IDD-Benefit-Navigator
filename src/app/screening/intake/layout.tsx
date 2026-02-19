'use client';

import React from 'react';
import { useScreeningStore } from '@/lib/screening/store';
import { StepIndicator } from '@/components/screening/StepIndicator';
import { useTranslations } from 'next-intl';

interface IntakeLayoutProps {
  children: React.ReactNode;
}

export default function IntakeLayout({ children }: IntakeLayoutProps) {
  const currentStep = useScreeningStore((state) => state.currentStep);
  const t = useTranslations('screening.steps');

  const steps = [
    { id: 1, label: t('familySituation'), href: '/screening/intake/step-1' },
    { id: 2, label: t('incomeAndBenefits'), href: '/screening/intake/step-2' },
    { id: 3, label: t('diagnosisAndInsurance'), href: '/screening/intake/step-3' },
    { id: 4, label: t('functionalNeeds'), href: '/screening/intake/step-4' },
    { id: 5, label: t('review'), href: '/screening/intake/review' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-page-y">
      <StepIndicator steps={steps} currentStep={currentStep} />
      {children}
    </div>
  );
}
