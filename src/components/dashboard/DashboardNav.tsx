'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Heart,
  LayoutDashboard,
  History,
  Send,
  Settings,
  ClipboardList,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DashboardNavProps {
  userEmail: string;
}

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const t = useTranslations('dashboard.nav');

  const navLinks = [
    { href: '/dashboard', label: t('myResults'), mobileLabel: t('results'), icon: LayoutDashboard },
    { href: '/dashboard/history', label: t('history'), mobileLabel: t('history'), icon: History },
    { href: '/dashboard/referrals', label: t('referrals'), mobileLabel: t('referrals'), icon: Send },
    { href: '/dashboard/settings', label: t('settings'), mobileLabel: t('settings'), icon: Settings },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-page-x">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-foreground font-heading font-semibold text-lg flex items-center gap-2"
            >
              <Heart className="h-5 w-5 text-primary" />
              {t('appName')}
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
            <Button size="sm" asChild>
              <Link href="/screening">
                <ClipboardList className="h-4 w-4 mr-1" />
                {t('newScreening')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex sm:hidden items-center gap-1 pb-3 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium px-3 py-2 rounded-md hover:bg-muted/50 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5" />
                {link.mobileLabel}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
