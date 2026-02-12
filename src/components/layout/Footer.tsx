import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-blue-50 border-t border-blue-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} IDD Benefits Navigator. All rights reserved.
          </p>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-gray-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 inline-block"
                >
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
