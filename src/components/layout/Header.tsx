import { getCurrentUser } from '@/lib/auth/session';
import { AuthControls } from './AuthControls';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { NavLinks } from './NavLinks';
import { SiteLogo } from './SiteLogo';
import { Separator } from '@/components/ui/separator';

export async function Header() {
  const user = await getCurrentUser();
  const email = user?.email ?? null;

  return (
    <header role="banner" className="bg-primary shadow-sm relative">
      <div className="max-w-7xl mx-auto px-page-x">
        <div className="flex items-center justify-between h-16">
          <SiteLogo />

          <div className="flex items-center gap-2">
            <NavLinks />

            <Separator orientation="vertical" className="h-6 bg-white/20 hidden md:block mx-1" />

            <LanguageSwitcher />

            <Separator orientation="vertical" className="h-6 bg-white/20 hidden md:block mx-1" />

            <AuthControls email={email} />

            <MobileNav email={email} />
          </div>
        </div>
      </div>
    </header>
  );
}
