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
        className="text-blue-700 hover:text-blue-800 font-medium text-sm px-3 py-2 rounded-md hover:bg-blue-50"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 hidden sm:inline">{email}</span>
      <Link
        href="/dashboard"
        className="text-gray-700 hover:text-blue-700 text-sm font-medium px-2 py-1"
      >
        Dashboard
      </Link>
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
      >
        {signingOut ? 'Signing out...' : 'Sign Out'}
      </button>
    </div>
  );
}
