'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { partnerOrganizations } from '@/content/resources/partners';
import { useScreeningStore } from '@/lib/screening/store';
import type { ReferralResult } from '@/lib/referrals/types';

// Zod schema for referral form validation
const referralFormSchema = z.object({
  familyName: z.string().min(1, 'Name is required'),
  familyEmail: z.string().email('Valid email is required'),
  familyPhone: z.string().optional(),
  familyNote: z.string().max(500, 'Note must be under 500 characters').optional(),
  selectedPartners: z.array(z.string()).min(1, 'Select at least one organization'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to share your information',
  }),
});

type ReferralFormData = z.infer<typeof referralFormSchema>;

function ReferralFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { results, formData } = useScreeningStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showDataPreview, setShowDataPreview] = useState(false);

  // Filter partners to only show those with email addresses
  const availablePartners = partnerOrganizations.filter((partner) => partner.email);

  // Get eligible programs from screening results
  const eligiblePrograms =
    results?.programs
      .filter((p) => p.eligible && (p.confidence === 'likely' || p.confidence === 'possible'))
      .map((p) => p.programId) || [];

  // Setup form with react-hook-form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      familyName: '',
      familyEmail: '',
      familyPhone: '',
      familyNote: '',
      selectedPartners: [],
      consent: false,
    },
  });

  const watchedNote = watch('familyNote') || '';
  const watchedPartners = watch('selectedPartners') || [];

  // Check authentication and pre-fill email on mount
  useEffect(() => {
    fetch('/api/screenings')
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data[0]?.screeningData?.email) {
          const email = data[0].screeningData.email;
          setUserEmail(email);
          setValue('familyEmail', email);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [setValue]);

  // Pre-select partner from URL param
  useEffect(() => {
    const partnerParam = searchParams.get('partner');
    if (partnerParam && availablePartners.some((p) => p.id === partnerParam)) {
      setValue('selectedPartners', [partnerParam]);
    }
  }, [searchParams, setValue, availablePartners]);

  // Handle form submission
  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/referrals/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          eligiblePrograms,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit referral');
      }

      const { results } = await response.json() as { results: ReferralResult[] };

      // Store results in sessionStorage for confirmation page
      sessionStorage.setItem('referralResults', JSON.stringify(results));
      sessionStorage.setItem('familyEmail', data.familyEmail);

      // Redirect to confirmation page
      router.push('/referral/confirmation');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map program IDs to readable names
  const getProgramName = (programId: string): string => {
    const programNames: Record<string, string> = {
      'ky-medicaid': 'Kentucky Medicaid',
      'ky-michelle-p-waiver': 'Michelle P. Waiver',
      'ky-hcb-waiver': 'Home and Community Based Waiver',
      'ky-scl-waiver': 'Supports for Community Living Waiver',
      'ky-ssi': 'Supplemental Security Income (SSI)',
      'ky-ssdi': 'Social Security Disability Insurance (SSDI)',
      'ky-snap': 'SNAP (Food Assistance)',
    };
    return programNames[programId] || programId;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Request a Referral
          </h1>
          <p className="text-lg text-gray-600">
            Connect with partner organizations who can help you apply for benefits and navigate the system.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Partner Selection Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Organizations
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose one or more organizations to connect with. Each will receive your referral separately.
            </p>

            <div className="space-y-3">
              {availablePartners.map((partner) => (
                <label
                  key={partner.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={partner.id}
                    {...register('selectedPartners')}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{partner.name}</div>
                    <div className="text-sm text-gray-600">{partner.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {errors.selectedPartners && (
              <p className="mt-2 text-sm text-red-600">{errors.selectedPartners.message}</p>
            )}
          </section>

          {/* Contact Information Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Contact Information
            </h2>

            <div className="space-y-4">
              {/* Family Name */}
              <div>
                <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="familyName"
                  {...register('familyName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jane Smith"
                />
                {errors.familyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.familyName.message}</p>
                )}
              </div>

              {/* Family Email */}
              <div>
                <label htmlFor="familyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="familyEmail"
                  {...register('familyEmail')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="jane@example.com"
                />
                {errors.familyEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.familyEmail.message}</p>
                )}
              </div>

              {/* Family Phone */}
              <div>
                <label htmlFor="familyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone Number (optional)
                </label>
                <input
                  type="tel"
                  id="familyPhone"
                  {...register('familyPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Family Note */}
              <div>
                <label htmlFor="familyNote" className="block text-sm font-medium text-gray-700 mb-1">
                  Note to Organization (optional)
                </label>
                <textarea
                  id="familyNote"
                  {...register('familyNote')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share any additional information or questions for the organization..."
                  maxLength={500}
                />
                <div className="mt-1 flex justify-between items-center">
                  <div>
                    {errors.familyNote && (
                      <p className="text-sm text-red-600">{errors.familyNote.message}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{watchedNote.length}/500</p>
                </div>
              </div>
            </div>
          </section>

          {/* Eligible Programs Display */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Programs You May Be Eligible For
            </h2>

            {eligiblePrograms.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  Based on your screening, this information will be shared with the organizations you select:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {eligiblePrograms.map((programId) => (
                    <li key={programId}>{getProgramName(programId)}</li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  Complete a screening first to include your eligibility results in the referral.
                </p>
                <a
                  href="/screening"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Start a screening
                </a>
              </div>
            )}
          </section>

          {/* Consent Section */}
          <section className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Privacy & Consent
            </h2>

            {/* Consent Checkbox */}
            <div className="mb-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('consent')}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  I agree to share my screening summary and contact information with the selected organization(s).
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-sm text-red-600">{errors.consent.message}</p>
              )}
            </div>

            {/* Data Preview Collapsible */}
            <button
              type="button"
              onClick={() => setShowDataPreview(!showDataPreview)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-3 underline"
            >
              What gets shared?
            </button>

            {showDataPreview && (
              <div className="bg-white rounded-md border border-gray-200 p-4 mb-4 text-sm">
                <p className="font-medium text-gray-900 mb-2">Information that will be shared:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
                  <li>Your name and contact information</li>
                  {eligiblePrograms.length > 0 && (
                    <li>
                      Programs you may be eligible for:{' '}
                      {eligiblePrograms.map(getProgramName).join(', ')}
                    </li>
                  )}
                  {watchedNote && <li>Your optional note to the organization</li>}
                </ul>
                <p className="text-gray-600 italic">
                  We do NOT share raw income, diagnosis details, or other sensitive information.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                This is an informational referral and not an application. Each organization has their own privacy practices.
              </p>
              <p>
                If you change your mind after submission, contact the organization directly to ask them not to use your information.
              </p>
            </div>
          </section>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Send Referral'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <ReferralFormContent />
    </Suspense>
  );
}
