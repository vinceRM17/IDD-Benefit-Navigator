'use client';

import React from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language selection">
      <Globe className="h-4 w-4 text-primary-foreground/70" aria-hidden="true" />
      <button
        onClick={() => setLocale('en')}
        className={`text-sm px-1.5 py-0.5 rounded transition-colors ${
          locale === 'en'
            ? 'text-white font-semibold'
            : 'text-primary-foreground/60 hover:text-primary-foreground'
        }`}
        aria-current={locale === 'en' ? 'true' : undefined}
        aria-label="English"
      >
        EN
      </button>
      <span className="text-primary-foreground/40" aria-hidden="true">|</span>
      <button
        onClick={() => setLocale('es')}
        className={`text-sm px-1.5 py-0.5 rounded transition-colors ${
          locale === 'es'
            ? 'text-white font-semibold'
            : 'text-primary-foreground/60 hover:text-primary-foreground'
        }`}
        aria-current={locale === 'es' ? 'true' : undefined}
        aria-label="Español"
      >
        ES
      </button>
    </div>
  );
}
