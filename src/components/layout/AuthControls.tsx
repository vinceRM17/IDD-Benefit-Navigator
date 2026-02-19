'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogIn, LayoutDashboard, LogOut } from 'lucide-react';

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
      <Button variant="ghost" size="sm" asChild className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
        <Link href="/auth/login">
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-primary-foreground/70 hidden lg:inline mr-1">{email}</span>
      <Button variant="ghost" size="sm" asChild className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        disabled={signingOut}
        className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
      </Button>
    </div>
  );
}
