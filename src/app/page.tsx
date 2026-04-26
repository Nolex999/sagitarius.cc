import Link from 'next/link';
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

      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[800px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.08) 0%, transparent 65%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.80) 100%)',
          }}
        />
      </div>

      {/* Header */}
      <header
        className="absolute top-0 left-0 right-0 z-20 px-8 sm:px-14 py-8 flex items-center justify-between animate-reveal-1"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C5A059, #a07840)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 10H1L6 1Z" fill="#0a0907" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            className="text-white/70 group-hover:text-white/90 transition-colors duration-300 font-medium text-sm"
            style={{ letterSpacing: '0.02em' }}
          >
            Sagitarius
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-8">
          <Link
            href="#features"
            className="text-white/30 hover:text-white/60 transition-colors duration-300 text-xs"
            style={{ letterSpacing: '0.05em' }}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-white/30 hover:text-white/60 transition-colors duration-300 text-xs"
            style={{ letterSpacing: '0.05em' }}
          >
            Pricing
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {session ? (
            <Link
              href="/dashboard/software"
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-300 text-xs"
              style={{ letterSpacing: '0.05em' }}
            >
              Dashboard
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-white/30 hover:text-white/60 transition-colors duration-300 text-xs"
                style={{ letterSpacing: '0.05em' }}
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-[#C5A059]/30 hover:bg-[#C5A059]/5 transition-all duration-300 text-white/50 hover:text-white/80 text-xs"
                style={{ letterSpacing: '0.05em', backdropFilter: 'blur(12px)' }}
              >
                Get access
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">

        {/* Badge */}
        <div className="animate-reveal-1 mb-8">
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs"
            style={{
              borderColor: 'rgba(197,160,89,0.2)',
              background: 'rgba(197,160,89,0.05)',
              color: 'rgba(197,160,89,0.7)',
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.08em',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/70 animate-pulse" />
            Members only — invite required
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-reveal-2 mb-5" style={{ lineHeight: 0.95 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 11vw, 9.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(175deg, #ffffff 0%, rgba(255,255,255,0.88) 50%, rgba(255,255,255,0.40) 100%)',
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
          style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.45), transparent)' }}
        />

        {/* Subtitle */}
        <p
          className="animate-reveal-3 max-w-md mb-10 leading-relaxed"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.32)',
            fontWeight: 300,
          }}
        >
          Premium software reserved for a select circle.
          <br />
          Built for those who know the difference.
        </p>

        {/* CTAs */}
        <div className="animate-reveal-3 flex flex-col sm:flex-row gap-3 items-center">
          {session ? (
            <Link
              href="/dashboard/software"
              className="group relative overflow-hidden flex items-center gap-2.5 px-9 py-3.5 text-[#0a0907] font-semibold rounded-full transition-all duration-500 hover:shadow-[0_8px_40px_rgba(197,160,89,0.30)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
              style={{
                background: 'linear-gradient(135deg, #f0d59a 0%, #C5A059 55%, #a07840 100%)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                boxShadow: '0 4px 24px rgba(197,160,89,0.18), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <span className="relative z-10">Go to Dashboard</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="group relative overflow-hidden flex items-center gap-2.5 px-9 py-3.5 text-[#0a0907] font-semibold rounded-full transition-all duration-500 hover:shadow-[0_8px_40px_rgba(197,160,89,0.30)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
                style={{
                  background: 'linear-gradient(135deg, #f0d59a 0%, #C5A059 55%, #a07840 100%)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  boxShadow: '0 4px 24px rgba(197,160,89,0.18), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <span className="relative z-10">Sign In</span>
                <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                href="/auth/register"
                className="group flex items-center gap-2 px-9 py-3.5 rounded-full border transition-all duration-300 hover:border-white/15 hover:bg-white/[0.03] active:scale-[0.98] focus:outline-none"
                style={{
                  borderColor: 'rgba(255,255,255,0.07)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.30)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span className="group-hover:text-white/50 transition-colors duration-300">Request Access</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-30 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Scroll hint */}
        <div
          className="animate-reveal-4 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-default"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section label */}
          <div className="flex flex-col items-center mb-16 animate-reveal-1">
            <span
              className="text-[#C5A059]/50 text-xs uppercase mb-4"
              style={{ letterSpacing: '0.2em' }}
            >
              Why Sagitarius
            </span>
            <h2
              className="text-center font-semibold"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.5) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Built different.
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2L16 15H2L9 2Z" stroke="#C5A059" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                  </svg>
                ),
                title: 'Precision',
                desc: 'Every detail engineered with intent. No bloat, no compromise.',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#C5A059" strokeWidth="1.2" fill="none" />
                    <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#C5A059" strokeWidth="1.2" fill="none" />
                    <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#C5A059" strokeWidth="1.2" fill="none" />
                    <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="#C5A059" strokeWidth="1.2" fill="none" />
                  </svg>
                ),
                title: 'Modular',
                desc: 'Pick only what you need. Clean, composable, always up to date.',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="6.5" stroke="#C5A059" strokeWidth="1.2" fill="none" />
                    <path d="M6.5 9L8.5 11L11.5 7" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Exclusive',
                desc: 'Access is earned, not given. Reserved for members who qualify.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group relative p-6 rounded-2xl border transition-all duration-500 hover:border-[#C5A059]/15 hover:bg-[#C5A059]/[0.03]"
                style={{
                  borderColor: 'rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.015)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at top left, rgba(197,160,89,0.06) 0%, transparent 60%)',
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.12)' }}
                  >
                    {icon}
                  </div>
                  <h3
                    className="font-semibold text-white/80 mb-2 text-sm"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {title}
                  </h3>
                  <p className="text-white/30 text-xs leading-relaxed" style={{ fontWeight: 300 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section id="pricing" className="relative z-10 py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">

          {/* Glow behind */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.07) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          <h2
            className="relative font-semibold mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Ready to join?
          </h2>

          <p
            className="relative text-white/30 mb-10 leading-relaxed"
            style={{ fontSize: '14px', fontWeight: 300 }}
          >
            Membership is by invitation only.
            <br />
            Apply and our team will review your request.
          </p>

          <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
            {session ? (
              <Link
                href="/dashboard/software"
                className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-10 py-4 text-[#0a0907] font-semibold rounded-full transition-all duration-500 hover:shadow-[0_8px_50px_rgba(197,160,89,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #f0d59a 0%, #C5A059 55%, #a07840 100%)',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  boxShadow: '0 4px 24px rgba(197,160,89,0.20)',
                }}
              >
                <span className="relative z-10">Open Dashboard</span>
                <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-10 py-4 text-[#0a0907] font-semibold rounded-full transition-all duration-500 hover:shadow-[0_8px_50px_rgba(197,160,89,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #f0d59a 0%, #C5A059 55%, #a07840 100%)',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    boxShadow: '0 4px 24px rgba(197,160,89,0.20)',
                  }}
                >
                  <span className="relative z-10">Request Access</span>
                  <ArrowRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>

                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 px-10 py-4 rounded-full border transition-all duration-300 hover:border-white/15 hover:bg-white/[0.03]"
                  style={{
                    borderColor: 'rgba(255,255,255,0.07)',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  Already a member? Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-20 border-t py-8"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-5xl mx-auto px-8 sm:px-14 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C5A059, #a07840)' }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L11 10H1L6 1Z" fill="#0a0907" />
              </svg>
            </div>
            <span className="text-white/25 text-xs">Sagitarius</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-white/20 hover:text-white/40 transition-colors text-xs">
              Sign in
            </Link>
            <Link href="/auth/register" className="text-white/20 hover:text-white/40 transition-colors text-xs">
              Register
            </Link>
          </div>

          <span className="text-white/15 text-xs">© 2026 Sagitarius. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
