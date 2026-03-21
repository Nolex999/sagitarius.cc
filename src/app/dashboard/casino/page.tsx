'use client';

import { createClient } from '@/lib/supabase/client';
import Casino from '@/components/dashboard/Casino';
import { useEffect, useState } from 'react';
import { Loader2, Crown, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CasinoPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
        <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Loading VIP Experience...</p>
      </div>
    );
  }

  const isVip = profile?.role === 'vip' || profile?.role === 'admin' || profile?.role === 'owner';

  if (!isVip) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 text-center backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-40 w-40 bg-[var(--accent)]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10 group-hover:text-[var(--accent)] transition-all duration-700">
              <Crown size={40} strokeWidth={1} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">VIP ACCESS ONLY</h1>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] leading-relaxed">
                The Sagitarius Casino is a premium feature reserved for our most loyal members.<br/>
                Become a VIP to participate in the weekly giveaway.
              </p>
            </div>
            
            <Link 
              href="/dashboard/get-key"
              className="mt-4 px-8 py-3 rounded-xl bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--accent-gold)] transition-all shadow-xl shadow-[var(--accent)]/10"
            >
              UPGRADE TO VIP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col items-center gap-2 mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-[0.3em] text-center flex items-center gap-4">
          <Crown className="text-[var(--accent)]" size={32} />
          VIP CASINO
          <Crown className="text-[var(--accent)]" size={32} />
        </h1>
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] text-center">
          Weekly Ultimate Rewards • Next spin available soon
        </p>
      </div>
      
      <Casino profile={profile} onSpinDone={() => {
        // Refresh profile if needed or handled in Casino component
      }} />
    </div>
  );
}
