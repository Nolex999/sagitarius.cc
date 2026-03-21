'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Gift, 
  Star, 
  ChevronDown,
  Timer,
  Crown
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const REWARDS = [
  { id: '1day', label: '1-Day Access', color: 'text-blue-400', bg: 'bg-blue-400/20', icon: Gift, weight: 60 },
  { id: '7day', label: '7-Day Extension', color: 'text-purple-400', bg: 'bg-purple-400/20', icon: Star, weight: 34 },
  { id: '30day', label: '30-Day Premium', color: 'text-[var(--accent)]', bg: 'bg-[var(--accent)]/20', icon: Trophy, weight: 5 },
  { id: 'lifetime', label: 'LIFETIME ACCESS', color: 'text-white', bg: 'bg-white/10', icon: Crown, weight: 1 }
];

export default function Casino({ profile: initialProfile, onSpinDone }: { profile: any, onSpinDone: () => void }) {
  const [profile, setProfile] = useState(initialProfile);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Generate sequence for the CSS animation
  const [sequence, setSequence] = useState<any[]>([]);

  useEffect(() => {
    const fullSequence = Array.from({ length: 100 }).map(() => {
      const rand = Math.random() * 100;
      let cumulativeWeight = 0;
      for (const reward of REWARDS) {
        cumulativeWeight += reward.weight;
        if (rand <= cumulativeWeight) return reward;
      }
      return REWARDS[0];
    });
    setSequence(fullSequence);
  }, []);

  const canSpin = () => {
    if (profile.role === 'super_vip') return true;
    if (!profile.last_casino_spin) return true;
    const lastSpin = new Date(profile.last_casino_spin).getTime();
    const now = new Date().getTime();
    return now - lastSpin >= 7 * 24 * 60 * 60 * 1000;
  };

  const getTimeLeft = () => {
    if (!profile.last_casino_spin) return null;
    const lastSpin = new Date(profile.last_casino_spin).getTime();
    const nextSpin = lastSpin + 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const diff = nextSpin - now;
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h`;
  };

  const handleSpin = async () => {
    if (spinning || !canSpin() || loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Call secure server-side spin function
      const { data, error: rpcError } = await supabase.rpc('spin_casino_wheel');

      if (rpcError) throw rpcError;

      const wonReward = REWARDS.find(r => r.id === data.reward_id) || REWARDS[0];
      const wonKey = data.key;

      // Update sequence visually for the winner
      const targetIndex = 80;
      const newSequence = [...sequence];
      newSequence[targetIndex] = wonReward;
      setSequence(newSequence);

      // Random landing position within the card (center is 0, -70 to +70)
      const randomLandingOffset = Math.floor(Math.random() * 140) - 70;
      const cardWidth = 176; // 160px + 16px margin
      const offset = targetIndex * cardWidth - (scrollRef.current?.offsetWidth || 0) / 2 + cardWidth / 2 + randomLandingOffset;
      setScrollOffset(offset);

      setSpinning(true);
      setResult(null);

      // 2. Start animation (7s)
      setTimeout(async () => {
        setSpinning(false);
        setResult({ ...wonReward, key: wonKey });

        setSuccess(`JACKPOT! You won: ${wonReward.label}. Check your Inbox for your key!`);
        
        // Refresh local profile to update timer
        const { data: profileUpdate } = await supabase.from('profiles').select('*').eq('id', profile.id).single();
        if (profileUpdate) setProfile(profileUpdate);
        
        onSpinDone();
      }, 7000);

    } catch (err: any) {
      console.error('Casino Spin Error:', err);
      setError(err.message || 'Error spinning the wheel');
    } finally {
      setLoading(false);
    }
  };

  const timeLeft = getTimeLeft();

  return (
    <div className="space-y-12">
      {/* SCROLLER AREA */}
      <div className="relative p-10 rounded-[3rem] bg-black/60 border border-white/5 shadow-2xl overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* CENTER INDICATOR (THE PIN) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center">
             <div className="bg-[var(--accent)] h-6 w-1 rounded-b-lg shadow-[0_0_15px_var(--accent)]" />
             <ChevronDown size={24} className="text-[var(--accent)] -mt-1 drop-shadow-[0_0_8px_var(--accent)]" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[50] rotate-180">
             <div className="bg-[var(--accent)] h-6 w-1 rounded-b-lg shadow-[0_0_15px_var(--accent)]" />
        </div>

        {/* THE ITEMS TRACK */}
        <div className="relative h-44 flex items-center overflow-hidden">
          <div 
            ref={scrollRef}
            className={`flex transition-transform duration-[7000ms] ${spinning ? '' : 'transform-none'}`}
            style={{ 
              transform: spinning ? `translateX(-${scrollOffset}px)` : 'translateX(0)',
              transitionTimingFunction: 'cubic-bezier(0.1, 0.45, 0.1, 0.99)'
            }}
          >
            {sequence.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className={`flex-shrink-0 w-40 h-32 mx-2 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-3 transition-colors duration-500 ${spinning ? 'grayscale opacity-50' : 'grayscale-0 opacity-100'}`}
              >
                  <item.icon size={32} className={`${item.color} drop-shadow-[0_0_10px_currentColor]`} />
                  <span className={`text-[8px] font-black uppercase tracking-widest text-center px-2 ${item.color}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OVERLAY SIDES (Fade out effect) */}
        <div className="absolute top-10 bottom-10 left-0 w-40 bg-gradient-to-r from-black via-black/80 to-transparent z-40 pointer-events-none" />
        <div className="absolute top-10 bottom-10 right-0 w-40 bg-gradient-to-l from-black via-black/80 to-transparent z-40 pointer-events-none" />
      </div>

      {/* ACTION AREA */}
      <div className="flex flex-col items-center gap-8">
        {!canSpin() ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 px-8 py-4 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl">
              <Timer className="text-white/20" size={20} />
              <div className="flex flex-col">
                 <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">Next spin in</span>
                 <span className="text-2xl font-black text-white uppercase tracking-widest">{timeLeft}</span>
              </div>
            </div>
            <p className="text-[9px] text-white/10 font-black uppercase tracking-widest">Only one attempt per week allowed for VIPs</p>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute inset-0 bg-[var(--accent)] blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <button
              onClick={handleSpin}
              disabled={spinning || loading}
              className="relative px-16 py-6 rounded-[2rem] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-gold)] text-black font-black uppercase tracking-[0.4em] text-sm overflow-hidden shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-4"
            >
              {spinning ? <Loader2 size={24} className="animate-spin" /> : <Star size={24} fill="currentColor" />}
              TRY YOUR LUCK
            </button>
          </div>
        )}

        {/* RESULT DISPLAY */}
        {result && !spinning && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center gap-3">
             <div className={`p-8 rounded-[3rem] ${result.bg} border-2 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] text-center relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 h-20 w-20 bg-white/5 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <h3 className={`text-2xl font-black uppercase tracking-widest mb-2 ${result.color}`}>JACKPOT!</h3>
                <p className="text-xs text-white uppercase font-black tracking-widest leading-relaxed">
                   You won a <span className={result.color}>{result.label}</span>
                </p>
                {result.key && (
                  <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[10px] text-[var(--accent)] font-bold tracking-widest animate-pulse">
                    CODE: {result.key}
                  </div>
                )}
                <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-4">
                   This key has also been saved in your Dashboard Inbox.
                </p>
             </div>
          </div>
        )}
      </div>

      {/* ALERTS */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[200]">
        {error && (
          <div className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-bottom-4 flex items-center gap-3">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        {success && (
          <div className="px-8 py-4 rounded-2xl bg-[var(--accent)] text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-bottom-4 flex items-center gap-3">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}
      </div>
    </div>
  );
}
