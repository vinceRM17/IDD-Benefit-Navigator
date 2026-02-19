/**
 * Program Card Component
 * Displays eligibility result with program info, confidence badge, and plain-language description
 * WCAG compliant with proper heading hierarchy and semantic markup
 */

'use client';

import { EnrichedResult } from '@/lib/results/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ExternalLink,
  Phone,
  Info,
  Heart,
  Clock,
  HelpCircle,
  Shield,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProgramCardProps {
  result: EnrichedResult;
}

export function ProgramCard({ result }: ProgramCardProps) {
  const { content, confidence } = result;
  const t = useTranslations('results');

  const getBadge = () => {
    if (confidence === 'likely') {
      return { variant: 'success' as const, text: t('badges.likelyEligible') };
    } else if (confidence === 'possible') {
      return { variant: 'warm' as const, text: t('badges.mayBeEligible') };
    } else {
      return { variant: 'secondary' as const, text: t('badges.unlikely') };
    }
  };

  const badge = getBadge();
  const hasLeftAccent = confidence === 'likely';

  return (
    <Card className={hasLeftAccent ? 'border-l-4 border-l-emerald-500' : ''}>
      <CardContent className="p-card-padding">
        {/* Program name and confidence badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-heading font-semibold text-foreground">{content.name}</h3>
          <Badge variant={badge.variant}>{badge.text}</Badge>
        </div>

        {/* Waitlist info callout */}
        {content.waitlistInfo && (
          <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              <strong>{t('programCard.important')}</strong> {content.waitlistInfo}
            </p>
          </div>
        )}

        {/* Encouragement callout */}
        {content.encouragement && (
          <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3">
            <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{content.encouragement}</p>
          </div>
        )}

        {/* Program description */}
        <p className="text-foreground/80 mb-4">{content.description}</p>

        {/* What it covers */}
        <div className="mb-4">
          <h4 className="font-heading font-semibold text-foreground mb-2">{t('programCard.whatItCovers')}</h4>
          <ul className="list-disc list-inside space-y-1 text-foreground/80">
            {content.whatItCovers.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* While You Wait */}
        {content.whileYouWait && content.whileYouWait.length > 0 && (
          <div className="mb-4 p-4 bg-secondary rounded-lg border border-border">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-2">
                  {t('programCard.whileYouWait')}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                  {content.whileYouWait.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Common Misconceptions */}
        {content.commonMisconceptions && content.commonMisconceptions.length > 0 && (
          <div className="mb-4 p-4 bg-muted rounded-lg border border-border">
            <div className="flex gap-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-2">
                  {t('programCard.thingsFamiliesWonder')}
                </h4>
                <ul className="space-y-2">
                  {content.commonMisconceptions.map((item, index) => (
                    <li key={index} className="text-sm text-foreground/80 flex gap-2">
                      <span className="text-muted-foreground shrink-0" aria-hidden="true">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Application info */}
        <Separator className="my-4" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button asChild>
            <a
              href={content.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('programCard.applyHere')}
              <ExternalLink className="h-4 w-4 ml-1.5" />
            </a>
          </Button>

          <div className="text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {t('programCard.needHelp')}{' '}
              <a
                href={`tel:${content.applicationPhone}`}
                className="font-medium text-primary hover:text-primary/80"
              >
                {content.applicationPhone}
              </a>
            </p>
          </div>
        </div>

        {/* Insurance coordination */}
        {content.insuranceCoordination && (
          <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg flex gap-3">
            <Shield className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-1">
                {t('programCard.aboutYourInsurance')}
              </h4>
              <p className="text-sm text-foreground/80">
                {content.insuranceCoordination}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
