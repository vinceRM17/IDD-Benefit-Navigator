import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

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
    <div className="min-h-screen bg-background">
      <DashboardNav userEmail={user.email} />

      {/* Page Content */}
      <main className="max-w-4xl mx-auto px-page-x py-page-y">
        {children}
      </main>
    </div>
  );
}
