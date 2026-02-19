'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessibleInput } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();

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
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p className="text-muted-foreground text-center mb-6">
        Welcome back
      </p>

      <AccessibleInput
        id="login-email"
        label="Email"
        type="email"
        required
        value={email}
        onChange={setEmail}
        placeholder="your@email.com"
      />

      <AccessibleInput
        id="login-password"
        label="Password"
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
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a href="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
          Create one
        </a>
      </p>
    </form>
  );
}
