import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import LandingBackground from '@/components/LandingBackground';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main className="relative min-h-screen bg-[#050403] text-white overflow-hidden selection:bg-[#C5A059]/30 font-sans">
      <LandingBackground />

      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col items-center justify-center text-center">
        {/* Title */}
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent animate-fade-in drop-shadow-2xl">
          SAGITARIUS<span className="text-[#C5A059]">.CC</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-16 animate-fade-in [animation-delay:150ms] font-light italic">
          High-performance private software. 
          Limited slots. Elite performance.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in [animation-delay:300ms]">
          {session ? (
            <Link href="/dashboard/software" className="group relative px-12 py-5 bg-[#C5A059] text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,160,89,0.6)]">
              <span className="relative z-10 flex items-center gap-2 tracking-[0.2em] uppercase">
                ACCESS DASHBOARD <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="group relative px-16 py-6 bg-[#C5A059] text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,160,89,0.6)]">
                <span className="relative z-10 flex items-center gap-2 tracking-[0.2em] uppercase">
                  CLIENT LOGIN
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Link>
              <Link href="/auth/register" className="px-16 py-6 bg-white/5 border border-white/10 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white/20 tracking-[0.2em] uppercase backdrop-blur-sm">
                REGISTER
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full z-10 py-10">
        <div className="container mx-auto px-6 flex flex-col items-center gap-4">
          <div className="text-[10px] text-gray-600 tracking-[0.3em] font-bold uppercase">
            © 2026 SAGITARIUS.CC | PRIVATE & INVITE ONLY
          </div>
        </div>
      </footer>
    </main>
  );
}
