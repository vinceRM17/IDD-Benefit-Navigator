'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { StepConfig } from '@/lib/screening/types';

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-start justify-between w-full">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <li key={step.id} className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isCompleted ? 'bg-primary border-primary' : ''}
                    ${isCurrent ? 'bg-primary border-primary font-semibold' : ''}
                    ${isPending ? 'bg-secondary border-border' : ''}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                  ) : (
                    <span
                      className={`text-sm font-medium
                        ${isCurrent ? 'text-primary-foreground' : ''}
                        ${isPending ? 'text-muted-foreground' : ''}
                      `}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                <span
                  className={`
                    mt-2 text-sm hidden sm:block
                    ${isCurrent ? 'font-semibold text-primary' : ''}
                    ${isCompleted ? 'text-foreground' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `}
                >
                  {step.label}
                  {isCompleted && (
                    <span className="sr-only"> (completed)</span>
                  )}
                  {isCurrent && (
                    <span className="sr-only"> (current step)</span>
                  )}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
