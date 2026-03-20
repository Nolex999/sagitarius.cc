'use client';

import { useState, useEffect } from 'react';
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

export default function AdminPanel() {
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
      setInvites(invites.filter(inv => inv.id !== id));
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
        <form onSubmit={handleSendMessage} className="space-y-4 animate-in fade-in duration-500">
          <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <button
              type="button"
              onClick={() => setMsgType('broadcast')}
              className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                msgType === 'broadcast' ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-white/[0.02] border-white/10 text-white/40'
              }`}
            >
              <Users size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Broadcast All</span>
            </button>
            <button
              type="button"
              onClick={() => setMsgType('direct')}
              className={`flex-1 p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                msgType === 'direct' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-white/[0.02] border-white/10 text-white/40'
              }`}
            >
              <Mail size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Direct Message</span>
            </button>
          </div>

          <div className="space-y-3">
            {msgType === 'direct' && (
              <input
                type="email"
                placeholder="Target User Email..."
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-sm text-white focus:border-orange-500/50 outline-none transition-all"
              />
            )}
            <input
              type="text"
              placeholder="Message Title..."
              required
              value={msgTitle}
              onChange={(e) => setMsgTitle(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-sm text-white focus:border-orange-500/50 outline-none transition-all"
            />
            <textarea
              placeholder="Message Content..."
              required
              rows={4}
              value={msgContent}
              onChange={(e) => setMsgContent(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-orange-500 text-black text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
            {msgType === 'broadcast' ? 'Broadcast to Everyone' : 'Send Direct Message'}
          </button>
        </form>
      )}

      {activeTab === 'invites' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <form onSubmit={handleCreateInvite} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex gap-3">
            <input
              type="text"
              placeholder="Custom Code (optional)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 h-11 text-xs text-white focus:border-orange-500/50 outline-none transition-all"
            />
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3 group">
              <Plus size={14} className="text-white/20 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="number"
                min="0"
                placeholder="Uses"
                value={maxUses}
                onChange={(e) => setMaxUses(parseInt(e.target.value))}
                className="w-16 bg-transparent h-11 text-xs text-white outline-none"
                title="Max Uses (0 for unlimited)"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              Create
            </button>
          </form>

          <div className="space-y-2">
            {invites.map((inv) => (
              <div key={inv.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between group">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white font-bold tracking-wider">{inv.code}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      inv.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {inv.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-white/20">
                    <span className="flex items-center gap-1.5"><Hash size={12} /> {inv.current_uses} / {inv.max_uses === 0 ? '∞' : inv.max_uses} uses</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(inv.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteInvite(inv.id)}
                  className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {invites.length === 0 && !loading && (
              <div className="text-center py-10 text-white/20 text-xs font-mono">No invite codes found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
