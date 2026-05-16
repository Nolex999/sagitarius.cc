'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import OwnerSettings from '@/components/dashboard/OwnerSettings';
import { Loader2, ShieldAlert } from 'lucide-react';

const OWNER_EMAILS = ['chris@sagitarius.cc', 'chris@nolex.me', 'n0lex9999@gmail.com'];

function isOwner(email?: string): boolean {
  if (!email) return false;
  return OWNER_EMAILS.some(e => email.toLowerCase() === e.toLowerCase());
}

export default function SettingsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOwner() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setAuthorized(isOwner(user?.email));
    }
    checkOwner();
  }, []);

  if (authorized === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
        <ShieldAlert size={24} className="text-red-400/40" />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#333]">
          Access Denied
        </p>
        <p className="text-[10px] text-[var(--text-muted)]">
          This page is restricted to the site owner.
        </p>
      </div>
    );
  }

  return <OwnerSettings />;
}