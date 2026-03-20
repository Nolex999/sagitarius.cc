import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileManager from '@/components/dashboard/ProfileManager';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="p-4 md:p-8">
      <ProfileManager />
    </div>
  );
}
