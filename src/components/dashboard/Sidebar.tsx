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
  MessageCircle,
  Menu,
  X
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-[0.2em] font-extrabold border bg-gradient-to-r from-[var(--accent)] to-[var(--accent-gold)] text-black border-[var(--accent)]/20 shadow-[0_0_10px_rgba(197,160,89,0.15)]">
      <Shield size={8} strokeWidth={2.5} /> Admin
    </span>
  );
  return <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Member</span>;
}

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dbRole, setDbRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient();
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data) setDbRole(data.role);
    }
    fetchRole();
  }, [user.id]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const role = getUserRole(user?.email, dbRole || undefined);
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const visibleItems = navItems.filter(item => !item.requiredRole || item.requiredRole.includes(role));

  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-white/[0.04] bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* LEFT SECTION (Logo) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/dashboard/software" className="flex items-center shrink-0 group">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} className="select-none transition-transform group-hover:scale-110" />
            </Link>
          </div>

          {/* CENTER SECTION (Navigation) - Desktop */}
          <nav className="hidden xl:flex items-center justify-center gap-1">
            {visibleItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    isActive 
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} strokeWidth={isActive ? 3 : 1.5} />
                  <span className="hidden min-[1300px]:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SECTION (Profile & Logout) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-xl p-1 pr-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
              <div className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg bg-white/10 font-mono text-sm font-black text-white group-hover:bg-[var(--accent)]/20 group-hover:text-[var(--accent)] transition-colors">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <RoleBadge role={role} />
              </div>
            </Link>
            <button onClick={handleLogout} className="p-2 sm:p-2.5 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[90] xl:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <nav className={`absolute left-0 top-0 bottom-0 w-[280px] bg-[#050505] border-r border-white/5 p-6 flex flex-col gap-2 transition-transform duration-500 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center gap-3 mb-8 px-2">
            <Image src="/logo.svg" alt="Logo" width={28} height={28} className="" />
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-white">SAGITARIUS</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-premium flex flex-col gap-1">
            {visibleItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-4 h-12 px-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    isActive 
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-4">
             <div className="flex items-center gap-3 px-2">
               <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 font-mono text-white text-lg font-black">
                 {user?.email?.[0].toUpperCase()}
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-white font-black uppercase tracking-wider truncate max-w-[150px]">{user?.email}</span>
                 <div className="scale-90 origin-left mt-1">
                   <RoleBadge role={role} />
                 </div>
               </div>
             </div>
             <button 
               onClick={handleLogout}
               className="w-full h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
             >
               <LogOut size={16} />
               Logout
             </button>
          </div>
        </nav>
      </div>
    </>
  );
}
