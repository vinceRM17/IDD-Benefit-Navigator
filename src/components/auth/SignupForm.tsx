'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessibleInput } from '@/components/forms';
import { useScreeningStore } from '@/lib/screening/store';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SignupForm() {
  const router = useRouter();
  const { formData, results } = useScreeningStore();
  const t = useTranslations('auth.signup');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ screeningSaved: boolean } | null>(null);

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t('emailInvalid');
    }

    if (!password) {
      errors.password = t('passwordRequired');
    } else if (password.length < 8) {
      errors.password = t('passwordMinLength');
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t('passwordsMismatch');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const body: Record<string, unknown> = { email, password };

      if (Object.keys(formData).length > 0 && results) {
        body.screeningData = formData;
        body.screeningResults = results;
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccess({ screeningSaved: data.screeningSaved });
        setTimeout(() => router.push('/dashboard'), 2000);
      } else if (res.status === 409) {
        setError(t('accountExists'));
      } else {
        setError(data.error || t('genericError'));
      }
    } catch {
      setError(t('genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center p-6" role="status">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>
        <p className="text-lg font-heading font-medium text-foreground mb-2">
          {t('accountCreated')}
        </p>
        {success.screeningSaved && (
          <p className="text-foreground/80">
            {t('screeningSaved')}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-4">{t('redirecting')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p className="text-muted-foreground text-center mb-6">
        {t('subtitle')}
      </p>

      <AccessibleInput
        id="signup-email"
        label={t('email')}
        type="email"
        required
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
        placeholder={t('emailPlaceholder')}
      />

      <AccessibleInput
        id="signup-password"
        label={t('password')}
        type="password"
        required
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
        helpText={t('passwordHelp')}
      />

      <AccessibleInput
        id="signup-confirm-password"
        label={t('confirmPassword')}
        type="password"
        required
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={fieldErrors.confirmPassword}
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
          <UserPlus className="h-4 w-4 mr-1.5" />
        )}
        {isSubmitting ? t('creatingAccount') : t('createAccount')}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t('hasAccount')}{' '}
        <a href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
          {t('signIn')}
        </a>
      </p>
    </form>
  );
}
