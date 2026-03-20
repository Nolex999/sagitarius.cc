'use client';

import { useState, useEffect } from 'react';
import { 
  Inbox, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Clock, 
  Bell,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface InboxMessage {
  id: string;
  type: 'key' | 'notification' | 'welcome';
  title: string;
  content: string;
  is_revealed: boolean;
  reveal_content: string | null;
  is_read: boolean;
  created_at: string;
}

export default function InboxManager() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealing, setRevealing] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('inbox_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const revealKey = async (messageId: string) => {
    setRevealing(messageId);
    try {
      const { error } = await supabase
        .from('inbox_messages')
        .update({ is_revealed: true, is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, is_revealed: true, is_read: true } : m
      ));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRevealing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-white/40 text-sm animate-pulse">Checking your inbox...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Inbox size={28} className="text-orange-500" />
            Inbox
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Your personal messages and software activation keys
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="space-y-3">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`rounded-2xl border transition-all overflow-hidden ${
              msg.is_read 
                ? 'bg-white/[0.01] border-white/[0.04]' 
                : 'bg-white/[0.03] border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]'
            }`}
          >
            <div className="p-5 flex items-start gap-4">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                msg.type === 'key' 
                  ? 'bg-orange-500/10 text-orange-400' 
                  : 'bg-blue-500/10 text-blue-400'
              }`}>
                {msg.type === 'key' ? <Key size={20} /> : <Bell size={20} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white truncate pr-4">{msg.title}</h3>
                  <span className="text-[10px] text-white/20 whitespace-nowrap font-mono flex items-center gap-1.5">
                    <Clock size={10} />
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed mb-4">{msg.content}</p>

                {msg.type === 'key' && (
                  <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="h-8 w-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-white/20">
                        {msg.is_revealed ? <CheckCircle2 size={16} className="text-green-500/60" /> : <Clock size={16} />}
                      </div>
                      <div className="font-mono text-xs tracking-wider text-white">
                        {msg.is_revealed ? (
                          <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">{msg.reveal_content}</span>
                        ) : (
                          <span className="text-white/20 select-none">••••-••••-••••-••••</span>
                        )}
                      </div>
                    </div>

                    {!msg.is_revealed && (
                      <button
                        onClick={() => revealKey(msg.id)}
                        disabled={revealing === msg.id}
                        className="w-full sm:w-auto h-9 px-4 rounded-lg bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                      >
                        {revealing === msg.id ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
                        Reveal Key
                      </button>
                    )}
                    {msg.is_revealed && (
                       <button
                         onClick={() => {
                           if (msg.reveal_content) {
                             navigator.clipboard.writeText(msg.reveal_content);
                           }
                         }}
                         className="w-full sm:w-auto h-9 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                       >
                         Copy
                       </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] rounded-[2rem] border border-white/[0.04]">
            <Inbox size={48} className="mx-auto mb-4 text-white/10" />
            <h4 className="text-white/60 font-bold">Inbox is empty</h4>
            <p className="text-white/20 text-xs mt-1">New messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
