'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TalmorPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <main className="relative min-h-screen bg-[#0a0a0c] flex items-center justify-center px-4 overflow-hidden" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>

      {/* Subtle ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,120,212,0.03) 0%, transparent 65%)', filter: 'blur(80px)' }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#111111] border border-[#2a2a2a] flex items-center justify-center mb-5">
            <span className="text-white font-black text-xl tracking-tight">T</span>
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Talmor</h1>
          <p className="text-[13px] text-[#666666] mt-1.5">Your Lua development environment</p>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-7 p-1 rounded-xl bg-[#0a0a0c] border border-[#2a2a2a]">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#999999]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#999999]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Username or Email</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="user@talmor.bz"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
              <Link
                href="/talmor/dashboard"
                className="mt-1 w-full py-3 rounded-xl text-[14px] font-semibold text-white bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#282828] active:bg-[#141414] transition-all duration-200 text-center"
              >
                Sign In
              </Link>
              <p className="text-center text-[12px] text-[#666666]">
                Don&apos;t have an account?{' '}
                <button onClick={() => setTab('register')} className="text-white font-semibold hover:underline">Create one</button>
              </p>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Activation Key</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200 font-mono text-[13px] uppercase"
                  placeholder="TALMOR-XXXX-XXXX-XXXX-XXXX"
                />
                <p className="mt-2 text-[11px] text-[#444444] leading-relaxed">
                  Enter your activation key to create an account. Get one from our official store.
                </p>
              </div>
              <Link
                href="/talmor/dashboard"
                className="mt-1 w-full py-3 rounded-xl text-[14px] font-semibold text-white bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#282828] active:bg-[#141414] transition-all duration-200 text-center"
              >
                Create Account
              </Link>
              <p className="text-center text-[12px] text-[#666666]">
                Already have an account?{' '}
                <button onClick={() => setTab('login')} className="text-white font-semibold hover:underline">Sign in</button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#333333] mt-8">
          &copy; 2026 Sagitarius. All rights reserved.
        </p>
      </div>
    </main>
  );
}
