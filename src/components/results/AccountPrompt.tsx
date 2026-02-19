'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const DISMISS_KEY = 'idd_account_prompt_dismissed';

/**
 * Gentle, dismissible card prompting anonymous users to create an account.
 * Stored in sessionStorage so it reappears on next visit but stays
 * dismissed during the current session.
 */
export function AccountPrompt() {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash
  const t = useTranslations('results.account');

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    setDismissed(wasDismissed);
  }, []);

  if (dismissed) return null;

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  }

  return (
    <aside
      role="complementary"
      aria-label={t('ariaLabel')}
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-card-padding">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Bookmark className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {t('title')}
              </h3>
              <p className="text-foreground/80 text-sm mb-4">
                {t('description')}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild>
                  <Link href="/auth/signup">
                    {t('createAccount')}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <button
                  onClick={handleDismiss}
                  aria-label={t('continueWithout')}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  {t('continueWithout')}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {t('savedAutomatically')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
