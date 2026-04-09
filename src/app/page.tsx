import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight, ShieldCheck, Lock, Zap } from 'lucide-react';
import LandingBackground from '@/components/LandingBackground';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main className="relative min-h-screen bg-[#050403] text-white overflow-hidden selection:bg-[#C5A059]/30 font-sans">
      <LandingBackground />

      {/* Ambient gold glow top-center */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#C5A059]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-[#C5A059]/5 blur-[80px]" />
      </div>

      {/* Thin horizontal rule top */}
      <div className="absolute top-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

      {/* Top nav bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-[0.3em] text-[#C5A059] uppercase">SGT</span>
          <span className="w-px h-3 bg-[#C5A059]/30" />
          <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase font-medium">v2.4</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/15 bg-[#C5A059]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] text-[#C5A059]/80 uppercase font-bold">Systems Online</span>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col items-center justify-center text-center">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10 animate-fade-in">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 backdrop-blur-sm">
            <Lock className="w-2.5 h-2.5 text-[#C5A059]" />
            <span className="text-[9px] tracking-[0.35em] text-[#C5A059] font-black uppercase">Private Access Only</span>
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
        </div>

        {/* Title */}
        <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-black tracking-tighter leading-none mb-2 animate-fade-in [animation-delay:100ms]">
          <span className="bg-gradient-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
            SAGITARIUS
          </span>
          <span className="text-[#C5A059]">.CC</span>
        </h1>

        {/* Decorative underline */}
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent mb-10 animate-fade-in [animation-delay:150ms]" />

        {/* Tagline */}
        <p className="text-base md:text-lg text-gray-400 max-w-md mb-4 animate-fade-in [animation-delay:200ms] font-light leading-relaxed">
          High-performance private software engineered for those who demand more.
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-14 animate-fade-in [animation-delay:250ms]">
          {[
            { label: 'Uptime', value: '99.9%' },
            { label: 'Clients', value: 'Invite Only' },
            { label: 'Support', value: '24 / 7' },
          ].map(({ label, value }, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-black text-[#C5A059] tracking-wider">{value}</span>
              <span className="text-[9px] tracking-[0.25em] text-gray-600 uppercase">{label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:350ms]">
          {session ? (
            <Link
              href="/dashboard/software"
              className="group relative px-12 py-5 bg-[#C5A059] text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(197,160,89,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-[0.2em] uppercase text-sm">
                Access Dashboard <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="group relative px-12 py-5 bg-[#C5A059] text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(197,160,89,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2 tracking-[0.2em] uppercase text-sm">
                  Client Login <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Link>
              <Link
                href="/auth/register"
                className="group px-12 py-5 bg-transparent border border-white/10 text-white/70 font-bold rounded-full transition-all hover:bg-white/5 hover:border-[#C5A059]/30 hover:text-white tracking-[0.2em] uppercase text-sm backdrop-blur-sm"
              >
                Request Access
              </Link>
            </>
          )}
        </div>

        {/* Trust line */}
        <div className="flex items-center gap-2 mt-10 animate-fade-in [animation-delay:450ms]">
          <ShieldCheck className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">
            End-to-end encrypted — Zero logs
          </span>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent" />

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-10 py-6">
        <div className="container mx-auto px-8 flex items-center justify-between">
          <span className="text-[9px] text-gray-700 tracking-[0.25em] font-bold uppercase">
            © 2026 SAGITARIUS.CC
          </span>
          <div className="flex items-center gap-1.5">
            <Zap className="w-2.5 h-2.5 text-gray-700" />
            <span className="text-[9px] text-gray-700 tracking-[0.2em] uppercase font-bold">Elite Performance</span>
          </div>
        </div>
      </footer>
    </main>
  );
}