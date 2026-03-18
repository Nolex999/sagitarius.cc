'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Ticket, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function ClaimPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (code) {
      validateCode();
    }
  }, [code]);

  const validateCode = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.rpc('validate_invite_code', {
        p_code: code.trim(),
      });

      if (data?.valid) {
        setIsValid(true);
      } else {
        setError('This invitation code is invalid or has already been used.');
      }
    } catch (err) {
      setError('An error occurred while validating the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = () => {
    setClaiming(true);
    // Smooth transition
    setTimeout(() => {
      router.push(`/auth/register?code=${code.trim()}`);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-base)] gap-4">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Validating Invitation...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] p-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center space-y-6">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={120}
            height={100}
            className="mx-auto brightness-125"
            priority
          />
          <div className="space-y-1">
             <h1 className="font-mono text-2xl font-black tracking-[0.2em] text-white">
               SAGITARIUS.CC
             </h1>
             <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Private Software Community</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative flex flex-col items-center text-center p-10 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl">
            {error ? (
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto text-red-500">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white">Oops!</h2>
                  <p className="text-sm text-white/40 leading-relaxed">{error}</p>
                </div>
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all font-mono"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <div className="space-y-8 w-full">
                <div className="h-20 w-20 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto text-orange-400 group-hover:scale-110 transition-transform duration-500">
                  <Ticket size={40} strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">Personal Invitation</h2>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Hello, here is your invitation to join our exclusive community.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-xs text-white/60 tracking-wider">
                  {code.substring(0, 8)}••••••••••••
                </div>

                <button 
                  onClick={handleClaim}
                  disabled={claiming}
                  className="group/btn relative w-full h-14 rounded-xl overflow-hidden bg-white text-black text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {claiming ? (
                    <Loader2 size={18} className="animate-spin mx-auto" />
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      Claim Invitation
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
                
                <p className="text-[9px] text-white/10 uppercase font-bold tracking-widest">
                  Secure Token Validation • One-time use
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
