import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import InteractiveBackground from '@/components/dashboard/InteractiveBackground';
import SplashOverlay from '@/components/SplashOverlay';

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
    <div className="relative min-h-screen">
      <InteractiveBackground />
      <SplashOverlay />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Sidebar user={session.user} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto w-full h-full px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
