import Link from 'next/link';
import LandingBackground from '@/components/LandingBackground';
import HomeAuthActions from '@/components/HomeAuthActions';

export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <main
      className="relative min-h-screen bg-[#030607] text-white overflow-hidden selection:bg-[var(--accent)]/20 selection:text-white"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      <LandingBackground />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[700px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(94,234,212,0.07) 0%, transparent 65%)',
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

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Tagline */}
        <div className="mb-6">
          <p 
            className="text-[clamp(14px,2vw,18px)] font-bold tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(90deg, rgba(94,234,212,0.92) 0%, rgba(255,255,255,0.95) 50%, rgba(56,189,248,0.92) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Make The Competition Ours
          </p>
        </div>

        {/* Main title */}
        <h1
          className="text-[clamp(52px,10vw,130px)] font-bold leading-none tracking-tight mb-12"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            paddingBottom: '0.1em'
          }}
        >
          Sagitarius
        </h1>

        <HomeAuthActions />
      </div>

      <Link
        href="https://software.sagitarius.cc"
        rel="noopener noreferrer"
        className="group absolute bottom-5 right-5 z-20 flex h-9 items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/10 backdrop-blur-md transition-all duration-300 hover:border-[var(--accent)]/25 hover:bg-[var(--accent)]/5 hover:text-[var(--accent)] focus-visible:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
        aria-label="Secret software presentation"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/25 transition-colors group-hover:bg-[var(--accent)]" />
        Secret
      </Link>
    </main>
  );
}
