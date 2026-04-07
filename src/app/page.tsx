import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Shield, Zap, Cpu, MousePointer2, ChevronRight, Binary } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main className="relative min-h-screen bg-[#050403] text-white overflow-hidden selection:bg-[#C5A059]/30 font-sans">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050403]/80 to-[#050403] z-10" />
        <Image 
          src="/hero-bg.png" 
          alt="Sagitarius Hero" 
          fill 
          className="object-cover opacity-60 scale-105 animate-pulse transition-opacity duration-1000"
          style={{ animationDuration: '8s' }}
          priority
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#e2c284] text-xs font-medium tracking-widest uppercase mb-8 animate-fade-in shadow-[0_0_15px_rgba(197,160,89,0.1)]">
          <Zap className="w-3 h-3 fill-current" />
          Powered by EFI Technology
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent animate-fade-in">
          SAGITARIUS<span className="text-[#C5A059]">.CC</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 animate-fade-in [animation-delay:150ms]">
          Precision-engineered private software for the competitive elite. 
          Unmatched performance at the hardware level.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:300ms]">
          {session ? (
            <Link href="/dashboard/software" className="group relative px-8 py-4 bg-[#C5A059] text-black font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(197,160,89,0.4)]">
              <span className="relative z-10 flex items-center gap-2">
                ACCESS DASHBOARD <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="group relative px-8 py-4 bg-[#C5A059] text-black font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(197,160,89,0.4)]">
                <span className="relative z-10 flex items-center gap-2">
                  CLIENT LOGIN <MousePointer2 className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Link>
              <Link href="/auth/register" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-lg transition-all hover:bg-white/10 hover:border-white/20">
                JOIN THE ELITE
              </Link>
            </>
          )}
        </div>

        {/* Stats/Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 w-full max-w-4xl animate-fade-in [animation-delay:450ms]">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">0</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Detections</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-[#e2c284]">Ring 0</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Privilege</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">24/7</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Uptime</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-[#e2c284]">Pre-Boot</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Injection</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 w-full max-w-6xl">
          <FeatureCard 
            icon={<Cpu className="w-6 h-6 text-[#C5A059]" />}
            title="EFI Bootkit Persistence"
            description="Our advanced loader initializes before the operating system, ensuring maximum stealth and stability at the hardware level."
            delay="600ms"
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-[#C5A059]" />}
            title="Pre-Kernel Mapping"
            description="High-performance driver mapping using low-level EFI primitives to bypass modern anti-cheat discovery mechanisms."
            delay="750ms"
          />
          <FeatureCard 
            icon={<Binary className="w-6 h-6 text-[#C5A059]" />}
            title="USB Automation"
            description="Automated deployment system for removable media. Plug in, boot up, and dominate the arena with zero footprint."
            delay="900ms"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-24 py-12 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500 tracking-widest">
            © 2026 SAGITARIUS.CC | PRIVATE SOFTWARE
          </div>
          <div className="flex gap-8 text-xs text-gray-400 font-medium">
            <Link href="#" className="hover:text-[#C5A059] transition-colors">STATUS</Link>
            <Link href="#" className="hover:text-[#C5A059] transition-colors">TOS</Link>
            <Link href="#" className="hover:text-[#C5A059] transition-colors">SUPPORT</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) {
  return (
    <div className={`group p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#C5A059]/20 transition-all hover:bg-white/[0.05] animate-fade-in`} style={{ animationDelay: delay }}>
      <div className="w-12 h-12 rounded-lg bg-[#C5A059]/10 flex items-center justify-center mb-6 ring-1 ring-[#C5A059]/20 group-hover:ring-[#C5A059]/40 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-[#e2c284] transition-colors">{title}</h3>
      <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
        {description}
      </p>
    </div>
  );
}
