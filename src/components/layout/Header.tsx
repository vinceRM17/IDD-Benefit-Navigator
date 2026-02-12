import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { AuthControls } from './AuthControls';

interface HeaderProps {
  currentPath?: string;
}

export async function Header({ currentPath = '/' }: HeaderProps) {
  const user = await getCurrentUser();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/privacy', label: 'Privacy Policy' },
  ];

  return (
    <header role="banner" className="bg-gradient-to-r from-blue-700 to-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-semibold text-white hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              IDD Benefits Navigator
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <nav aria-label="Main navigation">
              <ul className="flex flex-col md:flex-row gap-2 md:gap-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-blue-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1 inline-block"
                      aria-current={currentPath === link.href ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <AuthControls email={user?.email ?? null} />
          </div>
        </div>
      </div>
    </header>
  );
}
