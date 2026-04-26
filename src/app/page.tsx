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
      className="relative min-h-screen bg-[#050403] text-white overflow-hidden selection:bg-[#C5A059]/30 selection:text-white"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      <LandingBackground />

      {/* Ambient atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute top-[-14%] left-1/2 -translate-x-1/2 w-[1100px] h-[640px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.16) 0%, rgba(197,160,89,0.04) 40%, transparent 70%)',
            filter: 'blur(70px)',
            animation: 'glowPulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle at center, rgba(197,160,89,0.09) 0%, transparent 60%)',
            filter: 'blur(55px)',
            animation: 'glowPulse 11s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.07) 0%, transparent 75%)',
            filter: 'blur(45px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.70) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.022] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Constellation */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.08]" aria-hidden="true">
        <svg
          width="900"
          height="600"
          viewBox="0 0 900 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'blur(0.3px)', animation: 'driftSlow 30s ease-in-out infinite' }}
        >
          {[
            [450, 180], [510, 220], [560, 260], [600, 310], [570, 370],
            [490, 340], [430, 380], [370, 350], [320, 290], [360, 230],
            [420, 250], [480, 280], [540, 300], [480, 200],
          ].map(([cx, cy], i) => (
            <circle
              key={`star-${i}`}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 2 : 1.2}
              fill="#C5A059"
              style={{
                animation: `revealFade 0.5s ease ${1.5 + i * 0.08}s both, starTwinkle 4s ease-in-out ${2 + i * 0.12}s infinite`,
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
              key={`line-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#C5A059"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              style={{ animation: `revealFade 0.4s ease ${2 + i * 0.06}s both` }}
            />
          ))}
        </svg>
      </div>

      {/* Frame corners */}
      <div className="pointer-events-none absolute inset-5 sm:inset-8 z-10 animate-reveal-4" aria-hidden="true">
        <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-[#C5A059]/20 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[#C5A059]/20 rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-[#C5A059]/20 rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-[#C5A059]/20 rounded-br-sm" />
      </div>

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" aria-hidden="true" />
      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent" aria-hidden="true" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 py-6 sm:py-8 flex items-center justify-between animate-reveal-4">
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em' }}
          className="text-[#C5A059]/50 uppercase"
        >
          SGT — MMXXVI
        </span>

        <div className="flex items-center gap-2.5">
          <span className="relative flex h-[5px] w-[5px]">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#C5A059]/30 animate-ping-slow" />
            <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[#C5A059]/80" />
          </span>
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em' }}
            className="text-[#C5A059]/50 uppercase"
          >
            Limited Release
          </span>
        </div>

        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em' }}
          className="text-[#C5A059]/50 uppercase"
        >
          Members Only
        </span>
      </header>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 py-24">
        
        <div className="animate-reveal-1 mb-8">
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.35em' }}
            className="text-[#C5A059]/60 uppercase inline-flex items-center gap-3"
          >
            <span className="inline-block w-8 h-px bg-gradient-to-r from-transparent to-[#C5A059]/40" />
            Series IX
            <span className="inline-block w-8 h-px bg-gradient-to-l from-transparent to-[#C5A059]/40" />
          </span>
        </div>

        <h1 className="animate-reveal-2 mb-1" style={{ lineHeight: 0.9 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.8rem, 12vw, 10.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(160deg, #ffffff 0%, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.55) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              filter: 'drop-shadow(0 0 40px rgba(197,160,89,0.12))',
            }}
          >
            Sagitarius
          </span>
        </h1>

        <div
          className="animate-reveal-2 flex items-center gap-4 mb-10"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C5A059]/30" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
              letterSpacing: '0.45em',
              background: 'linear-gradient(90deg, #C5A059 0%, #f0d59a 25%, #fff 50%, #f0d59a 75%, #C5A059 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmerScan 5s linear 1.5s infinite',
            }}
            className="uppercase"
          >
            .CC
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C5A059]/30" />
        </div>

        <p
          className="animate-reveal-3 max-w-lg mb-12 text-balance"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            lineHeight: 1.8,
            letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Tools built without compromise. Engineered for those who demand silence, precision, and absolute excellence.
          <span
            className="block mt-2 font-medium"
            style={{ color: 'rgba(197,160,89,0.85)' }}
          >
            Crafted in silence. Delivered without noise.
          </span>
        </p>

        <div
          className="animate-line w-32 sm:w-40 h-px mb-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.6), transparent)',
          }}
        />

        <div className="animate-reveal-3 flex flex-col sm:flex-row gap-4 items-center">
          {session ? (
            <Link
              href="/dashboard/software"
              className="group relative overflow-hidden flex items-center gap-3 px-12 py-4 text-[#0a0907] font-semibold rounded-full transition-all duration-500 hover:shadow-[0_0_80px_rgba(197,160,89,0.35)] hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050403]"
              style={{
                background: 'linear-gradient(135deg, #f0d59a 0%, #e2c284 25%, #C5A059 60%, #a07840 100%)',
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                letterSpacing: '0.25em',
                boxShadow: '0 4px 30px rgba(197,160,89,0.20), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
            >
              <span className="relative z-10 uppercase">Enter Dashboard</span>
              <ChevronRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="group relative overflow-hidden flex items-center gap-3 px-12 py-4 text-[#0a0907] font-semibold rounded-full transition-all duration-500 hover:shadow-[0_0_80px_rgba(197,160,89,0.35)] hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050403]"
                style={{
                  background: 'linear-gradient(135deg, #f0d59a 0%, #e2c284 25%, #C5A059 60%, #a07840 100%)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  boxShadow: '0 4px 30px rgba(197,160,89,0.20), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
              >
                <span className="relative z-10 uppercase">Member Login</span>
                <ChevronRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </Link>

              <Link
                href="/auth/register"
                className="group flex items-center gap-2.5 px-12 py-4 rounded-full border transition-all duration-300 hover:border-[#C5A059]/30 hover:bg-[#C5A059]/[0.05] hover:text-white/90 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/40"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '11px',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span className="uppercase">Request Access</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {!session && (
          <div
            className="animate-reveal-4 mt-12 flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9.5px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            <span className="uppercase">Private Network</span>
            <span className="h-px w-6 bg-white/10" />
            <span className="text-[#C5A059]/60 uppercase">By Invitation</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-20 py-6 sm:py-7">
        <div className="container mx-auto px-6 sm:px-8 flex items-center justify-between">
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
