'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ReferralResult } from '@/lib/referrals/types';

export default function ReferralConfirmationPage() {
  const router = useRouter();
  const [results, setResults] = useState<ReferralResult[]>([]);
  const [familyEmail, setFamilyEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read results from sessionStorage
    const storedResults = sessionStorage.getItem('referralResults');
    const storedEmail = sessionStorage.getItem('familyEmail');

    if (storedResults && storedEmail) {
      try {
        const parsedResults = JSON.parse(storedResults) as ReferralResult[];
        setResults(parsedResults);
        setFamilyEmail(storedEmail);

        // Clear sessionStorage after reading
        sessionStorage.removeItem('referralResults');
        sessionStorage.removeItem('familyEmail');
      } catch (error) {
        console.error('Failed to parse referral results:', error);
      }
    }

    // Check authentication status
    fetch('/api/screenings')
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If no results data, show error message
  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No Referral Data Found
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't find any referral information. You may have already viewed this confirmation or navigated here directly.
            </p>
            <Link
              href="/referral"
              className="inline-block px-6 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800"
            >
              Submit a Referral
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Referral Has Been Sent
            </h1>
            <p className="text-lg text-gray-600">
              We've connected you with the organizations you selected.
            </p>
          </div>

          {/* Partner List */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              We've sent your referral to:
            </h2>
            <ul className="space-y-2">
              {results.map((result) => (
                <li
                  key={result.referralId}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
                >
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-900 font-medium">{result.partnerName}</span>
                  {result.sent && (
                    <span className="text-sm text-gray-500">(Sent)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Confirmation Email Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
            <p className="text-blue-900">
              You'll receive a confirmation email at{' '}
              <span className="font-semibold">{familyEmail}</span> with details of your referral.
            </p>
          </div>

          {/* User-specific next steps */}
          {!isAuthenticated ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
              <p className="text-yellow-900 font-medium mb-2">
                This is your only record of this referral.
              </p>
              <p className="text-yellow-800 text-sm mb-3">
                To track referrals in the future, consider creating an account.
              </p>
              <Link
                href="/auth/signup"
                className="inline-block text-sm px-4 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700"
              >
                Create an Account
              </Link>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-8">
              <p className="text-blue-900 mb-3">
                View your referrals and track their status on your dashboard.
              </p>
              <Link
                href="/dashboard/referrals"
                className="inline-block text-sm px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                View Your Referrals
              </Link>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <p className="text-sm text-gray-600 mb-3">
              If you change your mind, contact the organization directly to ask them not to use your information.
            </p>
          </div>

          {/* Next Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/screening"
              className="flex-1 text-center px-6 py-3 bg-white border-2 border-blue-700 text-blue-700 font-semibold rounded-md hover:bg-blue-50"
            >
              Start a New Screening
            </Link>
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
