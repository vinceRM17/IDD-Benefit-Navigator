'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScreeningStore } from '@/lib/screening/store';
import { QuestionCard } from '@/components/screening/QuestionCard';
import { fullSchema } from '@/lib/screening/schema';

export default function ReviewPage() {
  const router = useRouter();
  const { formData } = useScreeningStore();
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const handleGetResults = () => {
    // Validate full form data
    const result = fullSchema.safeParse(formData);
    
    if (!result.success) {
      // Find which section has issues
      const errors = result.error.errors;
      const fieldWithError = errors[0]?.path[0];
      
      let section = 'Unknown';
      if (['state', 'householdSize'].includes(fieldWithError as string)) {
        section = 'Family Situation (Step 1)';
      } else if (['monthlyIncome', 'receivesSSI', 'receivesSNAP'].includes(fieldWithError as string)) {
        section = 'Income & Benefits (Step 2)';
      } else if (['hasDisabilityDiagnosis', 'age', 'hasInsurance', 'insuranceType'].includes(fieldWithError as string)) {
        section = 'Diagnosis & Insurance (Step 3)';
      }
      
      setValidationError(`Please complete all required fields in ${section}`);
      return;
    }

    // Navigate to results (placeholder for 02-03)
    router.push('/screening/results/pending');
  };

  const handlePrevious = () => {
    router.push('/screening/intake/step-3');
  };

  return (
    <QuestionCard
      title="Review your answers"
      description="Please check that everything looks correct before getting your results."
    >
      <div className="space-y-8">
        {/* Family Situation Section */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">Family Situation</h3>
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
              <dd className="text-gray-900 font-medium">{formData.state || 'Not provided'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Household size:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.householdSize ? `${formData.householdSize} people` : 'Not provided'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Income & Benefits Section */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">Income & Benefits</h3>
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
                {formData.monthlyIncome !== undefined 
                  ? `$${formData.monthlyIncome.toLocaleString()}` 
                  : 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Receives SSI:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.receivesSSI !== undefined 
                  ? (formData.receivesSSI ? 'Yes' : 'No')
                  : 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Receives SNAP:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.receivesSNAP !== undefined 
                  ? (formData.receivesSNAP ? 'Yes' : 'No')
                  : 'Not provided'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Diagnosis & Insurance Section */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">Diagnosis & Insurance</h3>
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
                {formData.hasDisabilityDiagnosis !== undefined 
                  ? (formData.hasDisabilityDiagnosis ? 'Yes' : 'No')
                  : 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Age:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.age ? `${formData.age} years old` : 'Not provided'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Has insurance:</dt>
              <dd className="text-gray-900 font-medium">
                {formData.hasInsurance !== undefined 
                  ? (formData.hasInsurance ? 'Yes' : 'No')
                  : 'Not provided'}
              </dd>
            </div>
            {formData.hasInsurance && formData.insuranceType && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Insurance type:</dt>
                <dd className="text-gray-900 font-medium">
                  {formData.insuranceType === 'employer' && 'Employer-provided'}
                  {formData.insuranceType === 'marketplace' && 'Marketplace/ACA'}
                  {formData.insuranceType === 'none' && 'None'}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{validationError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors min-h-[44px]"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleGetResults}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors min-h-[44px]"
          >
            Get My Results
          </button>
        </div>
      </div>
    </QuestionCard>
  );
}
