'use client';

import React from 'react';
import { partnerOrganizations } from '@/content/resources/partners';
import { applicationPortals } from '@/content/resources/portals';

interface FamilyContext {
  hasDisabilityDiagnosis?: boolean;
  age?: number;
  hasInsurance?: boolean;
}

interface ResourceDirectoryProps {
  /** Program IDs the user is eligible for (used to filter relevant resources) */
  eligibleProgramIds: string[];
  /** Family context for needs-based referral (optional) */
  familyContext?: FamilyContext;
}

/** Map family context to relevant service categories */
function getRelevantServices(context?: FamilyContext): string[] {
  if (!context) return [];
  const services: string[] = [];

  if (context.hasDisabilityDiagnosis) {
    services.push('advocacy', 'benefits-navigation');
  }
  if (context.age !== undefined && context.age < 21) {
    services.push('family-support', 'education');
  }
  if (context.hasInsurance) {
    services.push('insurance-coordination');
  }

  return services;
}

/** Get a friendly label for a service category */
function getServiceLabel(service: string): string {
  const labels: Record<string, string> = {
    'benefits-navigation': 'benefits navigation',
    advocacy: 'advocacy services',
    'family-support': 'family support',
    education: 'educational resources',
    'independent-living': 'independent living support',
    'assistive-technology': 'assistive technology',
    employment: 'employment support',
    'community-integration': 'community integration',
    'job-training': 'job training',
    'social-inclusion': 'social inclusion programs',
    'peer-support': 'peer support',
    'community-events': 'community events',
    'application-assistance': 'application assistance',
    'case-management': 'case management',
    'disability-determination': 'disability determination',
  };
  return labels[service] ?? service;
}

/**
 * Resource directory component showing partner organizations and application portals
 *
 * Filters resources to show only those relevant to the user's eligible programs.
 * Organizations are sorted by relevance (how many eligible programs they can help with).
 * When family context is provided, adds "Recommended for you" badges.
 */
export function ResourceDirectory({ eligibleProgramIds, familyContext }: ResourceDirectoryProps) {
  const relevantServices = getRelevantServices(familyContext);

  // Filter and sort partner organizations by relevance
  const relevantPartners = partnerOrganizations
    .map((org) => {
      const matchingPrograms = org.relevantPrograms.filter((programId) =>
        eligibleProgramIds.includes(programId)
      );

      // Check for needs-based match
      const matchingServices = (org.servicesOffered ?? []).filter((s) =>
        relevantServices.includes(s)
      );

      return {
        ...org,
        matchCount: matchingPrograms.length,
        matchingServices,
        isRecommended: matchingServices.length > 0,
      };
    })
    .filter((org) => org.matchCount > 0)
    .sort((a, b) => {
      // Recommended first, then by program match count
      if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
      return b.matchCount - a.matchCount;
    });

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
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {org.name}
                  </h4>
                  {org.isRecommended && (
                    <span className="flex-shrink-0 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-medium">
                      Recommended for you
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-3">{org.description}</p>

                {/* Personalized recommendation note */}
                {org.isRecommended && org.matchingServices.length > 0 && (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md p-3 mb-3">
                    Based on your family's situation, {org.name} may be
                    especially helpful because they offer{' '}
                    {org.matchingServices.map(getServiceLabel).join(' and ')}.
                  </p>
                )}

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
