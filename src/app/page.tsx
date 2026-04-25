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
          className="absolute top-[-8%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.13) 0%, transparent 70%)',
            animation: 'glowPulse 6s ease-in-out infinite',
          }}
        />
        {/* Floor glow */}
        <div
          className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.05) 0%, transparent 70%)' }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Constellation SVG background ── */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.07]">
        <svg
          width="900"
          height="600"
          viewBox="0 0 900 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'blur(0.5px)' }}
        >
          {/* Sagittarius constellation dots */}
          {[
            [450, 180], [510, 220], [560, 260], [600, 310], [570, 370],
            [490, 340], [430, 380], [370, 350], [320, 290], [360, 230],
            [420, 250], [480, 280], [540, 300], [480, 200],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 2 : 1.2}
              fill="#C5A059"
              style={{
                animation: `revealFade 0.5s ease ${1.5 + i * 0.08}s both`,
              }}
            />
          ))}
          {/* Constellation lines */}
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
              strokeOpacity="0.6"
              style={{
                animation: `revealFade 0.4s ease ${2 + i * 0.06}s both`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* ── Top edge line ── */}
      <div className="absolute top-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />

      {/* ── Header nav strip ── */}
      <header className="absolute top-0 left-0 right-0 z-20 px-10 py-6 flex items-center justify-between animate-reveal-4">
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em' }}
          className="text-[#C5A059]/50 uppercase"
        >
          SGT — 2026
        </span>
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em' }}
          className="text-[#C5A059]/50 uppercase"
        >
          Private Software
        </span>
      </header>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">

        {/* Roman numeral / index accent */}
        <div className="animate-reveal-1 mb-8">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.35em',
              color: 'rgba(197,160,89,0.45)',
            }}
            className="uppercase"
          >
            ↑ — IX
          </span>
        </div>

        {/* Main wordmark */}
        <h1 className="animate-reveal-2" style={{ lineHeight: 1, marginBottom: '0.15em' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4.5rem, 14vw, 11rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}
          >
            Sagitarius
          </span>
        </h1>

        {/* .cc suffix with shimmer */}
        <div className="animate-reveal-2" style={{ marginBottom: '2.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.75rem, 2vw, 1.05rem)',
              letterSpacing: '0.45em',
              background: 'linear-gradient(90deg, #C5A059 0%, #e2c284 40%, #C5A059 60%, #a07840 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmerScan 3s linear 1.5s infinite',
            }}
          >
            .CC
          </span>
        </div>

        {/* Decorative rule */}
        <div
          className="animate-line"
          style={{
            width: '120px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.7), transparent)',
            marginBottom: '3rem',
          }}
        />

        {/* Action Buttons */}
        <div
          className="animate-reveal-3 flex flex-col sm:flex-row gap-3 items-center"
        >
          {session ? (
            <Link
              href="/dashboard/software"
              className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 text-black font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_50px_rgba(197,160,89,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #e2c284 0%, #C5A059 60%, #a07840 100%)',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                letterSpacing: '0.22em',
              }}
            >
              <span className="relative z-10 uppercase tracking-widest">Dashboard</span>
              <ChevronRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 text-black font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_50px_rgba(197,160,89,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #e2c284 0%, #C5A059 60%, #a07840 100%)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                }}
              >
                <span className="relative z-10 uppercase">Login</span>
                <ChevronRight className="relative z-10 w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
              </Link>

              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-10 py-4 rounded-full transition-all duration-300 hover:border-[#C5A059]/35 hover:bg-[#C5A059]/5 hover:text-white/90 active:scale-[0.98]"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  color: 'rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="uppercase">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom edge ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent" />

      {/* ── Footer ── */}
      <footer className="absolute bottom-0 w-full z-20 py-5">
        <div className="container mx-auto px-8 flex items-center justify-between">
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em' }}
            className="text-[#C5A059]/25 uppercase"
          >
            Invite Only
          </span>
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em' }}
            className="text-[#C5A059]/25 uppercase"
          >
            © 2026
          </span>
        </div>
      </footer>
    </main>
  );
}