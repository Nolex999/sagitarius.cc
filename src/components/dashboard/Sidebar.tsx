'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Cpu,
  User,
  Crown,
  Shield,
  LogOut,
  Settings,
  Package,
  BarChart3,
  Inbox,
  CreditCard,
  ShieldCheck,
  MessageCircle
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
  { href: '/dashboard/software', label: 'Downloads', icon: Package },
  { href: '/dashboard/get-key', label: 'Get Key', icon: CreditCard },
  { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
  { href: '/dashboard/firmware', label: 'Firmware', icon: Cpu, requiredRole: ['owner', 'admin'] },
  { href: '/dashboard/s3', label: 'Bio Page', icon: User, requiredRole: ['owner', 'admin'] },
  { href: '/dashboard/s7', label: 'Analytics', icon: BarChart3, requiredRole: ['owner', 'admin'] },
  { href: '/dashboard/s4', label: 'Admin', icon: Shield, requiredRole: ['admin', 'owner'] },
  { href: '/dashboard/s5', label: 'Settings', icon: Settings, requiredRole: ['owner'] },
  { href: '/dashboard/policies', label: 'Policies', icon: ShieldCheck },
  { href: '/dashboard/support', label: 'Support', icon: MessageCircle },
];

const OWNER_EMAILS = ['n0lex9999@gmail.com'];
const ADMIN_EMAILS = ['n0lex9999@gmail.com'];

function getUserRole(email?: string, dbRole?: string): UserRole {
  if (dbRole) return dbRole as UserRole;
  if (!email) return 'member';
  const lower = email.toLowerCase();
  if (OWNER_EMAILS.some(e => lower === e.toLowerCase())) return 'owner';
  if (ADMIN_EMAILS.some(e => lower === e.toLowerCase())) return 'admin';
  return 'member';
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === 'owner') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold bg-black text-white border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.08)]">
      <Crown size={8} strokeWidth={2.5} /> Owner
    </span>
  );
  if (role === 'admin') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold border bg-gradient-to-r from-orange-400 to-yellow-600 text-black border-orange-400/20 shadow-[0_0_10px_rgba(255,215,0,0.15)]">
      <Shield size={8} strokeWidth={2.5} /> Admin
    </span>
  );
  return <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Member</span>;
}

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dbRole, setDbRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient();
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
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

  const visibleItems = navItems.filter(item => !item.requiredRole || item.requiredRole.includes(role));

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/[0.04] bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
        {/* LEFT SECTION (Logo) */}
        <div className="w-[200px] flex items-center gap-3">
          <Link href="/dashboard/software" className="flex items-center gap-4 shrink-0 group">
            <div className="flex h-11 w-11 items-center justify-center transition-all group-hover:scale-110">
              <Image src="/logo.svg" alt="Logo" width={28} height={28} className="brightness-125 select-none" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] font-black uppercase tracking-[0.4em] text-white leading-none">SAGITARIUS</span>
            </div>
          </Link>
        </div>

        {/* CENTER SECTION (Navigation) */}
        <nav className="flex-1 flex items-center justify-center gap-6">
          {visibleItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 h-10 px-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 ${isActive ? 'bg-orange-500/15 text-white border border-orange-500/30' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={14} strokeWidth={isActive ? 3 : 1.5} className={isActive ? 'text-orange-400' : ''} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SECTION (Profile & Logout) */}
        <div className="w-[200px] flex justify-end items-center gap-4 pl-4 border-l border-white/10">
          <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-2xl p-1 pr-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/10 font-mono text-sm font-black text-white group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-colors">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <RoleBadge role={role} />
            </div>
          </Link>
          <button onClick={handleLogout} className="p-2.5 rounded-2xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
