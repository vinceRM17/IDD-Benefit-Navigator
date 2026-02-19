'use client';

import React from 'react';
import Link from 'next/link';
import { useScreeningStore } from '@/lib/screening/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Shield, CheckCircle2, ListChecks } from 'lucide-react';

const expectations = [
  { icon: Clock, text: '4-step questionnaire (takes about 5 minutes)' },
  { icon: ListChecks, text: 'Questions about your family, income, and insurance situation' },
  { icon: CheckCircle2, text: 'Personalized results showing which benefits you may qualify for' },
  { icon: ArrowRight, text: 'Step-by-step guidance on what to do next' },
];

export default function ScreeningPage() {
  const reset = useScreeningStore((state) => state.reset);

  const handleStart = () => {
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto py-section">
      <div className="text-center mb-section">
        <Badge variant="warm" className="mb-4">Free & Private</Badge>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          Find Benefits for Your Family
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Answer a few questions about your family&apos;s situation. We&apos;ll help you
          understand which benefits you may qualify for and what to do next.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          No account needed &middot; Your answers stay on your device
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-card-padding">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
            What to expect
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
            Start Screening
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <div className="mt-section text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Available nationwide. Select your state during screening.</span>
        </div>
      </div>
    </div>
  );
}
