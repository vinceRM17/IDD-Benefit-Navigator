'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SiteLogo() {
  const t = useTranslations('common');

  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-primary-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-1 -ml-1"
    >
      <Heart className="h-6 w-6 fill-accent stroke-accent" />
      <span className="text-lg font-heading font-bold tracking-tight">
        {t('nav.appName')}
      </span>
    </Link>
  );
}
