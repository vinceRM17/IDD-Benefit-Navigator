'use client';

import React from 'react';
import Link from 'next/link';
import { useScreeningStore } from '@/lib/screening/store';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Shield, CheckCircle2, ListChecks } from 'lucide-react';

const expectIcons = [Clock, ListChecks, CheckCircle2, ArrowRight];

export default function ScreeningPage() {
  const reset = useScreeningStore((state) => state.reset);
  const t = useTranslations('screening.landing');

  const handleStart = () => {
    reset();
  };

  const expectations = [
    { icon: expectIcons[0], text: t('expect1') },
    { icon: expectIcons[1], text: t('expect2') },
    { icon: expectIcons[2], text: t('expect3') },
    { icon: expectIcons[3], text: t('expect4') },
  ];

  return (
    <div className="max-w-3xl mx-auto py-section">
      <div className="text-center mb-section">
        <Badge variant="warm" className="mb-4">{t('badge')}</Badge>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {t('description')}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          {t('noAccountNote')}
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-card-padding">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
            {t('whatToExpect')}
          </h2>
          <ul className="space-y-3">
            {expectations.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" className="text-base px-8" asChild>
          <Link href="/screening/intake/step-1" onClick={handleStart}>
            {t('startButton')}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="mt-section text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>{t('nationwide')}</span>
        </div>
      </div>
    </div>
  );
}
