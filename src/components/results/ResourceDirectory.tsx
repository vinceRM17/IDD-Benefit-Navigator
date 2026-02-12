'use client';

import React from 'react';
import { partnerOrganizations } from '@/content/resources/partners';
import { applicationPortals } from '@/content/resources/portals';

interface ResourceDirectoryProps {
  /** Program IDs the user is eligible for (used to filter relevant resources) */
  eligibleProgramIds: string[];
}

/**
 * Resource directory component showing partner organizations and application portals
 *
 * Filters resources to show only those relevant to the user's eligible programs.
 * Organizations are sorted by relevance (how many eligible programs they can help with).
 */
export function ResourceDirectory({ eligibleProgramIds }: ResourceDirectoryProps) {
  // Filter and sort partner organizations by relevance
  const relevantPartners = partnerOrganizations
    .map((org) => {
      const matchingPrograms = org.relevantPrograms.filter((programId) =>
        eligibleProgramIds.includes(programId)
      );
      return {
        ...org,
        matchCount: matchingPrograms.length,
      };
    })
    .filter((org) => org.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount); // Most relevant first

  // Filter application portals to those relevant for eligible programs
  const relevantPortals = applicationPortals.filter((portal) =>
    portal.programIds.some((programId) => eligibleProgramIds.includes(programId))
  );

  return (
    <section className="mt-12 space-y-8">
      {/* Partner Organizations Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Organizations That Can Help
        </h3>
        {relevantPartners.length > 0 ? (
          <div className="space-y-4">
            {relevantPartners.map((org) => (
              <div
                key={org.id}
                className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {org.name}
                </h4>
                <p className="text-gray-700 mb-3">{org.description}</p>

                {/* Services */}
                <div className="mb-3">
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    Services:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {org.services.map((service, idx) => (
                      <li key={idx}>{service}</li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Phone: </span>
                    <a
                      href={`tel:${org.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {org.phone}
                    </a>
                  </div>
                  {org.email && (
                    <div>
                      <span className="font-medium text-gray-900">Email: </span>
                      <a
                        href={`mailto:${org.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {org.email}
                      </a>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-900">Website: </span>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {org.website.replace(/^https?:\/\//, '')}
                      <span className="sr-only"> (opens in new window)</span>
                    </a>
                  </div>
                </div>

                {/* Service Area */}
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Serves: </span>
                  {org.servesArea}
                </p>

                {/* Address (if available) */}
                {org.address && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Address: </span>
                    {org.address}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            We're building our partner network. Check back soon for organizations in your area.
          </p>
        )}
      </div>

      {/* Application Portals Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Where to Apply</h3>
        {relevantPortals.length > 0 ? (
          <div className="space-y-4">
            {relevantPortals.map((portal) => (
              <div
                key={portal.id}
                className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {portal.name}
                </h4>
                <p className="text-gray-700 mb-4">{portal.description}</p>

                {/* Apply Button */}
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to {portal.name}
                  <span className="sr-only"> (opens in new window)</span>
                </a>

                {/* Notes */}
                {portal.notes && (
                  <p className="text-sm text-gray-600 mt-3 italic">
                    {portal.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No direct application portals available for your eligible programs.
            Contact the organizations listed above for assistance.
          </p>
        )}
      </div>
    </section>
  );
}
