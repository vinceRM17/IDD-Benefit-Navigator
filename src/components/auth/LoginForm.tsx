'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessibleInput } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations('auth.login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else if (res.status === 401) {
        setError(t('invalidCredentials'));
      } else {
        setError(t('genericError'));
      }
    } catch {
      setError(t('genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p className="text-muted-foreground text-center mb-6">
        {t('welcomeBack')}
      </p>

      <AccessibleInput
        id="login-email"
        label={t('email')}
        type="email"
        required
        value={email}
        onChange={setEmail}
        placeholder={t('emailPlaceholder')}
      />

      <AccessibleInput
        id="login-password"
        label={t('password')}
        type="password"
        required
        value={password}
        onChange={setPassword}
      />

      {error && (
        <div role="alert" className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4 mr-1.5" />
        )}
        {isSubmitting ? t('signingIn') : t('signIn')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('noAccount')}{' '}
        <a href="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
          {t('createOne')}
        </a>
      </p>
    </form>
  );
}
