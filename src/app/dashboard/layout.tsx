import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-900 font-semibold text-lg"
              >
                Benefits Navigator
              </Link>
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  My Results
                </Link>
                <Link
                  href="/dashboard/history"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  History
                </Link>
                <Link
                  href="/dashboard/referrals"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Referrals
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Settings
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <Link
                href="/screening"
                className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[36px]"
              >
                New Screening
              </Link>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="flex sm:hidden items-center gap-2 pb-3">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
            >
              Results
            </Link>
            <Link
              href="/dashboard/history"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
            >
              History
            </Link>
            <Link
              href="/dashboard/referrals"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
            >
              Referrals
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
