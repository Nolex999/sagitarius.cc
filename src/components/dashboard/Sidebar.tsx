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
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-[var(--border)] bg-[#0d0d0d]">
      <div className="flex items-center gap-2 px-4 py-6">
        <Image src="/logo.svg" alt="Logo" width={32} height={24} />
        <span className="font-mono text-sm font-medium tracking-tight text-[var(--text-primary)]">
          SAGITARIUS.CC
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex h-9 items-center gap-3 rounded px-3 text-sm transition-colors ${isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                  : 'text-[#666] hover:text-[#aaa]'
                }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-3">
        <div className="mb-2 flex items-center gap-2 px-2">
          <User size={14} strokeWidth={1.5} className="text-[var(--text-muted)]" />
          <span className="truncate text-xs text-[var(--text-secondary)]">
            {user?.email ?? '—'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-9 w-full items-center gap-3 rounded px-3 text-sm text-[#666] transition-colors hover:text-[#aaa]"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}
