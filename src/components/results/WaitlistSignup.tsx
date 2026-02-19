'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface WaitlistSignupProps {
  stateCode: string;
  stateName: string;
}

export function WaitlistSignup({ stateCode, stateName }: WaitlistSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, stateCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-3">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <p className="text-sm">
          {message || `We'll email you when full ${stateName} coverage is available.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full pl-9 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground text-sm"
          aria-label="Email for waitlist signup"
        />
      </div>
      <Button type="submit" disabled={status === 'loading'} size="sm">
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Notify Me'
        )}
      </Button>
      {status === 'error' && (
        <p className="text-sm text-destructive flex items-center gap-1 sm:col-span-2">
          <AlertCircle className="h-3.5 w-3.5" />
          {message}
        </p>
      )}
    </form>
  );
}
