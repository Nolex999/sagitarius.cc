'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SUPABASE_URL = 'https://ovljjdqczqsyozegdbeg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bGpqZHFjenFzeW96ZWdkYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDEzOTAsImV4cCI6MjA2ODA3NzM5MH0.ymTqW0bW4s69eQ0G3pYHDI2nK6gP0Mdl4h6sQrWnUz0';

export default function TalmorPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regKey, setRegKey] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error_description || data.msg || data.message || 'Login failed';
        setError(msg);
        setLoading(false);
        return;
      }

      localStorage.setItem('talmor_session', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      }));

      router.push('/talmor/dashboard');
    } catch {
      setError('Cannot reach authentication server.');
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
        },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error_description || data.msg || data.message || 'Registration failed';
        setError(msg);
        setLoading(false);
        return;
      }

      localStorage.setItem('talmor_session', JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      }));

      setSuccess('Account created! Redirecting...');
      setTimeout(() => router.push('/talmor/dashboard'), 1000);
    } catch {
      setError('Cannot reach authentication server.');
      setLoading(false);
    }
  }

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
          <div className="mb-5">
            <Image src="/talmor-logo.png" alt="Talmor" width={56} height={56} className="rounded-2xl" priority />
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight">Talmor</h1>
          <p className="text-[13px] text-[#666666] mt-1.5">Your Lua development environment</p>
        </div>

        {/* Auth card */}
        <div className="rounded-2xl bg-[#111111] border border-[#2a2a2a] p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-7 p-1 rounded-xl bg-[#0a0a0c] border border-[#2a2a2a]">
            <button
              onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#999999]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-[#1a1a1a] text-white shadow-sm'
                  : 'text-[#666666] hover:text-[#999999]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-[#da3633]/10 border border-[#da3633]/20 text-[12px] text-[#f87171] leading-relaxed">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-[#2ea043]/10 border border-[#2ea043]/20 text-[12px] text-[#3fb950] leading-relaxed">
              {success}
            </div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-3 rounded-xl text-[14px] font-semibold text-white bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#282828] active:bg-[#141414] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-[12px] text-[#666666]">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setTab('register'); setError(''); setSuccess(''); }} className="text-white font-semibold hover:underline">Create one</button>
              </p>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-[#6a6a6a] mb-2">Activation Key</label>
                <input
                  type="text"
                  value={regKey}
                  onChange={(e) => setRegKey(e.target.value.toUpperCase())}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#e0e0e0] text-[14px] placeholder-[#3a3a3a] outline-none focus:border-[#0078d4] focus:bg-[#141414] transition-all duration-200 font-mono text-[13px]"
                  placeholder="TALMOR-XXXX-XXXX-XXXX-XXXX"
                />
                <p className="mt-2 text-[11px] text-[#444444] leading-relaxed">
                  Enter your activation key to create an account. Get one from our official store.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full py-3 rounded-xl text-[14px] font-semibold text-white bg-[#1e1e1e] border border-[#2a2a2a] hover:bg-[#282828] active:bg-[#141414] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <p className="text-center text-[12px] text-[#666666]">
                Already have an account?{' '}
                <button type="button" onClick={() => { setTab('login'); setError(''); setSuccess(''); }} className="text-white font-semibold hover:underline">Sign in</button>
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
