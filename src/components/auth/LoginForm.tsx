'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DiscordLinkModal from './DiscordLinkModal';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(searchParams.get('error'));
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const checkDiscordLink = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('discord_id')
          .eq('id', user.id)
          .single();
        
        if (!profile?.discord_id) {
          const hasSeenModal = localStorage.getItem('discord_modal_seen');
          if (!hasSeenModal) {
            setShowDiscordModal(true);
          }
        }
      }
    };
    checkDiscordLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (err) throw err;
      setShowDiscordModal(false);
      router.push('/dashboard/software');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && (
        <div className="mb-4 border border-[#ef4444] bg-[#ef4444]/10 px-3 py-2 text-[13px] text-[#ef4444] rounded-lg">
          {error}
        </div>
      )}
      <div className="mb-5">
        <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
          Email
        </label>
        <div className="relative flex items-center">
          <Mail
            size={18}
            strokeWidth={1.5}
            className="absolute left-3 text-[var(--text-muted)] transition-colors"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({ ...p, email: e.target.value }))
            }
            placeholder="Enter your email"
            required
            className="w-full border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-10 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)] rounded-lg"
          />
        </div>
      </div>
      <div className="mb-5">
        <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
          Password
        </label>
        <div className="relative flex items-center">
          <Lock
            size={18}
            strokeWidth={1.5}
            className="absolute left-3 text-[var(--text-muted)] transition-colors"
          />
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) =>
              setFormData((p) => ({ ...p, password: e.target.value }))
            }
            placeholder="Enter password"
            required
            className="w-full border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-10 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)] rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
      <div className="mb-6 flex justify-end">
        <Link
          href="/auth/recovery"
          className="text-[12px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          Forgot password?
        </Link>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--accent)] py-2.5 text-[13px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-60 rounded-lg"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border border-[var(--bg-base)]/30 border-t-[var(--bg-base)]" />
            Processing...
          </span>
        ) : (
          'Sign In'
        )}
      </button>
      <Link
        href="/auth/register"
        className="mt-4 block text-center text-[13px] text-[var(--text-secondary)] underline transition-colors hover:text-[var(--text-primary)]"
      >
        Need an account?
      </Link>

      <DiscordLinkModal
        isOpen={showDiscordModal}
        onClose={() => {
          localStorage.setItem('discord_modal_seen', 'true');
          setShowDiscordModal(false);
        }}
        onLink={() => {
          localStorage.setItem('discord_modal_seen', 'true');
          window.location.href = '/api/auth/discord';
        }}
      />
    </form>
  );
}
