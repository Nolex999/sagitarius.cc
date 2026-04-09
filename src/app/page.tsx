import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight, ShieldCheck, Lock } from 'lucide-react';
import LandingBackground from '@/components/LandingBackground';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main
      className="relative min-h-screen bg-[#050403] text-white overflow-hidden selection:bg-[#C5A059]/30 font-sans"
      aria-label="Sagitarius — Private software platform"
    >
      <LandingBackground />

      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col items-center justify-center text-center">

        {/* Invite-only badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 animate-fade-in">
          <Lock className="w-3 h-3 text-[#C5A059]" />
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] font-bold uppercase">
            Private &amp; Invite Only
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent animate-fade-in [animation-delay:100ms] drop-shadow-2xl">
          SAGITARIUS<span className="text-[#C5A059]">.CC</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-12 animate-fade-in [animation-delay:200ms] font-light italic leading-relaxed">
          High-performance private software.
          <br />
          Limited slots. Elite performance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:350ms]">
          {session ? (
            <Link
              href="/dashboard/software"
              className="group relative px-12 py-5 bg-[#C5A059] text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,160,89,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-[0.2em] uppercase">
                Access Dashboard
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="group relative px-14 py-5 bg-[#C5A059] text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,160,89,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2 tracking-[0.2em] uppercase">
                  Client Login
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Link>
              <Link
                href="/auth/register"
                className="px-14 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white/20 tracking-[0.2em] uppercase backdrop-blur-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-10 py-8">
        <div className="container mx-auto px-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] tracking-[0.25em] font-bold uppercase">
              Secured &amp; Private
            </span>
          </div>
          <div className="text-[10px] text-gray-700 tracking-[0.25em] font-bold uppercase">
            © 2026 SAGITARIUS.CC — All rights reserved
          </div>
        </div>
      </footer>
    </main>
  );
}
