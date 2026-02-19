import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-page-x py-section">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-primary stroke-primary" />
              <span className="font-heading font-semibold text-foreground">
                IDD Benefits Navigator
              </span>
            </div>

            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <li>
                  <Link
                    href="/screening"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Start Screening
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <Separator />

          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} IDD Benefits Navigator. Built with care for families.
          </p>
        </div>
      </div>
    </footer>
  );
}
