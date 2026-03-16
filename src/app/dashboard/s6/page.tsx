'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SoftwareManager from '@/components/dashboard/SoftwareManager';

const OWNER_EMAILS = ['chris@sagitarius.cc', 'chris@nolex.me', 'n0lex9999@gmail.com'];

export default function S6Page() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !OWNER_EMAILS.some(e => user.email?.toLowerCase() === e.toLowerCase())) {
        router.push('/dashboard/software');
        return;
      }
      setAuthorized(true);
      setLoading(false);
    }
    check();
  }, []);

  if (loading || !authorized) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  return <SoftwareManager />;
}
