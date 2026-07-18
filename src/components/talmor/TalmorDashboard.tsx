'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function TalmorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'downloads' | 'settings'>('overview');

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
            <Link
              href="/talmor"
              className="text-[12px] font-medium text-[#666666] hover:text-white px-3 py-1.5 rounded-lg border border-[#2a2a2a] hover:border-[#444444] transition-all duration-200"
            >
              Sign Out
            </Link>
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
                      <h2 className="text-[18px] font-bold text-white mb-1">Welcome back</h2>
                      <p className="text-[13px] text-[#666666]">Here is your account overview.</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0a0a0c] border border-[#2a2a2a] flex items-center justify-center">
                      <span className="text-[14px] font-bold text-white/60">U</span>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Plan', value: 'Premium', color: 'text-white' },
                    { label: 'Keys Active', value: '1', color: 'text-white' },
                    { label: 'Member Since', value: 'Jul 2026', color: 'text-white' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl bg-[#111111] border border-[#2a2a2a] p-5">
                      <span className="text-[11px] font-semibold tracking-wide uppercase text-[#444444] block mb-2">{s.label}</span>
                      <span className={`text-[20px] font-bold ${s.color}`}>{s.value}</span>
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
                      ['Key', 'TALMOR-E6FE***-4252-A5F3'],
                      ['Status', 'Active'],
                      ['Product', 'talmor-v1'],
                      ['Expires', 'Never'],
                      ['Max Devices', '3'],
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
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-mono font-semibold text-white">TALMOR-E6FEBC45-4252-A5F3-39F9</span>
                      <span className="text-[11px] text-[#666666]">Premium &middot; Active &middot; 0/3 devices used</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#2ea043]/10 border border-[#2ea043]/20 text-[11px] font-semibold text-[#2ea043]">Active</span>
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
                  <div className="p-5 flex flex-col gap-4">
                    {[
                      { v: 'v1.0.0', date: 'Jul 2026', items: ['Initial release', 'Lua script executor with instant injection', 'Anti-detection bypass for Byfron/Hyperion', 'Multi-instance support', 'Built-in script hub', 'Decompiler (beta)'] },
                    ].map((release, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[13px] font-bold text-white">{release.v}</span>
                          <span className="text-[11px] text-[#444444]">{release.date}</span>
                        </div>
                        <ul className="flex flex-col gap-1 ml-1">
                          {release.items.map((item, j) => (
                            <li key={j} className="text-[12px] text-[#666666] flex items-start gap-2">
                              <span className="text-[#444444] mt-0.5 shrink-0">&bull;</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
                      defaultValue="user@talmor.bz"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Change Password</label>
                    <input
                      type="password"
                      className="w-full max-w-sm px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200 mb-3"
                      placeholder="New password"
                    />
                    <input
                      type="password"
                      className="w-full max-w-sm px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="pt-2">
                    <button className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#282828] transition-all duration-200">
                      Save Changes
                    </button>
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
