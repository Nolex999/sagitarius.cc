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
  Hash
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminPanelProps {
  userRole?: 'owner' | 'admin' | string;
}

export default function AdminPanel({ userRole }: AdminPanelProps = {}) {
  const [activeTab, setActiveTab] = useState<'messaging' | 'invites'>('messaging');
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

  const supabase = createClient();

  useEffect(() => {
    if (activeTab === 'invites') {
      fetchInvites();
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
      const code = newCode || 'SAG-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const { data, error } = await supabase
        .from('inv_code')
        .insert({
          code: code.trim(),
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
    if (!confirm('Delete this invite code?')) return;
    try {
      const { error } = await supabase.from('inv_code').delete().eq('id', id);
      if (error) throw error;
      setInvites(invites.filter((inv: any) => inv.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('messaging')}
          className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'messaging' ? 'bg-orange-500 text-black' : 'text-white/40 hover:text-white'
          }`}
        >
          <Send size={14} />
          Messaging
        </button>
        <button
          onClick={() => setActiveTab('invites')}
          className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'invites' ? 'bg-orange-500 text-black' : 'text-white/40 hover:text-white'
          }`}
        >
          <Ticket size={14} />
          Invite Codes
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
            <button
              type="button"
              onClick={() => setMsgType('broadcast')}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                msgType === 'broadcast' 
                  ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' 
                  : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              <Users size={28} className={msgType === 'broadcast' ? 'scale-110' : ''} />
              <div className="text-center">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Broadcast All</span>
                <span className="text-[9px] text-white/20 font-medium">Send to every registered user</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMsgType('direct')}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                msgType === 'direct' 
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                  : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              <Mail size={28} className={msgType === 'direct' ? 'scale-110' : ''} />
              <div className="text-center">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Direct Message</span>
                <span className="text-[9px] text-white/20 font-medium">Target a specific user by email</span>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            {msgType === 'direct' && (
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Target User Email..."
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 h-14 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                />
              </div>
            )}
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Message Title..."
                required
                value={msgTitle}
                onChange={(e) => setMsgTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 h-14 text-sm text-white focus:border-orange-500/50 outline-none transition-all"
              />
            </div>
            <textarea
              placeholder="Write your message here..."
              required
              rows={5}
              value={msgContent}
              onChange={(e) => setMsgContent(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-orange-500/50 outline-none transition-all resize-none min-h-[150px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-orange-500 text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-orange-400 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(249,115,22,0.15)]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {msgType === 'broadcast' ? 'Broadcast to Everyone' : 'Send Direct Message'}
          </button>
        </form>
      )}

      {activeTab === 'invites' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <form onSubmit={handleCreateInvite} className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Custom Code (optional)"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 h-12 text-sm text-white focus:border-orange-500/50 outline-none transition-all uppercase font-mono tracking-widest"
              />
            </div>
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 h-12 group focus-within:border-orange-500/50 transition-all">
              <Plus size={18} className="text-white/20 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="number"
                min="0"
                placeholder="Uses"
                value={maxUses}
                onChange={(e) => setMaxUses(parseInt(e.target.value))}
                className="w-16 bg-transparent h-full text-sm text-white outline-none font-bold"
                title="Max Uses (0 for unlimited)"
              />
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest border-l border-white/10 pl-3">Uses</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-8 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg active:scale-95"
            >
              <Plus size={18} />
              Create Code
            </button>
          </form>

          <div className="grid grid-cols-1 gap-4">
            {invites.map((inv: any) => (
              <div key={inv.id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    inv.is_active ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    <Ticket size={32} />
                  </div>
                  
                  <div className="text-center md:text-left flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <span className="font-mono text-xl md:text-2xl text-white font-black tracking-[0.2em] uppercase select-all">
                        {inv.code}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                        inv.is_active 
                          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {inv.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2"><Hash size={14} className="text-white/10" /> {inv.current_uses} / {inv.max_uses === 0 ? '∞' : inv.max_uses} REDEEMED</span>
                      <span className="h-1 w-1 rounded-full bg-white/10 hidden md:block" />
                      <span className="flex items-center gap-2"><Calendar size={14} className="text-white/10" /> CREATED {new Date(inv.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.05]">
                  <button
                    onClick={() => {
                      const link = `https://sagitarius.cc/claim/${inv.code}`;
                      navigator.clipboard.writeText(link);
                      setSuccess('Claim link copied to clipboard!');
                    }}
                    className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inv.code);
                      setSuccess('Code copied to clipboard!');
                    }}
                    className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-xl"
                  >
                    Copy Code
                  </button>
                  <button
                    onClick={() => deleteInvite(inv.id)}
                    className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-xl group/del"
                    title="Delete invite code"
                  >
                    <Trash2 size={20} className="transition-transform group-hover/del:scale-110" />
                  </button>
                </div>
              </div>
            ))}
            {invites.length === 0 && !loading && (
              <div className="text-center py-20 bg-white/[0.01] rounded-[2rem] border border-white/[0.04] border-dashed">
                <Ticket size={48} className="mx-auto mb-4 text-white/5" />
                <h4 className="text-white/40 font-bold uppercase tracking-widest text-xs">No invite codes found</h4>
                <p className="text-white/10 text-[10px] mt-2 font-mono uppercase">Create your first code above</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
