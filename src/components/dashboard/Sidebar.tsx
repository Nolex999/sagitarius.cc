'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Database,
  Cpu,
  Box,
  FolderOpen,
  FileText,
  LogOut,
  User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';

const navItems = [
  { href: '/dashboard/db', label: 'DB', icon: Database },
  { href: '/dashboard/firmware', label: 'Firmware', icon: Cpu },
  { href: '/dashboard/s3', label: 'Section 3', icon: Box },
  { href: '/dashboard/s4', label: 'Section 4', icon: FolderOpen },
  { href: '/dashboard/s5', label: 'Section 5', icon: FileText },
];

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-base)]">
      <div className="flex items-center gap-4 px-6 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 shadow-inner overflow-hidden">
          <Image src="/logo.svg" alt="Logo" width={24} height={24} className="brightness-125 select-none" />
        </div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-primary)]">
          SAGITARIUS.CC
        </span>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-4 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex h-11 items-center gap-4 rounded-xl px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${isActive
                  ? 'bg-white/5 text-white shadow-xl border border-white/10 backdrop-blur-md'
                  : 'text-[var(--text-secondary)] hover:bg-white/[0.03] hover:text-white'
                }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--border)] p-5">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/[0.02] p-3 border border-white/[0.03]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 font-mono text-sm font-bold text-white shadow-lg">
            {user?.email?.[0].toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white tracking-tight">{user?.email?.split('@')[0]}</p>
            <p className="text-[9px] uppercase tracking-widest text-[#555] font-bold">Member</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="group flex h-11 w-full items-center gap-4 rounded-xl px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#444] transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-0.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
