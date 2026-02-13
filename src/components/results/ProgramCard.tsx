/**
 * Program Card Component
 * Displays eligibility result with program info, confidence badge, and plain-language description
 * WCAG compliant with proper heading hierarchy and semantic markup
 */

'use client';

import { EnrichedResult } from '@/lib/results/types';

interface ProgramCardProps {
  result: EnrichedResult;
}

export function ProgramCard({ result }: ProgramCardProps) {
  const { content, eligible, confidence } = result;

  // Determine confidence badge styling
  const getBadgeStyles = () => {
    if (confidence === 'likely') {
      return {
        color: 'bg-green-100 text-green-800 border-green-300',
        text: 'Likely Eligible',
      };
    } else if (confidence === 'possible') {
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        text: 'May Be Eligible',
      };
    } else {
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'Unlikely',
      };
    }
  };

  const badge = getBadgeStyles();
  const hasLeftAccent = confidence === 'likely';

  return (
    <div
      className={`rounded-lg border shadow-sm p-6 ${
        hasLeftAccent ? 'border-l-4 border-l-green-500' : 'border-gray-200'
      }`}
    >
      {/* Program name and confidence badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{content.name}</h3>
        <span
          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${badge.color} whitespace-nowrap`}
        >
          {badge.text}
        </span>
      </div>

      {/* Waitlist info callout (if applicable) */}
      {content.waitlistInfo && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Important:</strong> {content.waitlistInfo}
          </p>
        </div>
      )}

      {/* Encouragement callout */}
      {content.encouragement && (
        <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm text-teal-900">{content.encouragement}</p>
        </div>
      )}

      {/* Program description */}
      <p className="text-gray-700 mb-4">{content.description}</p>

      {/* What it covers */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">What it covers:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {content.whatItCovers.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* While You Wait (for programs with waitlists) */}
      {content.whileYouWait && content.whileYouWait.length > 0 && (
        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">
            While you wait:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-900">
            {content.whileYouWait.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Misconceptions */}
      {content.commonMisconceptions && content.commonMisconceptions.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            Things families often wonder:
          </h4>
          <ul className="space-y-2">
            {content.commonMisconceptions.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 flex gap-2">
                <span className="text-gray-400 shrink-0" aria-hidden="true">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Application info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <a
            href={content.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply here
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <div className="text-sm text-gray-600">
            <p>
              Need help?{' '}
              <a
                href={`tel:${content.applicationPhone}`}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {content.applicationPhone}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Insurance coordination (if applicable) */}
      {content.insuranceCoordination && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-2">
            About your insurance:
          </h4>
          <p className="text-sm text-amber-900">
            {content.insuranceCoordination}
          </p>
        </div>
      )}
    </div>
  );
}
