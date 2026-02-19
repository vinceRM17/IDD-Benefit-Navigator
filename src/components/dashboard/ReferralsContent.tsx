'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Plus, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ReferralData {
  id: number;
  partnerName: string;
  sentAt: string;
  viewedAt: string | null;
  status: string;
}

interface ReferralsContentProps {
  referrals: ReferralData[];
}

export function ReferralsContent({ referrals }: ReferralsContentProps) {
  const t = useTranslations('dashboard.referrals');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">{t('title')}</h1>
        <Button size="sm" asChild>
          <Link href="/referral">
            <Plus className="h-4 w-4 mr-1" />
            {t('newReferral')}
          </Link>
        </Button>
      </div>

      {referrals.length === 0 ? (
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              {t('noReferrals')}
            </p>
            <Button asChild>
              <Link href="/referral">
                {t('submitFirst')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => {
            const sentDate = new Date(referral.sentAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            const viewedDate = referral.viewedAt
              ? new Date(referral.viewedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null;

            return (
              <Card key={referral.id}>
                <CardContent className="p-card-padding">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-lg font-heading font-semibold text-foreground">
                        {referral.partnerName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t('sentOn', { date: sentDate })}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {referral.status === 'viewed' ? (
                        <Badge variant="success">{t('viewed')}</Badge>
                      ) : (
                        <Badge variant="warm">{t('sent')}</Badge>
                      )}
                    </div>
                  </div>

                  {viewedDate && (
                    <p className="text-sm text-muted-foreground">
                      {t('openedOn', { date: viewedDate })}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Separator className="mt-8" />
      <p className="text-sm text-muted-foreground">
        {t('questionsAbout')}{' '}
        <Link href="/contact" className="text-primary hover:text-primary/80">
          {t('contactUs')}
        </Link>
        .
      </p>
    </div>
  );
}
