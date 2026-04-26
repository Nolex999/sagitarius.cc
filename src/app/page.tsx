=import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight } from 'lucide-react';
import LandingBackground from '@/components/LandingBackground';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main
      className="relative min-h-screen bg-[#050403] text-white overflow-hidden selection:bg-[#C5A059]/20 selection:text-white"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      <LandingBackground />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[700px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.07) 0%, transparent 65%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.90) 100%)',
          }}
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-8 sm:px-14 py-8 flex items-center justify-between animate-reveal-1">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #C5A059 0%, #a07840 100%)',
              boxShadow: '0 2px 12px rgba(197,160,89,0.20)',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 1.5L10.5 10H1.5L6 1.5Z" fill="#0a0907" />
            </svg>
          </div>
          <span
            className="text-white/50 group-hover:text-white/75 transition-colors duration-500 text-sm font-medium"
            style={{ letterSpacing: '-0.01em' }}
          >
            Sagitarius
          </span>
        </Link>

        {!session && (
          <Link
            href="/auth/login"
            className="text-white/25 hover:text-white/50 transition-colors duration-300 text-xs"
            style={{ letterSpacing: '0.05em' }}
          >
            Sign in
          </Link>
        )}

        {session && (
          <Link
            href="/dashboard/software"
            className="group flex items-center gap-1.5 text-white/25 hover:text-white/50 transition-colors duration-300 text-xs"
            style={{ letterSpacing: '0.05em' }}
          >
            Dashboard
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        )}
      </header>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">

        {/* Eyebrow */}
        <div className="animate-reveal-1 mb-7">
          <span
            className="text-xs uppercase"
            style={{
              color: 'rgba(197,160,89,0.45)',
              letterSpacing: '0.25em',
              fontWeight: 400,
            }}
          >
            Members only
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-reveal-2 mb-7" style={{ lineHeight: 0.95 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4.5rem, 13vw, 11rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.80) 50%, rgba(255,255,255,0.25) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}
          >
            Sagitarius
          </span>
        </h1>

        {/* Divider */}
        <div
          className="animate-line w-12 h-px mb-7"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.45), transparent)',
          }}
        />

        {/* Tagline */}
        <p
          className="animate-reveal-3 mb-12"
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.22)',
            letterSpacing: '0.04em',
            fontWeight: 300,
          }}
        >
          Not for everyone.
        </p>

        {/* CTAs */}
        <div className="animate-reveal-3 flex flex-col sm:flex-row gap-3 items-center">
          {session ? (
            <Link
              href="/dashboard/software"
              className="group relative overflow-hidden flex items-center gap-2.5 px-10 py-3.5 text-[#0a0907] font-medium rounded-full transition-all duration-500 hover:shadow-[0_8px_40px_rgba(197,160,89,0.22)] hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #f0d59a 0%, #C5A059 55%, #a07840 100%)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                boxShadow: '0 4px 24px rgba(197,160,89,0.12), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <span className="relative z-10">Enter</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="group relative overflow-hidden flex items-center gap-2.5 px-10 py-3.5 text-[#0a0907] font-medium rounded-full transition-all duration-500 hover:shadow-[0_8px_40px_rgba(197,160,89,0.22)] hover:scale-[1.02] active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #f0d59a 0%, #C5A059 55%, #a07840 100%)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  boxShadow: '0 4px 24px rgba(197,160,89,0.12), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                <span className="relative z-10">Request Access</span>
                <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                href="/auth/login"
                className="group flex items-center gap-2 px-10 py-3.5 rounded-full border transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02] active:scale-[0.98]"
                style={{
                  borderColor: 'rgba(255,255,255,0.06)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span className="group-hover:text-white/40 transition-colors duration-300">
                  Sign In
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-20 py-7">
        <div className="max-w-5xl mx-auto px-8 sm:px-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C5A059, #a07840)' }}
            >
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <path d="M6 1.5L10.5 10H1.5L6 1.5Z" fill="#0a0907" />
              </svg>
            </div>
            <span className="text-white/15 text-xs">Sagitarius</span>
          </div>
          <span className="text-white/10 text-xs">© 2026</span>
        </div>
      </footer>
    </main>
  );
}
