'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AuthControlsProps {
  email: string | null;
}

export function AuthControls({ email }: AuthControlsProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  if (!email) {
    return (
      <Link
        href="/auth/login"
        className="text-white hover:text-blue-100 font-medium text-sm px-3 py-2 rounded-md hover:bg-white/10"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-blue-100 hidden sm:inline">{email}</span>
      <Link
        href="/dashboard"
        className="text-white hover:text-blue-100 text-sm font-medium px-2 py-1"
      >
        Dashboard
      </Link>
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="text-sm text-blue-200 hover:text-white px-2 py-1"
      >
        {signingOut ? 'Signing out...' : 'Sign Out'}
      </button>
    </div>
  );
}
