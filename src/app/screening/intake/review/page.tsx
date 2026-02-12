'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScreeningStore } from '@/lib/screening/store';
import { fullSchema } from '@/lib/screening/schema';
import { QuestionCard } from '@/components/screening/QuestionCard';

/**
 * Review page - displays all collected form data
 * Allows editing and validates full schema before proceeding
 */
export default function ReviewPage() {
  const router = useRouter();
  const { formData } = useScreeningStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleGetResults = () => {
    // Validate complete form data
    const result = fullSchema.safeParse(formData);

    if (!result.success) {
      const errors = result.error.errors.map((err) => {
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
      });
      setValidationErrors(errors);
      return;
    }

    // Navigate to results page (placeholder until 02-03)
    router.push('/screening/results/pending');
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-3');
  };

  return (
    <QuestionCard
      title="Review your answers"
      description="Please check that everything looks correct before we generate your results."
    >
      <div className="space-y-8">
        {/* Family Situation Section */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Family Situation
            </h3>
            <Link
              href="/screening/intake/step-1"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </Link>
          </div>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">State:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.state || 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Household size:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.householdSize || 'Not provided'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Income & Benefits Section */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Income & Benefits
            </h3>
            <Link
              href="/screening/intake/step-2"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </Link>
          </div>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">Monthly income:</dt>
              <dd className="text-gray-900 font-medium">
                ${formData.monthlyIncome || 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Receives SSI:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.receivesSSI ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Receives SNAP:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.receivesSNAP ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Diagnosis & Insurance Section */}
        <div className="pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Diagnosis & Insurance
            </h3>
            <Link
              href="/screening/intake/step-3"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit
            </Link>
          </div>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">Has disability diagnosis:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.hasDisabilityDiagnosis ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Age:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.age || 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Has private insurance:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.hasInsurance ? 'Yes' : 'No'}
              </dd>
            </div>
            {formData.hasInsurance && formData.insuranceType && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Insurance type:</dt>
                <dd className="text-gray-900 font-medium">
                  {formData.insuranceType === 'employer'
                    ? 'Employer-provided'
                    : formData.insuranceType === 'marketplace'
                    ? 'Marketplace/ACA'
                    : 'Other'}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-900 font-semibold mb-2">
              Please fix these issues:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors min-h-[44px]"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleGetResults}
            className="bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px]"
          >
            Get My Results
          </button>
        </div>
      </div>
    </QuestionCard>
  );
}
