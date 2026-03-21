'use client';

import { useState } from 'react';
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function InviteRequestForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error('Webhook not configured');
      }

      const embed = {
        title: '📩 New Invite Request',
        color: 0xC5A059, // Gold
        fields: [
          { name: '📧 Email', value: email, inline: true },
          { name: '📝 Message', value: message || '_No message_', inline: false },
          { name: '🕐 Date', value: new Date().toLocaleString('en-US'), inline: true },
        ],
        footer: { text: 'Sagitarius.cc — Invite Request' },
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Sagitarius.cc',
          avatar_url: '',
          embeds: [embed],
        }),
      });

      if (!res.ok) throw new Error('Webhook error');

      setStatus('success');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error sending request');
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-6 p-6 border border-green-500/20 bg-green-500/[0.03] rounded-xl text-center animate-fade-in">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <Check size={18} className="text-green-400" />
        </div>
        <p className="text-sm font-semibold text-green-400">Request sent!</p>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">
          You will receive your invite code if your request is accepted.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-3 text-[11px] text-[var(--text-secondary)] underline hover:text-white transition-colors"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-[var(--border)] pt-6">
      <div className="text-center mb-4">
        <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
          No code?
        </p>
        <h3 className="text-sm font-bold text-white">Request an Invite</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {status === 'error' && (
          <div className="flex items-center gap-2 p-2.5 border border-red-500/20 bg-red-500/[0.05] rounded-lg text-[11px] text-red-400">
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Your email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full border border-[var(--border)] bg-transparent py-2.5 px-3 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)] rounded-lg"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Message <span className="text-[var(--text-muted)]">(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Why do you want to join..."
            rows={3}
            className="w-full border border-[var(--border)] bg-transparent py-2.5 px-3 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)] rounded-lg resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-50 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-gold)] text-[var(--bg-base)] hover:opacity-90 border border-[var(--accent)]/20"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={14} />
              Send Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
