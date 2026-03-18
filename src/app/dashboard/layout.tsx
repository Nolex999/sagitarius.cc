import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)]">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full h-full px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
