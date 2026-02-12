'use client';

import React from 'react';
import type { StepConfig } from '@/lib/screening/types';

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center gap-4">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2
                    ${isCompleted ? 'bg-blue-600 border-blue-600' : ''}
                    ${isCurrent ? 'bg-blue-600 border-blue-600 font-semibold' : ''}
                    ${isPending ? 'bg-gray-200 border-gray-300' : ''}
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`
                        ${isCurrent ? 'text-white' : ''}
                        ${isPending ? 'text-gray-600' : ''}
                      `}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`
                    mt-2 text-sm
                    ${isCurrent ? 'font-semibold text-blue-700' : ''}
                    ${isCompleted ? 'text-gray-700' : ''}
                    ${isPending ? 'text-gray-500' : ''}
                  `}
                >
                  {step.label}
                  {/* Visually hidden status for screen readers */}
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
