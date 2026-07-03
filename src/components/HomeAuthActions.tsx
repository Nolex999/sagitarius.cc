'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(135deg, #5eead4 0%, #38bdf8 100%)',
        color: '#021013',
        boxShadow: '0 4px 24px rgba(94,234,212,0.22)',
      }}
    >
      {children}
      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

export default function HomeAuthActions() {
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    let mounted = true;

    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (mounted) setIsMember(Boolean(data.session));
      });
    } catch {
      if (mounted) setIsMember(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  if (isMember) {
    return <PrimaryLink href="/dashboard/software">Enter</PrimaryLink>;
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <PrimaryLink href="/auth/register">Request Access</PrimaryLink>
      <Link
        href="/auth/login"
        className="text-xs tracking-widest uppercase transition-colors duration-300 hover:text-white/45"
        style={{ color: 'rgba(255,255,255,0.22)' }}
      >
        Already a member? Sign in
      </Link>
    </div>
  );
}
