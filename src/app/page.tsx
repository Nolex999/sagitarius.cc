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

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Eyebrow */}
        <div className="mb-8">
          <span
            className="text-[11px] tracking-[0.25em] uppercase"
            style={{ color: 'rgba(197,160,89,0.5)' }}
          >
            Members only
          </span>
        </div>

        {/* Main title */}
        <h1
          className="text-[clamp(52px,10vw,130px)] font-bold leading-none tracking-tight mb-12"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.15) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Sagitarius
        </h1>

        {/* Subtle line */}
        <p
          className="text-sm tracking-[0.15em] uppercase mb-14"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          Not for everyone.
        </p>

        {/* CTA */}
        {session ? (
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #C5A059 0%, #a07840 100%)',
              color: '#0a0907',
              boxShadow: '0 4px 24px rgba(197,160,89,0.25)',
            }}
          >
            Enter
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <Link
              href="/auth/register"
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #C5A059 0%, #a07840 100%)',
                color: '#0a0907',
                boxShadow: '0 4px 24px rgba(197,160,89,0.25)',
              }}
            >
              Request Access
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="text-xs tracking-widest uppercase transition-colors duration-300"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              Already a member? Sign in
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-20 py-7">
        <div className="max-w-5xl mx-auto px-8 sm:px-14 flex items-center justify-center">
          <span className="text-white/10 text-xs">© 2026 Sagitarius</span>
        </div>
      </footer>
    </main>
  );
}
