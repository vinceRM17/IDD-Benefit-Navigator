'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useScreeningStore } from '@/lib/screening/store';
import { StepIndicator } from '@/components/screening/StepIndicator';
import { useTranslations } from 'next-intl';

interface IntakeLayoutProps {
  children: React.ReactNode;
}

function getStepFromPath(pathname: string): number {
  if (pathname.includes('/step-1')) return 1;
  if (pathname.includes('/step-2')) return 2;
  if (pathname.includes('/step-3')) return 3;
  if (pathname.includes('/step-4')) return 4;
  if (pathname.includes('/review')) return 5;
  return 1;
}

export default function IntakeLayout({ children }: IntakeLayoutProps) {
  const pathname = usePathname();
  const setCurrentStep = useScreeningStore((s) => s.setCurrentStep);
  const t = useTranslations('screening.steps');

  const currentStep = getStepFromPath(pathname);

  useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

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
