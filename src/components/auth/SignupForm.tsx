'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessibleInput } from '@/components/forms';
import { useScreeningStore } from '@/lib/screening/store';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';

export function SignupForm() {
  const router = useRouter();
  const { formData, results } = useScreeningStore();

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
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
          Your account has been created.
        </p>
        {success.screeningSaved && (
          <p className="text-foreground/80">
            We&apos;ve saved your screening results to your account.
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-4">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p className="text-muted-foreground text-center mb-6">
        Save your progress so you can come back anytime
      </p>

      <AccessibleInput
        id="signup-email"
        label="Email"
        type="email"
        required
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
        placeholder="your@email.com"
      />

      <AccessibleInput
        id="signup-password"
        label="Password"
        type="password"
        required
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
        helpText="At least 8 characters"
      />

      <AccessibleInput
        id="signup-confirm-password"
        label="Confirm Password"
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
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <a href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
          Sign in
        </a>
      </p>
    </form>
  );
}
