'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessibleInput } from '@/components/forms';
import { useScreeningStore } from '@/lib/screening/store';

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

      // Include screening data for migration if available
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
        <p className="text-lg font-medium text-green-800 mb-2">
          Your account has been created.
        </p>
        {success.screeningSaved && (
          <p className="text-gray-700">
            We&apos;ve saved your screening results to your account.
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p className="text-gray-700 text-center mb-6">
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
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-700 hover:underline font-medium">
          Sign in
        </a>
      </p>
    </form>
  );
}
