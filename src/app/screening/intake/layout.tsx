'use client';

import React from 'react';
import { useScreeningStore } from '@/lib/screening/store';
import { StepIndicator } from '@/components/screening/StepIndicator';
import { STEPS } from '@/lib/screening/types';

interface IntakeLayoutProps {
  children: React.ReactNode;
}

export default function IntakeLayout({ children }: IntakeLayoutProps) {
  const currentStep = useScreeningStore((state) => state.currentStep);

  return (
    <div className="max-w-4xl mx-auto py-page-y">
      <StepIndicator steps={STEPS} currentStep={currentStep} />
      {children}
    </div>
  );
}
