'use client';

import React from 'react';
import Link from 'next/link';
import { useScreeningStore } from '@/lib/screening/store';

/**
 * Screening landing page
 * Anonymous entry point - no login required
 */
export default function ScreeningPage() {
  const reset = useScreeningStore((state) => state.reset);

  const handleStart = () => {
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Benefits for Your Family
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Answer a few questions about your family's situation. We'll help you
          understand which benefits you may qualify for and what to do next.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          No account needed. Your answers stay on your device.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          What to expect
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>4-step questionnaire (takes about 5 minutes)</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>
              Questions about your family, income, and insurance situation
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>
              Personalized results showing which benefits you may qualify for
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>Step-by-step guidance on what to do next</span>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Link
          href="/screening/intake/step-1"
          onClick={handleStart}
          className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px]"
        >
          Start Screening
        </Link>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          We currently support families in Kentucky. More states coming soon.
        </p>
      </div>
    </div>
  );
}
