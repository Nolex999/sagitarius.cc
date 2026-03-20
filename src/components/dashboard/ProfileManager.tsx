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

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [uploading, setUploading] = useState(false);

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
      setNewUsername(data.username || '');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername.trim() })
        .eq('id', profile.id);

      if (error) throw error;
      setProfile({ ...profile, username: newUsername.trim() });
      setIsEditingUsername(false);
      setSuccess('Username updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setSuccess('Profile picture updated!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchUserInvites = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('inv_code')
        .select('*')
        .or(`created_by.eq.${authUser.id},assigned_to.eq.${authUser.id}`)
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
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
            <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-2 border-orange-500/20 flex items-center justify-center text-3xl font-black text-white shadow-2xl transition-transform group-hover:scale-105 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                profile?.username?.[0].toUpperCase()
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="animate-spin text-orange-500" size={24} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
              {getRoleIcon(profile?.role)}
            </div>
            <input 
              type="file" 
              id="avatar-upload" 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {isEditingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-black focus:outline-none focus:border-orange-500/50"
                    placeholder="New username..."
                    autoFocus
                  />
                  <button onClick={handleUpdateUsername} className="p-2 rounded-xl bg-orange-500 text-black hover:bg-orange-400 transition-colors">
                    <CheckCircle2 size={20} />
                  </button>
                  <button onClick={() => setIsEditingUsername(false)} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
                    <AlertCircle size={20} />
                  </button>
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
                  {profile?.username}
                  <button onClick={() => setIsEditingUsername(true)} className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/20 hover:text-white transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </h1>
              )}
              <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border tracking-[0.2em] shadow-lg ${
                profile?.role === 'owner' ? 'bg-black border-white/20 text-white' :
                profile?.role === 'admin' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                'bg-white/5 border-white/10 text-white/40'
              }`}>
                {profile?.role}
              </span>
            </div>
            <p className="text-white/40 font-mono text-sm tracking-wider">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-bold uppercase tracking-[0.1em]">
                <Calendar size={14} className="text-orange-500/50" />
                Joined {profile?.created_at && !isNaN(new Date(profile.created_at).getTime()) ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40 font-bold uppercase tracking-[0.1em]">
                <Zap size={14} className="text-blue-500/50" />
                ID: {profile?.id?.split('-')[0]}...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* INVITES AREA */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <Ticket className="text-orange-500" size={24} />
            Your Invitations
          </h2>
          <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-widest">
            {invites.length} Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invites.map((inv) => (
            <div key={inv.id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
                <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                  <Hash size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-lg text-white font-black tracking-[0.2em] uppercase">{inv.code}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      inv.is_active ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      {inv.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                    {inv.current_uses} / {inv.max_uses === 0 ? '∞' : inv.max_uses} REDEEMED • {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto">
                  <button
                  onClick={() => copyToClipboard(`https://sagitarius.cc/claim/${inv.code}`, 'Claim link copied!')}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink size={12} />
                  Copy Link
                </button>
                <button
                  onClick={() => copyToClipboard(inv.code, 'Code copied!')}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={12} />
                  Copy Code
                </button>
              </div>
            </div>
          ))}

          {invites.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-white/[0.04] border-dashed">
              <Ticket className="mx-auto mb-4 text-white/5 shadow-2xl" size={64} />
              <h4 className="text-white/40 font-black uppercase tracking-widest text-xs">No personal invites</h4>
              <p className="text-white/10 text-[10px] mt-2 font-mono uppercase">Your requested and assigned invites will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* FEEDBACK OVERLAYS */}
      {success && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl bg-green-500 text-black font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-[200] flex items-center gap-3 font-bold">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-[200] flex items-center gap-3 font-bold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}
