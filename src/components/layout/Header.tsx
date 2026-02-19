import { getCurrentUser } from '@/lib/auth/session';
import { AuthControls } from './AuthControls';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavLinks } from './NavLinks';
import { SiteLogo } from './SiteLogo';
import { Separator } from '@/components/ui/separator';

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header role="banner" className="bg-primary shadow-sm">
      <div className="max-w-7xl mx-auto px-page-x">
        <div className="flex items-center justify-between h-16">
          <SiteLogo />

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
