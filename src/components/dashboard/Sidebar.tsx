'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Database,
  Cpu,
  User,
  Crown,
  Shield,
  LogOut,
  Settings,
  Package,
  BarChart3,
  Inbox,
  CreditCard
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';

type UserRole = 'owner' | 'admin' | 'vip' | 'high_member' | 'member';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiredRole?: UserRole[];
}

const navItems: NavItem[] = [
  { href: '/dashboard/software', label: 'Software', icon: Package },
  { href: '/dashboard/get-key', label: 'Get Key', icon: CreditCard },
  { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
  { href: '/dashboard/firmware', label: 'Firmware', icon: Cpu },
  { href: '/dashboard/s3', label: 'Bio Page', icon: User, requiredRole: ['owner', 'admin', 'vip', 'high_member'] },
  { href: '/dashboard/s7', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/s4', label: 'Admin', icon: Shield, requiredRole: ['admin', 'owner'] },
  { href: '/dashboard/s5', label: 'Settings', icon: Settings, requiredRole: ['owner'] },
];

// ===== ROLE SYSTEM =====
const OWNER_EMAILS = ['chris@sagitarius.cc', 'chris@nolex.me', 'n0lex9999@gmail.com'];
const ADMIN_EMAILS = ['admin@sagitarius.cc'];

// This should ideally fetch from public.profiles, but keeping sync logic for now
// We will enhance this to fetch the actual role from supabase in the component
function getUserRole(email?: string, dbRole?: string): UserRole {
  if (dbRole) return dbRole as UserRole;
  if (!email) return 'member';
  const lower = email.toLowerCase();
  if (OWNER_EMAILS.some(e => lower === e.toLowerCase())) return 'owner';
  if (ADMIN_EMAILS.some(e => lower === e.toLowerCase())) return 'admin';
  return 'member';
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === 'owner') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold bg-black text-white border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.08)]">
        <Crown size={8} strokeWidth={2.5} />
        Owner
      </span>
    );
  }
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold border"
        style={{
          background: 'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)',
          backgroundSize: '200% 200%',
          animation: 'goldShimmer 3s ease infinite',
          color: '#1a1000',
          borderColor: 'rgba(255, 215, 0, 0.4)',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.15)',
        }}
      >
        <Shield size={8} strokeWidth={2.5} />
        Admin
      </span>
    );
  }
  if (role === 'vip') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold bg-purple-500/20 text-purple-400 border border-purple-500/30">
        VIP
      </span>
    );
  }
  if (role === 'high_member') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
        High Member
      </span>
    );
  }
  return (
    <span className="text-[9px] uppercase tracking-widest text-[#555] font-bold">
      Member
    </span>
  );
}

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dbRole, setDbRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient();
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (data) setDbRole(data.role);
    }
    fetchRole();
  }, [user.id]);

  const role = getUserRole(user?.email, dbRole || undefined);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  // Filter nav items based on role
  const visibleItems = navItems.filter(item => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(role);
  });

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
        {visibleItems.map(({ href, label, icon: Icon, requiredRole }) => {
          const isActive = pathname === href;
          const isRestricted = !!requiredRole;
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
              <span className="flex-1">{label}</span>
              {isRestricted && !isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400/30" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--border)] p-5">
        <div className={`mb-4 flex items-center gap-3 rounded-2xl p-3 border ${
          role === 'owner' 
            ? 'bg-white/[0.03] border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
            : role === 'admin'
              ? 'bg-yellow-500/[0.03] border-yellow-400/[0.08]'
              : 'bg-white/[0.02] border-white/[0.03]'
        }`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold shadow-lg border ${
            role === 'owner'
              ? 'bg-black border-white/20 text-white'
              : role === 'admin'
                ? 'bg-gradient-to-br from-yellow-600/30 to-yellow-900/20 border-yellow-400/20 text-yellow-300'
                : 'bg-gradient-to-br from-white/10 to-transparent border-white/10 text-white'
          }`}>
            {user?.email?.[0].toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white tracking-tight">{user?.email?.split('@')[0]}</p>
            <RoleBadge role={role} />
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

      {/* Gold shimmer animation */}
      <style>{`
        @keyframes goldShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </aside>
  );
}
