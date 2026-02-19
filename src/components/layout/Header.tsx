import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { AuthControls } from './AuthControls';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  currentPath?: string;
}

export async function Header({ currentPath = '/' }: HeaderProps) {
  const user = await getCurrentUser();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/screening', label: 'Start Screening' },
    { href: '/privacy', label: 'Privacy' },
  ];

  return (
    <header role="banner" className="bg-primary shadow-sm">
      <div className="max-w-7xl mx-auto px-page-x">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-1 -ml-1"
          >
            <Heart className="h-6 w-6 fill-accent stroke-accent" />
            <span className="text-lg font-heading font-bold tracking-tight">
              IDD Benefits Navigator
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label="Main navigation" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                        currentPath === link.href
                          ? 'bg-white/15 text-white'
                          : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                      }`}
                      aria-current={currentPath === link.href ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Separator orientation="vertical" className="h-6 bg-white/20 hidden md:block mx-1" />

            <AuthControls email={user?.email ?? null} />
          </div>
        </div>
      </div>
    </header>
  );
}
