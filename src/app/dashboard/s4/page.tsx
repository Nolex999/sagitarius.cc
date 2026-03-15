'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import AdminPanel from '@/components/dashboard/AdminPanel';
import { Loader2, ShieldAlert } from 'lucide-react';

// Role check emails (same as sidebar)
const OWNER_EMAILS = ['chris@sagitarius.cc', 'chris@nolex.me', 'n0lex9999@gmail.com'];
const ADMIN_EMAILS = ['admin@sagitarius.cc'];

function getUserRole(email?: string): 'owner' | 'admin' | 'member' {
  if (!email) return 'member';
  const lower = email.toLowerCase();
  if (OWNER_EMAILS.some(e => lower === e.toLowerCase())) return 'owner';
  if (ADMIN_EMAILS.some(e => lower === e.toLowerCase())) return 'admin';
  return 'member';
}

export default function S4Page() {
  const [role, setRole] = useState<'owner' | 'admin' | 'member' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userRole = getUserRole(user?.email);
      setRole(userRole);
      setLoading(false);
    }
    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (role !== 'admin' && role !== 'owner') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
        <ShieldAlert size={24} className="text-red-400/40" />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#333]">
          Access Denied
        </p>
        <p className="text-[10px] text-[var(--text-muted)]">
          This page is restricted to administrators.
        </p>
      </div>
    );
  }

  return <AdminPanel userRole={role} />;
}
