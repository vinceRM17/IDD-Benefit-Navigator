'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { type Locale, defaultLocale, getMessagesSync } from '@/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

interface LocaleProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState(() => getMessagesSync(defaultLocale));

  useEffect(() => {
    const saved = localStorage.getItem('idd-locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'es')) {
      setLocaleState(saved);
      setMessages(getMessagesSync(saved));
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setMessages(getMessagesSync(newLocale));
    localStorage.setItem('idd-locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
