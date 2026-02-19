'use client';

import React from 'react';
import Link from 'next/link';
import { getPartnersByState } from '@/content/resources/partners';
import { getPortalsByState } from '@/content/resources/portals';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  ExternalLink,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FamilyContext {
  hasDisabilityDiagnosis?: boolean;
  age?: number;
  hasInsurance?: boolean;
}

interface ResourceDirectoryProps {
  eligibleProgramIds: string[];
  familyContext?: FamilyContext;
  stateCode?: string;
}

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

export function ResourceDirectory({ eligibleProgramIds, familyContext, stateCode = 'KY' }: ResourceDirectoryProps) {
  const relevantServices = getRelevantServices(familyContext);
  const t = useTranslations('results.resources');

  const partners = getPartnersByState(stateCode);
  const portals = getPortalsByState(stateCode);

  const relevantPartners = partners
    .map((org) => {
      const matchingPrograms = org.relevantPrograms.filter((programId) =>
        eligibleProgramIds.includes(programId)
      );
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
      if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
      return b.matchCount - a.matchCount;
    });

  const relevantPortals = portals.filter((portal) =>
    portal.programIds.some((programId) => eligibleProgramIds.includes(programId))
  );

  return (
    <section className="space-y-8">
      {/* Partner Organizations */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-heading font-bold text-foreground">
            {t('orgTitle')}
          </h3>
        </div>
        {relevantPartners.length > 0 ? (
          <div className="space-y-4">
            {relevantPartners.map((org) => (
              <Card key={org.id}>
                <CardContent className="p-card-padding">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Link
                      href={`/resources/${org.id}`}
                      className="text-lg font-heading font-semibold text-primary hover:text-primary/80 hover:underline"
                    >
                      {org.name}
                    </Link>
                    {org.isRecommended && (
                      <Badge variant="success" className="gap-1">
                        <Star className="h-3 w-3" />
                        {t('recommended')}
                      </Badge>
                    )}
                  </div>

                  <p className="text-foreground/80 mb-3">{org.description}</p>

                  {org.isRecommended && org.matchingServices.length > 0 && (
                    <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-3 mb-3">
                      {t('helpfulBecause', {
                        orgName: org.name,
                        services: org.matchingServices.map(getServiceLabel).join(' & '),
                      })}
                    </div>
                  )}

                  {/* Services */}
                  <div className="mb-3">
                    <p className="font-medium text-foreground text-sm mb-1">
                      {t('services')}
                    </p>
                    <ul className="list-disc list-inside text-foreground/80 text-sm space-y-1">
                      {org.services.map((service, idx) => (
                        <li key={idx}>{service}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <a
                          href={`tel:${org.phone}`}
                          className="text-primary hover:text-primary/80"
                        >
                          {org.phone}
                        </a>
                      </div>
                      {org.email && (
                        <div className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <a
                            href={`mailto:${org.email}`}
                            className="text-primary hover:text-primary/80"
                          >
                            {org.email}
                          </a>
                        </div>
                      )}
                      <div className="inline-flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          {org.website.replace(/^https?:\/\//, '')}
                          <span className="sr-only"> {t('opensNewWindow')}</span>
                        </a>
                      </div>
                    </div>

                    {org.email ? (
                      <Button size="sm" asChild>
                        <Link href={`/referral?partner=${org.id}`}>
                          {t('referMe')}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {t('contactDirectly')}{' '}
                        <a
                          href={`tel:${org.phone}`}
                          className="text-primary hover:text-primary/80"
                        >
                          {org.phone}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Service Area */}
                  <p className="text-sm text-muted-foreground mt-3 inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {t('serves')} {org.servesArea}
                  </p>

                  {org.address && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('address')} {org.address}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {t('noPartners')}
          </p>
        )}
      </div>

      {/* Application Portals */}
      <div>
        <h3 className="text-2xl font-heading font-bold text-foreground mb-4">{t('whereToApply')}</h3>
        {relevantPortals.length > 0 ? (
          <div className="space-y-4">
            {relevantPortals.map((portal) => (
              <Card key={portal.id}>
                <CardContent className="p-card-padding">
                  <h4 className="text-lg font-heading font-semibold text-foreground mb-2">
                    {portal.name}
                  </h4>
                  <p className="text-foreground/80 mb-4">{portal.description}</p>

                  <Button asChild>
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('goTo', { portalName: portal.name })}
                      <ExternalLink className="h-4 w-4 ml-1.5" />
                      <span className="sr-only"> {t('opensNewWindow')}</span>
                    </a>
                  </Button>

                  {portal.notes && (
                    <p className="text-sm text-muted-foreground mt-3 italic">
                      {portal.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {t('noPortals')}
          </p>
        )}
      </div>
    </section>
  );
}
