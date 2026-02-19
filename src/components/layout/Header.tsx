import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { AuthControls } from './AuthControls';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavLinks } from './NavLinks';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export async function Header() {
  const user = await getCurrentUser();

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
            <NavLinks />

            <Separator orientation="vertical" className="h-6 bg-white/20 hidden md:block mx-1" />

            <LanguageSwitcher />

            <Separator orientation="vertical" className="h-6 bg-white/20 hidden md:block mx-1" />

            <AuthControls email={user?.email ?? null} />
          </div>
        </div>
      </div>
    </header>
  );
}
