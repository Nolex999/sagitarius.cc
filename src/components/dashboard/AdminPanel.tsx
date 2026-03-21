'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Users, 
  Mail, 
  Ticket, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Hash,
  Diamond
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminPanelProps {
  userRole?: 'owner' | 'admin' | string;
}

export default function AdminPanel({ userRole }: AdminPanelProps = {}) {
  const [activeTab, setActiveTab] = useState<'messaging' | 'invites' | 'users'>('messaging');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Messaging State
  const [msgType, setMsgType] = useState<'broadcast' | 'direct'>('broadcast');
  const [targetEmail, setTargetEmail] = useState('');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');

  // Invites State
  const [invites, setInvites] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [maxUses, setMaxUses] = useState(1);

  // Users State
  const [profiles, setProfiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (activeTab === 'invites') {
      fetchInvites();
    } else if (activeTab === 'users') {
      fetchProfiles();
    }
  }, [activeTab]);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inv_code')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setInvites(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
      setSuccess('User role updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const giftInvite = async (userId: string, userEmail: string) => {
    setLoading(true);
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 16; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error: invError } = await supabase
        .from('inv_code')
        .insert({
          code: code,
          max_uses: 1,
          created_by: user?.id,
          assigned_to: userId
        });
      
      if (invError) throw invError;

      // Also send a direct message to inform them
      await supabase.rpc('send_direct_message', {
        p_email: userEmail,
        p_title: 'You received a gift! 🎁',
        p_content: `An administrator has gifted you an invitation code: ${code}. You can find it in your profile or use it to invite a friend.`,
        p_type: 'notification'
      });

      setSuccess(`Invite ${code} gifted to ${userEmail}!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (msgType === 'broadcast') {
        const { error } = await supabase.rpc('broadcast_message', {
          p_title: msgTitle,
          p_content: msgContent,
          p_type: 'notification'
        });
        if (error) throw error;
        setSuccess('Broadcast sent successfully to all users!');
      } else {
        const { error } = await supabase.rpc('send_direct_message', {
          p_email: targetEmail,
          p_title: msgTitle,
          p_content: msgContent,
          p_type: 'notification'
        });
        if (error) throw error;
        setSuccess(`Message sent successfully to ${targetEmail}!`);
      }
      setMsgTitle('');
      setMsgContent('');
      setTargetEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Generate a longer, trully random code (no prefix)
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      if (newCode) {
        code = newCode.trim();
      } else {
        for (let i = 0; i < 16; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      
      const { data, error } = await supabase
        .from('inv_code')
        .insert({
          code: code,
          max_uses: maxUses,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      setInvites([data, ...invites]);
      setNewCode('');
      setMaxUses(1);
      setSuccess('Invite code created successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvite = async (id: string) => {
    try {
      const { error } = await supabase.from('inv_code').delete().eq('id', id);
      if (error) throw error;
      setInvites(invites.filter((inv: any) => inv.id !== id));
      setSuccess('Invite deleted successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('messaging')}
          className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${
            activeTab === 'messaging' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
          }`}
        >
          <Send size={14} />
          Messaging
        </button>
        <button
          onClick={() => setActiveTab('invites')}
          className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${
            activeTab === 'invites' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
          }`}
        >
          <Ticket size={14} />
          Invites
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${
            activeTab === 'users' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
          }`}
        >
          <Users size={14} />
          Users
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] flex items-center gap-2">
          <CheckCircle2 size={14} />
          {success}
        </div>
      )}

      {activeTab === 'messaging' && (
        <form onSubmit={handleSendMessage} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 gap-3 p-2 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
            <button
              type="button"
              onClick={() => setMsgType('broadcast')}
              className={`p-5 rounded-xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                msgType === 'broadcast' 
                  ? 'bg-[var(--accent)]/[0.03] border-[var(--accent)]/20 text-[var(--accent)]' 
                  : 'bg-white/[0.01] border-white/5 text-white/20 hover:border-white/10 hover:text-white/40'
              }`}
            >
              <Users size={20} className={msgType === 'broadcast' ? 'scale-110 shadow-[var(--accent)]/50' : ''} />
              <div className="text-center">
                <span className="block text-[9px] font-black uppercase tracking-[0.3em]">Broadcast</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMsgType('direct')}
              className={`p-5 rounded-xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                msgType === 'direct' 
                  ? 'bg-blue-500/[0.03] border-blue-500/20 text-blue-400' 
                  : 'bg-white/[0.01] border-white/5 text-white/20 hover:border-white/10 hover:text-white/40'
              }`}
            >
              <Mail size={20} className={msgType === 'direct' ? 'scale-110 shadow-blue-500/50' : ''} />
              <div className="text-center">
                <span className="block text-[9px] font-black uppercase tracking-[0.3em]">Direct</span>
              </div>
            </button>
          </div>

          <div className="space-y-3">
            {msgType === 'direct' && (
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="Target User Email..."
                  required
                  value={targetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 h-12 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            )}
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[var(--accent)] transition-colors" size={14} />
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[var(--accent)] transition-colors" size={14} />
              <input
                type="text"
                placeholder="Message Title..."
                required
                value={msgTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMsgTitle(e.target.value)}
                className="w-full bg-white/[0.01] border border-white/5 rounded-xl pl-12 pr-4 h-11 text-[11px] text-white focus:border-[var(--accent)]/30 outline-none transition-all placeholder:text-white/10"
              />
            </div>
            <textarea
              placeholder="Write your message here..."
              required
              rows={3}
              value={msgContent}
              onChange={(e) => setMsgContent(e.target.value)}
              className="w-full bg-white/[0.01] border border-white/5 rounded-xl p-4 text-[11px] text-white focus:border-[var(--accent)]/30 outline-none transition-all resize-none min-h-[100px] placeholder:text-white/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--accent-gold)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {msgType === 'broadcast' ? 'Broadcast' : 'Send Direct Message'}
          </button>
        </form>
      )}

      {activeTab === 'invites' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <form onSubmit={handleCreateInvite} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative group">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Custom Code (optional)"
                  value={newCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCode(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 h-10 text-xs text-white focus:border-[var(--accent)]/50 outline-none transition-all uppercase font-mono tracking-widest"
                />
              </div>
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 h-10 group focus-within:border-[var(--accent)]/50 transition-all">
                <Plus size={16} className="text-white/20 group-focus-within:text-[var(--accent)] transition-colors" />
                <input
                  type="number"
                  min="0"
                  placeholder="Uses"
                  value={maxUses}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxUses(parseInt(e.target.value))}
                  className="w-12 bg-transparent h-full text-xs text-white outline-none font-bold"
                />
                <span className="text-[8px] text-white/20 font-black uppercase tracking-widest border-l border-white/10 pl-2">Uses</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-10 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <Plus size={16} />
              Create Code
            </button>
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-premium">
            {invites.map((inv: any) => (
              <div key={inv.id} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group relative">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    inv.is_active ? 'bg-[var(--accent)]/[0.03] border-[var(--accent)]/10 text-[var(--accent)]/50' : 'bg-red-500/[0.03] border-red-500/10 text-red-500/50'
                  }`}>
                    <Ticket size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] text-white/90 font-bold tracking-wider uppercase truncate">{inv.code}</span>
                      {inv.assigned_to && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest">Gifted</span>
                      )}
                    </div>
                    <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mt-0.5">
                      {inv.current_uses} / {inv.max_uses === 0 ? '∞' : inv.max_uses} used • {new Date(inv.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      const link = `https://sagitarius.cc/claim/${inv.code}`;
                      navigator.clipboard.writeText(link);
                      setSuccess('Claim link copied!');
                    }}
                    className="flex-1 sm:flex-none h-8 px-4 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[var(--accent)]/60 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-black transition-all"
                  >
                    Link
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inv.code);
                      setSuccess('Code copied!');
                    }}
                    className="flex-1 sm:flex-none h-8 px-4 rounded-lg bg-white/[0.02] border border-white/5 text-white/30 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
                  >
                    Code
                  </button>
                  <button
                    onClick={() => deleteInvite(inv.id)}
                    className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-red-500/5 border border-red-500/10 text-red-500/40 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="relative group max-w-md">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[var(--accent)] transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.01] border border-white/5 rounded-xl pl-12 pr-4 h-11 text-[11px] text-white focus:border-[var(--accent)]/30 outline-none transition-all placeholder:text-white/10"
            />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-premium">
            {profiles
              .filter((p: any) => 
                p.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.username?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((profile: any) => (
              <div key={profile.id} className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group relative">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-10 w-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center font-bold text-white/50 uppercase overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <span className="text-xs">{profile.username?.[0] || profile.email?.[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                       <span className="text-[13px] text-white/90 font-bold truncate">{profile.username || 'Anonymous'}</span>
                        <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 ${
                         profile.role === 'owner' ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' :
                         profile.role === 'admin' ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-gold)] text-black border-[var(--accent)]' :
                         profile.role === 'vip' ? 'bg-[#ffd700]/10 text-[#ffd700] border-[#ffd700]/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]' :
                         'bg-white/5 text-white/30 border-white/5'
                       }`}>
                         {profile.role === 'vip' && <Diamond size={8} fill="currentColor" className="animate-pulse" />}
                         {profile.role}
                       </span>
                    </div>
                    <div className="text-[9px] text-white/15 truncate font-mono mt-0.5">{profile.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select 
                    value={profile.role}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateUserRole(profile.id, e.target.value)}
                    className="flex-1 sm:flex-none h-8 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest outline-none focus:border-[var(--accent)]/20 transition-all"
                  >
                    <option value="member">Member</option>
                    <option value="vip">VIP</option>
                    <option value="admin">Admin</option>
                    <option value="owner" disabled>Owner</option>
                  </select>
                  <button
                    onClick={() => giftInvite(profile.id, profile.email)}
                    disabled={loading}
                    className="flex-1 sm:flex-none h-8 px-4 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[var(--accent)]/60 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-black transition-all"
                  >
                    Gift Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
