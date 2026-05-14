'use client';

import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  User,
  Mail,
  MessageSquare,
  Store,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SupportTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showResellerModal, setShowResellerModal] = useState(false);
  const [resellerLoading, setResellerLoading] = useState(false);
  const [resellerSuccess, setResellerSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string>('member');
  const [discord, setDiscord] = useState('');

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (data) setUserRole(data.role);
    }
  };

  const handleResellerApply = async () => {
    setResellerLoading(true);
    try {
      const res = await fetch('/api/reseller/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setResellerSuccess(true);
      
      // Fetch user info for webhook
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', user?.id)
        .single();

      // Send Discord webhook notification
      const webhookPayload = {
        embeds: [{
          title: '📝 New Reseller Application',
          color: 0xC5A059,
          fields: [
            { name: 'User', value: `**${profile?.username || 'Unknown'}**\n${profile?.email}`, inline: true },
            { name: 'Discord', value: discord || 'Not provided', inline: true }
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'Sagitarius.cc Reseller System' },
          actions: [
            {
              type: 2,
              label: '✅ Approve',
              style: 5,
              url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sagitarius.cc'}/api/reseller/webhook-approve?application_id=${data.application_id}`
            },
            {
              type: 2,
              label: '❌ Reject',
              style: 5,
              url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sagitarius.cc'}/api/reseller/webhook-reject?application_id=${data.application_id}`
            }
          ]
        }]
      };

      await fetch(process.env.DISCORD_RESELLER_WEBHOOK || 'https://discord.com/api/webhooks/1504427515203027068/4htNFpHUZLWiZMin7fJ_iytJJTJd0glG2WdanqxRcZf8BzVoANhHi4SosQIVeg51ot9O', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResellerLoading(false);
    }
  };
  const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1504427515203027068/4htNFpHUZLWiZMin7fJ_iytJJTJd0glG2WdanqxRcZf8BzVoANhHi4SosQIVeg51ot9O";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to submit a ticket.');

      const payload = {
        embeds: [{
          title: `New Support Ticket: ${subject}`,
          color: 0xC5A059, // Gold
          fields: [
            { name: "User Email", value: user.email || "Unknown", inline: true },
            { name: "User ID", value: user.id, inline: true },
            { name: "Subject", value: subject },
            { name: "Description", value: description }
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "Sagitarius.cc Support System" }
        }]
      };

      const response = await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to send ticket. Please try again later.');

      setSuccess(true);
      setSubject('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-[2rem] bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Ticket Submitted!</h2>
          <p className="text-white/40 text-sm">Our team will get back to you via your inbox message soon.</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="px-8 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-mono"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <div className="h-16 w-16 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto text-[var(--accent)] mb-4">
          <LifeBuoy size={32} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Support Center</h1>
        <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em]">Need help? Our staff is here 24/7</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-gold)]/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000" />
        
        <div className="relative space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1">Subject</label>
              <div className="relative group/input">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[var(--accent)] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="What can we help you with?"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 h-14 text-sm text-white focus:border-[var(--accent)]/50 outline-none transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1">Description</label>
              <textarea
                placeholder="Describe your issue in detail..."
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--accent)]/50 outline-none transition-all placeholder:text-white/10 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[var(--accent)] text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--accent)]/10 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={16} />}
            Submit Ticket
          </button>

          <p className="text-center text-[9px] text-white/10 font-bold uppercase tracking-[0.2em]">
            Responses will be sent to your Sagitarius Inbox
          </p>
        </div>
      </form>

      {userRole !== 'reseller' && userRole !== 'admin' && userRole !== 'owner' && (
        <div className="mt-8 p-6 rounded-[2rem] bg-gradient-to-r from-[var(--accent)]/5 to-transparent border border-[var(--accent)]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <Store size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Become a Reseller</h3>
                <p className="text-[10px] text-white/40">Buy keys in bulk at discounted prices</p>
              </div>
            </div>
            <button
              onClick={() => setShowResellerModal(true)}
              className="px-6 h-10 rounded-xl bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent-gold)] transition-all"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {showResellerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowResellerModal(false)} />
          <div className="relative w-full max-w-md p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/10">
            <button
              onClick={() => setShowResellerModal(false)}
              className="absolute top-4 right-4 text-white/20 hover:text-white"
            >
              <X size={20} />
            </button>

            {resellerSuccess ? (
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-white uppercase">Application Submitted!</h3>
                <p className="text-sm text-white/40">We'll review your request and get back to you soon.</p>
                <button
                  onClick={() => setShowResellerModal(false)}
                  className="px-6 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mx-auto text-[var(--accent)] mb-3">
                    <Store size={28} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase">Reseller Application</h3>
                  <p className="text-[10px] text-white/40 mt-1">Fill in your contact details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1 block mb-1.5">Discord</label>
                    <input
                      type="text"
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      placeholder="your#1234"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[var(--accent)]/50 outline-none placeholder:text-white/10"
                    />
                  </div>
                  </div>

                <button
                  onClick={handleResellerApply}
                  disabled={resellerLoading}
                  className="w-full h-12 mt-6 rounded-xl bg-[var(--accent)] text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[var(--accent-gold)] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {resellerLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Submit Application
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
