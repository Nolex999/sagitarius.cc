import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import LandingBackground from '@/components/LandingBackground';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main
      className="relative min-h-screen bg-[#050403] text-white overflow-hidden selection:bg-[#C5A059]/30"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      <LandingBackground />

      {/* ── Ambient atmosphere ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Core glow */}
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[560px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(197,160,89,0.16) 0%, rgba(197,160,89,0.04) 40%, transparent 70%)',
            animation: 'glowPulse 7s ease-in-out infinite',
          }}
        />
        {/* Secondary glow (dimensionality) */}
        <div
          className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle at center, rgba(197,160,89,0.08) 0%, transparent 60%)',
            animation: 'glowPulse 9s ease-in-out infinite reverse',
          }}
        />
        {/* Floor glow */}
        <div
          className="absolute bottom-[-8%] left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(197,160,89,0.07) 0%, transparent 70%)',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Constellation SVG ── */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.09]">
        <svg
          width="900"
          height="600"
          viewBox="0 0 900 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'blur(0.4px)',
            animation: 'driftSlow 30s ease-in-out infinite',
          }}
        >
          {[
            [450, 180], [510, 220], [560, 260], [600, 310], [570, 370],
            [490, 340], [430, 380], [370, 350], [320, 290], [360, 230],
            [420, 250], [480, 280], [540, 300], [480, 200],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 2.2 : 1.3}
              fill="#C5A059"
              style={{
                animation: `revealFade 0.5s ease ${1.5 + i * 0.08}s both, starTwinkle 4s ease-in-out ${2 + i * 0.1}s infinite`,
              }}
            />
          ))}
          {[
            [450,180, 510,220], [510,220, 560,260], [560,260, 600,310],
            [600,310, 570,370], [570,370, 490,340], [490,340, 430,380],
            [430,380, 370,350], [370,350, 320,290], [320,290, 360,230],
            [360,230, 420,250], [420,250, 490,340], [420,250, 480,200],
            [480,200, 450,180],
          ].map(([x1,y1,x2,y2], i) => (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#C5A059"
              strokeWidth="0.6"
              strokeOpacity="0.55"
              style={{ animation: `revealFade 0.4s ease ${2 + i * 0.06}s both` }}
            />
          ))}
        </svg>
      </div>

      {/* ── HUD corner brackets ── */}
      <div className="pointer-events-none absolute inset-6 z-10 animate-reveal-4">
        {/* Top-left */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C5A059]/30" />
        {/* Top-right */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#C5A059]/30" />
        {/* Bottom-left */}
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#C5A059]/30" />
        {/* Bottom-right */}
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C5A059]/30" />
      </div>

      {/* ── Top edge line ── */}
      <div className="absolute top-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

      {/* ── Header ── */}
      <header className="absolute top-0 left-0 right-0 z-20 px-10 py-6 flex items-center justify-between animate-reveal-4">
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em' }}
          className="text-[#C5A059]/55 uppercase"
        >
          SGT — 2026
        </span>

        {/* System status indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
          </span>
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em' }}
            className="text-[#C5A059]/55 uppercase"
          >
            System Online
          </span>
        </div>

        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em' }}
          className="text-[#C5A059]/55 uppercase"
        >
          Private Software
        </span>
      </header>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">

        {/* Index accent */}
        <div className="animate-reveal-1 mb-7">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.4em',
              color: 'rgba(197,160,89,0.5)',
            }}
            className="uppercase inline-flex items-center gap-2"
          >
            <span className="inline-block w-6 h-px bg-[#C5A059]/40" />
            ↑ — IX
            <span className="inline-block w-6 h-px bg-[#C5A059]/40" />
          </span>
        </div>

        {/* Wordmark */}
        <h1 className="animate-reveal-2" style={{ lineHeight: 1, marginBottom: '0.2em' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4.5rem, 14vw, 11.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              background:
                'linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.45) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              textShadow: '0 0 80px rgba(197,160,89,0.15)',
            }}
          >
            Sagitarius
          </span>
        </h1>

        {/* .CC suffix */}
        <div
          className="animate-reveal-2 flex items-center gap-3"
          style={{ marginBottom: '1.5rem' }}
        >
          <span className="h-px w-8 bg-[#C5A059]/30" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.75rem, 2vw, 1.05rem)',
              letterSpacing: '0.5em',
              background:
                'linear-gradient(90deg, #C5A059 0%, #e2c284 40%, #fff3d4 50%, #e2c284 60%, #C5A059 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmerScan 4s linear 1.5s infinite',
            }}
          >
            .CC
          </span>
          <span className="h-px w-8 bg-[#C5A059]/30" />
        </div>

        {/* Tagline */}
        <p
          className="animate-reveal-3 max-w-md mb-10"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            lineHeight: 1.7,
            letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Precision-engineered software for those who demand more.
          <br />
          <span style={{ color: 'rgba(197,160,89,0.7)' }}>
            Crafted in silence. Delivered in excellence.
          </span>
        </p>

        {/* Decorative rule */}
        <div
          className="animate-line"
          style={{
            width: '140px',
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(197,160,89,0.7), transparent)',
            marginBottom: '2.5rem',
          }}
        />

        {/* Buttons */}
        <div className="animate-reveal-3 flex flex-col sm:flex-row gap-3 items-center">
          {session ? (
            <Link
              href="/dashboard/software"
              className="group relative overflow-hidden flex items-center gap-3 px-11 py-4 text-black font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_60px_rgba(197,160,89,0.45)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/60 focus:ring-offset-2 focus:ring-offset-[#050403]"
              style={{
                background:
                  'linear-gradient(135deg, #f0d59a 0%, #e2c284 30%, #C5A059 65%, #a07840 100%)',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                letterSpacing: '0.25em',
                boxShadow:
                  '0 4px 24px rgba(197,160,89,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <span className="relative z-10 uppercase">Enter Dashboard</span>
              <ChevronRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="group relative overflow-hidden flex items-center gap-3 px-11 py-4 text-black font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_60px_rgba(197,160,89,0.45)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/60 focus:ring-offset-2 focus:ring-offset-[#050403]"
                style={{
                  background:
                    'linear-gradient(135deg, #f0d59a 0%, #e2c284 30%, #C5A059 65%, #a07840 100%)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  boxShadow:
                    '0 4px 24px rgba(197,160,89,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                <span className="relative z-10 uppercase">Login</span>
                <ChevronRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                href="/auth/register"
                className="group flex items-center gap-2 px-11 py-4 rounded-full transition-all duration-300 hover:border-[#C5A059]/40 hover:bg-[#C5A059]/[0.06] hover:text-white/95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255,255,255,0.015)',
                }}
              >
                <span className="uppercase">Request Access</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Scarcity indicator */}
        {!session && (
          <div
            className="animate-reveal-4 mt-10 flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9.5px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            <span className="uppercase">Membership</span>
            <span className="h-px w-6 bg-white/15" />
            <span className="text-[#C5A059]/70 uppercase">By Invitation</span>
          </div>
        )}
      </div>

      {/* ── Bottom edge ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />

      {/* ── Footer ── */}
      <footer className="absolute bottom-0 w-full z-20 py-5">
        <div className="container mx-auto px-8 flex items-center justify-between">
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em' }}
            className="text-[#C5A059]/30 uppercase"
          >
            18°S · 64°E
          </span>
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em' }}
            className="text-[#C5A059]/30 uppercase"
          >
            Invite Only
          </span>
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em' }}
            className="text-[#C5A059]/30 uppercase"
          >
            © MMXXVI
          </span>
        </div>
      </footer>
    </main>
  );
}
