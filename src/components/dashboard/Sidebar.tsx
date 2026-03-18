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
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30">
        VIP
      </span>
    );
  }
  if (role === 'high_member') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold bg-orange-600/10 text-orange-300 border border-orange-500/20">
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
    <header className="sticky top-0 z-[100] w-full border-b border-white/[0.04] bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Logo & Brand */}
        <Link href="/dashboard/software" className="flex items-center gap-4 group shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
            <Image src="/logo.svg" alt="Logo" width={28} height={28} className="brightness-125 select-none" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[11px] font-black uppercase tracking-[0.4em] text-white leading-none">
              SAGITARIUS
            </span>
            <span className="text-[8px] text-orange-500/50 uppercase tracking-[0.3em] font-bold mt-1">
              Dashboard
            </span>
          </div>
        </Link>
        
        {/* Navigation Items */}
        <nav className="flex-1 flex items-center gap-1">
          {visibleItems.map(({ href, label, icon: Icon, requiredRole }) => {
            const isActive = pathname === href;
            const isRestricted = !!requiredRole;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 h-11 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${isActive
                    ? 'bg-white/5 text-white border border-white/10 shadow-lg'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
                  }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-orange-400' : ''} />
                <span>{label}</span>
                {isRestricted && !isActive && (
                  <div className="w-1 h-1 rounded-full bg-orange-500/40" />
                )}
                {isActive && (
                  <div className="absolute -bottom-4 left-4 right-4 h-0.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-4 border-l border-white/[0.08]">
          <div className={`flex items-center gap-3 rounded-2xl p-1.5 pr-4 border transition-all ${
            role === 'owner' 
              ? 'bg-white/[0.03] border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
              : role === 'admin'
                ? 'bg-orange-500/[0.03] border-orange-400/[0.1]'
                : 'bg-white/[0.02] border-white/[0.05]'
          }`}>
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-black shadow-lg border transition-all ${
              role === 'owner'
                ? 'bg-white text-black border-white'
                : role === 'admin'
                  ? 'bg-gradient-to-br from-orange-400 to-yellow-600 border-orange-400 text-white'
                  : 'bg-white/10 border-white/10 text-white'
            }`}>
              {user?.email?.[0].toUpperCase() ?? '?'}
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-white tracking-tight uppercase">{user?.email?.split('@')[0]}</p>
              <RoleBadge role={role} />
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-3 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all group"
            title="Logout"
          >
            <LogOut size={20} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>

      {/* Gold shimmer animation style remains for badges */}
      <style jsx>{`
        @keyframes goldShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </header>
  );
}
