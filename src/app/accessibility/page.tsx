'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const featureKeys = [
  'keyboard',
  'skipNav',
  'aria',
  'contrast',
  'resize',
  'language',
  'forms',
] as const;

export default function AccessibilityPage() {
  const t = useTranslations('pages.accessibility');

  return (
    <div className="py-section">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </div>

        <Card>
          <CardContent className="px-8 py-10">
            <article aria-label={t('ariaLabel')}>
              <header className="mb-8 pb-6">
                <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
                  {t('title')}
                </h1>
                <Separator className="mt-6" />
              </header>

              <div className="space-y-10 text-lg text-foreground/80 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                    {t('commitment.title')}
                  </h2>
                  <p>{t('commitment.content')}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                    {t('standards.title')}
                  </h2>
                  <p>{t('standards.content')}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                    {t('features.title')}
                  </h2>
                  <ul className="list-disc list-inside space-y-2">
                    {featureKeys.map((key) => (
                      <li key={key}>{t(`features.items.${key}`)}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                    {t('feedback.title')}
                  </h2>
                  <p>{t('feedback.content')}</p>
                </section>
              </div>
            </article>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
