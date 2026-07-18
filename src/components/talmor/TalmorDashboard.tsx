'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SUPABASE_URL = 'https://ovljjdqczqsyozegdbeg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bGpqZHFjenFzeW96ZWdkYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzc1MzYsImV4cCI6MjA4ODkxMzUzNn0.iI1O_0khEVY1BqRG7cEsX31bbpCsolxFJLng9A_vC8k';

interface SessionData {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

interface UserProfile {
  username: string;
  license_key: string;
  plan: string;
  created_at: string;
}

export default function TalmorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'downloads' | 'settings'>('overview');
  const [session, setSession] = useState<SessionData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('talmor_session');
    if (!raw) {
      router.push('/talmor');
      return;
    }

    try {
      const sess: SessionData = JSON.parse(raw);
      setSession(sess);

      // Fetch user profile from Supabase
      fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${sess.user.id}&select=*`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${sess.access_token}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setProfile({
              username: data[0].username || '',
              license_key: data[0].license_key || '',
              plan: data[0].plan || 'Free',
              created_at: data[0].created_at || '',
            });
          }
        })
        .catch(() => {});
    } catch {
      router.push('/talmor');
      return;
    }

    setAuthChecked(true);
  }, [router]);

  function handleSignOut() {
    localStorage.removeItem('talmor_session');
    router.push('/talmor');
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-[13px] text-[#444444]">Loading...</div>
      </main>
    );
  }

  const email = session?.user?.email || 'user';
  const username = profile?.username || email.split('@')[0];
  const plan = profile?.plan || 'Premium';
  const licenseKey = profile?.license_key || 'N/A';
  const maskedKey = licenseKey.length > 10
    ? licenseKey.slice(0, 10) + '-***-***-***'
    : licenseKey;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jul 2026';

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <Link href="/talmor" className="flex items-center gap-3">
            <Image src="/talmor-logo.png" alt="Talmor" width={28} height={28} className="rounded-md" />
            <span className="text-[14px] font-bold tracking-tight text-white/90">Talmor</span>
            <span className="text-[11px] text-[#444444] ml-1">v1.0</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#2a2a2a]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#2ea043] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2ea043]" />
              </span>
              <span className="text-[12px] text-[#666666]">Active</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-[12px] font-medium text-[#666666] hover:text-white px-3 py-1.5 rounded-lg border border-[#2a2a2a] hover:border-[#444444] transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

          {/* Sidebar nav */}
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {([
              ['overview', 'Overview'],
              ['keys', 'License Keys'],
              ['downloads', 'Downloads'],
              ['settings', 'Settings'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-[#111111] border border-[#2a2a2a] text-white'
                    : 'text-[#666666] hover:text-white hover:bg-[#111111]/50'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex flex-col gap-6 min-w-0">

            {/* Overview */}
            {activeTab === 'overview' && (
              <>
                {/* Welcome card */}
                <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-[18px] font-bold text-white mb-1">Welcome back, {username}</h2>
                      <p className="text-[13px] text-[#666666]">Here is your account overview.</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0a0a0c] border border-[#2a2a2a] flex items-center justify-center">
                      <span className="text-[14px] font-bold text-white/60">{username.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Plan', value: plan },
                    { label: 'Status', value: 'Active' },
                    { label: 'Member Since', value: memberSince },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl bg-[#111111] border border-[#2a2a2a] p-5">
                      <span className="text-[11px] font-semibold tracking-wide uppercase text-[#444444] block mb-2">{s.label}</span>
                      <span className="text-[20px] font-bold text-white">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* License info */}
                <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#1a1a1a]">
                    <span className="text-[13px] font-semibold text-white/80">License Details</span>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    {[
                      ['Key', maskedKey],
                      ['Status', 'Active'],
                      ['Product', 'talmor-v1'],
                      ['Expires', 'Never'],
                      ['Email', email],
                    ].map(([k, v], i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                        <span className="text-[12px] text-[#666666]">{k}</span>
                        <span className="text-[12px] text-[#e0e0e0] font-medium font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* License Keys */}
            {activeTab === 'keys' && (
              <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a]">
                  <span className="text-[13px] font-semibold text-white/80">Your License Keys</span>
                </div>
                <div className="p-5">
                  <div className="rounded-xl bg-[#0a0a0c] border border-[#2a2a2a] p-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[13px] font-mono font-semibold text-white truncate">{licenseKey}</span>
                      <span className="text-[11px] text-[#666666]">{plan} &middot; Active</span>
                    </div>
                    <span className="shrink-0 ml-4 px-3 py-1 rounded-lg bg-[#2ea043]/10 border border-[#2ea043]/20 text-[11px] font-semibold text-[#2ea043]">Active</span>
                  </div>
                  <p className="text-[12px] text-[#444444] mt-4 text-center">
                    Need another key? Visit the{' '}
                    <a href="#" className="text-[#666666] hover:text-white underline transition-colors">store</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Downloads */}
            {activeTab === 'downloads' && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#1a1a1a]">
                    <span className="text-[13px] font-semibold text-white/80">Latest Release</span>
                  </div>
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[16px] font-bold text-white">Talmor v1.0.0</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#2ea043]/10 border border-[#2ea043]/20 text-[10px] font-bold text-[#2ea043] tracking-wide">LATEST</span>
                      </div>
                      <p className="text-[12px] text-[#666666]">Released July 2026 &middot; Requires Windows 10+ &middot; x64</p>
                    </div>
                    <button className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#282828] transition-all duration-200 whitespace-nowrap">
                      Download
                    </button>
                  </div>
                </div>

                {/* Changelog */}
                <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-[#1a1a1a]">
                    <span className="text-[13px] font-semibold text-white/80">Changelog</span>
                  </div>
                  <div className="p-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[13px] font-bold text-white">v1.0.0</span>
                        <span className="text-[11px] text-[#444444]">Jul 2026</span>
                      </div>
                      <ul className="flex flex-col gap-1 ml-1">
                        {['Initial release', 'Lua script executor with instant injection', 'Anti-detection bypass for Byfron/Hyperion', 'Multi-instance support', 'Built-in script hub', 'Decompiler (beta)'].map((item, j) => (
                          <li key={j} className="text-[12px] text-[#666666] flex items-start gap-2">
                            <span className="text-[#444444] mt-0.5 shrink-0">&bull;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#1a1a1a]">
                  <span className="text-[13px] font-semibold text-white/80">Account Settings</span>
                </div>
                <div className="p-5 flex flex-col gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full max-w-sm px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                      defaultValue={email}
                      readOnly
                    />
                  </div>
                  <div className="border-t border-[#1a1a1a] pt-5">
                    <span className="text-[12px] font-semibold text-[#f87171]">Danger Zone</span>
                    <p className="text-[12px] text-[#444444] mt-1 mb-3">Permanently delete your account and all associated data.</p>
                    <button className="px-5 py-2 rounded-xl text-[12px] font-semibold text-[#f87171] border border-[#f87171]/20 hover:bg-[#f87171]/5 transition-all duration-200">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
