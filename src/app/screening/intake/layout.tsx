'use client';

import React from 'react';
import { useScreeningStore } from '@/lib/screening/store';
import { StepIndicator } from '@/components/screening/StepIndicator';
import { STEPS } from '@/lib/screening/types';

interface IntakeLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for all intake steps
 * Shows progress indicator and handles hydration
 */
export default function IntakeLayout({ children }: IntakeLayoutProps) {
  const currentStep = useScreeningStore((state) => state.currentStep);
  const isHydrated = useScreeningStore((state) => state.isHydrated);

  // Show loading skeleton until Zustand rehydrates from localStorage
  // Prevents flash of step 1 when user is actually on step 3
  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <StepIndicator steps={STEPS} currentStep={currentStep} />
      {children}
    </div>
  );
}
