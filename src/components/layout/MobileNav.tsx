'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, LogIn, LayoutDashboard } from 'lucide-react';
import { navLinks } from './NavLinks';

interface MobileNavProps {
  email: string | null;
}

export function MobileNav({ email }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('common.nav');

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="p-2 rounded-md text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`absolute left-0 right-0 top-16 bg-primary border-t border-white/10 shadow-lg transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav aria-label="Mobile navigation" className="px-page-x py-3">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              );
            })}

            {/* Auth link */}
            <li className="pt-2 border-t border-white/10 mt-2">
              {email ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
