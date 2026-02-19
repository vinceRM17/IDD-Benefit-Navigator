'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const sectionKeys = [
  'whatWeCollect',
  'howWeUseData',
  'anonymousScreening',
  'dataSecurity',
  'accountData',
  'auditLogging',
  'referrals',
  'yourRights',
  'contact',
] as const;

export default function PrivacyPolicyPage() {
  const t = useTranslations('pages.privacy');

  return (
    <div className="py-section">
      <div className="max-w-3xl mx-auto">
        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="px-8 py-10">
            <article aria-label={t('ariaLabel')}>
              <header className="mb-8 pb-6">
                <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
                  {t('title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t('lastUpdated', { date: '2026-02-12' })}
                </p>
                <Separator className="mt-6" />
              </header>

              <div className="mb-10 text-lg text-foreground/80 leading-relaxed">
                <p>{t('intro')}</p>
              </div>

              <div className="space-y-10">
                {sectionKeys.map((key) => (
                  <section key={key} id={key}>
                    <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                      {t(`sections.${key}.title`)}
                    </h2>
                    <div className="text-lg text-foreground/80 leading-relaxed space-y-4 whitespace-pre-line">
                      {t(`sections.${key}.content`)}
                    </div>
                  </section>
                ))}
              </div>

              <Separator className="mt-12 mb-8" />
              <footer>
                <p className="text-sm text-muted-foreground">
                  {t('footer')}{' '}
                  <a
                    href="mailto:privacy@benefits-navigator.example.com"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    {t('contactUs')}
                  </a>
                  .
                </p>
              </footer>
            </article>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
