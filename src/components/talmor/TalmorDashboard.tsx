'use client';

import Link from 'next/link';
import { useState } from 'react';

const SCRIPTS = [
  { name: 'Infinite Yield', desc: 'Powerful admin script with 200+ commands', tag: 'Admin' },
  { name: 'Dark Dex v4', desc: 'Full game explorer and property editor', tag: 'Explorer' },
  { name: 'Remote Spy', desc: 'Monitor and fire remote events in real-time', tag: 'Tools' },
  { name: 'ESP Universal', desc: 'Wallhacks, health bars, and ESP for all games', tag: 'Visual' },
  { name: 'Aimbot Pro', desc: 'Silent aim with configurable FOV and smoothing', tag: 'Combat' },
  { name: 'Speed Hack', desc: 'Custom walkspeed, fly, and noclip toggle', tag: 'Movement' },
];

const TAG_COLORS: Record<string, string> = {
  Admin: 'text-[#5eaaff]',
  Explorer: 'text-[#a78bfa]',
  Tools: 'text-[#fbbf24]',
  Visual: 'text-[#34d399]',
  Combat: 'text-[#f87171]',
  Movement: 'text-[#60a5fa]',
};

export default function TalmorDashboard() {
  const [search, setSearch] = useState('');
  const [selectedScript, setSelectedScript] = useState<number | null>(null);

  const filtered = SCRIPTS.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#2a2a2a] flex items-center justify-center">
              <span className="text-white font-black text-sm">T</span>
            </div>
            <span className="text-[14px] font-bold tracking-tight text-white/90">Talmor</span>
            <span className="text-[11px] text-[#444444] ml-1">v1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#2a2a2a]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#2ea043] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2ea043]" />
              </span>
              <span className="text-[12px] text-[#666666]">Connected</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Main panel */}
          <div className="flex flex-col gap-6">
            {/* Editor */}
            <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-white/80">Script Editor</span>
                  <span className="text-[10px] font-mono text-[#444444] bg-[#0a0a0c] px-2 py-0.5 rounded border border-[#2a2a2a]">Lua</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[12px] font-medium text-[#666666] hover:text-white px-3 py-1.5 rounded-lg border border-[#2a2a2a] hover:border-[#444444] transition-all duration-200">
                    Clear
                  </button>
                  <button className="text-[12px] font-medium text-white px-4 py-1.5 rounded-lg bg-[#2ea043] hover:bg-[#3fb950] transition-all duration-200">
                    Execute
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-64 bg-[#0a0a0c] text-[#e0e0e0] text-[13px] font-mono leading-relaxed p-5 resize-none outline-none placeholder-[#333333]"
                placeholder="-- Write your Lua script here..."
                spellCheck={false}
              />
            </div>

            {/* Script Hub */}
            <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a]">
                <span className="text-[13px] font-semibold text-white/80">Script Hub</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 px-3 py-1.5 rounded-lg bg-[#0a0a0c] border border-[#2a2a2a] text-[12px] text-[#e0e0e0] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] transition-all duration-200"
                  placeholder="Search scripts..."
                />
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedScript(i)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      selectedScript === i
                        ? 'bg-[#0078d4]/[0.06] border-[#0078d4]/30'
                        : 'bg-[#0a0a0c] border-[#1a1a1a] hover:border-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-semibold text-white/90 truncate">{s.name}</span>
                        <span className={`text-[10px] font-bold tracking-wide ${TAG_COLORS[s.tag] || 'text-[#666666]'}`}>{s.tag}</span>
                      </div>
                      <p className="text-[11px] text-[#555555] leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#666666]">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-[12px] text-[#333333] py-6 col-span-2">No scripts found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Status */}
            <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] p-5">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-[#444444] block mb-4">Status</span>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666666]">Connection</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2ea043]" />
                    <span className="text-[12px] text-[#2ea043] font-medium">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666666]">Executor</span>
                  <span className="text-[12px] text-[#666666] font-mono">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666666]">Version</span>
                  <span className="text-[12px] text-[#666666] font-mono">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#666666]">Plan</span>
                  <span className="text-[12px] text-[#e0e0e0] font-semibold">Premium</span>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#1a1a1a]">
                <span className="text-[13px] font-semibold text-white/80">Output</span>
              </div>
              <div className="p-4 h-48 overflow-y-auto">
                <div className="flex flex-col gap-2 font-mono text-[11px]">
                  <p className="text-[#444444]">[system] Ready to execute.</p>
                  <p className="text-[#444444]">[system] Waiting for script input...</p>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] p-5">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-[#444444] block mb-4">Quick Actions</span>
              <div className="flex flex-col gap-2">
                <button className="w-full py-2.5 rounded-xl bg-[#0a0a0c] border border-[#2a2a2a] text-[12px] font-medium text-[#666666] hover:text-white hover:border-[#444444] transition-all duration-200">
                  Attach to Roblox
                </button>
                <button className="w-full py-2.5 rounded-xl bg-[#0a0a0c] border border-[#2a2a2a] text-[12px] font-medium text-[#666666] hover:text-white hover:border-[#444444] transition-all duration-200">
                  Kill Roblox
                </button>
                <button className="w-full py-2.5 rounded-xl bg-[#0a0a0c] border border-[#2a2a2a] text-[12px] font-medium text-[#666666] hover:text-white hover:border-[#444444] transition-all duration-200">
                  Open Executor Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
