import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  LayoutDashboard,
  History,
  Send,
  Settings,
  ClipboardList,
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const navLinks = [
    { href: '/dashboard', label: 'My Results', mobileLabel: 'Results', icon: LayoutDashboard },
    { href: '/dashboard/history', label: 'History', mobileLabel: 'History', icon: History },
    { href: '/dashboard/referrals', label: 'Referrals', mobileLabel: 'Referrals', icon: Send },
    { href: '/dashboard/settings', label: 'Settings', mobileLabel: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-page-x">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-foreground font-heading font-semibold text-lg flex items-center gap-2"
              >
                <Heart className="h-5 w-5 text-primary" />
                Benefits Navigator
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
                {user.email}
              </span>
              <Button size="sm" asChild>
                <Link href="/screening">
                  <ClipboardList className="h-4 w-4 mr-1" />
                  New Screening
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

      {/* Page Content */}
      <main className="max-w-4xl mx-auto px-page-x py-page-y">
        {children}
      </main>
    </div>
  );
}
