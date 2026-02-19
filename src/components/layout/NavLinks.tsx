'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/screening', label: 'Start Screening' },
  { href: '/resources/glossary', label: 'Glossary' },
  { href: '/resources/faq', label: 'FAQ' },
  { href: '/privacy', label: 'Privacy' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
