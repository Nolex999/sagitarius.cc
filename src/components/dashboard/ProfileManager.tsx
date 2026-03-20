'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Calendar, 
  Ticket, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Hash,
  Crown,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfileManager() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
    fetchUserInvites();

    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      if (!authUser) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUserInvites = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('inv_code')
        .select('*')
        .eq('created_by', authUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (err: any) {
      console.error('Error fetching invites:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setSuccess(message);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="text-white" size={24} />;
      case 'admin': return <ShieldCheck className="text-orange-500" size={24} />;
      default: return <User className="text-white/40" size={24} />;
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-white/40 text-sm animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative group">
            <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-2 border-orange-500/20 flex items-center justify-center text-3xl font-black text-white shadow-2xl transition-transform group-hover:scale-105">
              {profile?.username?.[0].toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
              {getRoleIcon(profile?.role)}
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-4">
              {profile?.username}
              <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border tracking-[0.2em] shadow-lg ${
                profile?.role === 'owner' ? 'bg-black border-white/20 text-white' :
                profile?.role === 'admin' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                'bg-white/5 border-white/10 text-white/40'
              }`}>
                {profile?.role}
              </span>
            </h1>
            <p className="text-white/40 font-mono text-sm tracking-wider">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-bold uppercase tracking-[0.1em]">
                <Calendar size={14} className="text-orange-500/50" />
                Joined {new Date(profile?.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-bold uppercase tracking-[0.1em]">
                <Zap size={14} className="text-blue-500/50" />
                ID: {profile?.id.split('-')[0]}...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* STATS AREA */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] space-y-4">
            <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
              <Shield size={14} /> Security Status
            </h3>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
              <span className="text-xs text-white/60 font-medium">Account Protection</span>
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} /> Active
              </span>
            </div>
             <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-xs text-white/60 font-medium">Verified Email</span>
              <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                {user?.email_confirmed_at ? <CheckCircle2 size={12} className="text-green-500" /> : <Loader2 size={12} className="animate-spin" />}
                {user?.email_confirmed_at ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* INVITES AREA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <Ticket className="text-orange-500" size={24} />
              Your Invitations
            </h2>
            <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-widest">
              {invites.length} Available
            </span>
          </div>

          <div className="space-y-4">
            {invites.map((inv) => (
              <div key={inv.id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-6 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                    <Hash size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-lg text-white font-black tracking-widest uppercase">{inv.code}</span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        inv.is_active ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {inv.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                      {inv.current_uses} / {inv.max_uses === 0 ? '∞' : inv.max_uses} REDEEMED • CREATED {new Date(inv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10 w-full md:w-auto">
                   <button
                    onClick={() => copyToClipboard(`https://sagitarius.cc/claim/${inv.code}`, 'Claim link copied!')}
                    className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={12} />
                    Copy Link
                  </button>
                  <button
                    onClick={() => copyToClipboard(inv.code, 'Code copied!')}
                    className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Copy size={12} />
                    Copy Code
                  </button>
                </div>
              </div>
            ))}

            {invites.length === 0 && !loading && (
              <div className="text-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-white/[0.04] border-dashed">
                <Ticket className="mx-auto mb-4 text-white/5 shadow-2xl" size={64} />
                <h4 className="text-white/40 font-black uppercase tracking-widest text-xs">No personal invites</h4>
                <p className="text-white/10 text-[10px] mt-2 font-mono uppercase">You requested and assigned invites will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEEDBACK OVERLAYS */}
      {success && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl bg-green-500 text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-[200] flex items-center gap-3">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-[200] flex items-center gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
