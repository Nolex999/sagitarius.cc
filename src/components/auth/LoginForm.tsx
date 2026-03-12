'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

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
      router.push('/dashboard/db');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && (
        <div className="mb-4 border border-[#ef4444] bg-[#ef4444]/10 px-3 py-2 text-[13px] text-[#ef4444]">
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
            className="absolute left-3 text-[var(--text-muted)]"
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
            className="w-full border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-10 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)]"
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
            className="absolute left-3 text-[var(--text-muted)]"
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
            className="w-full border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-10 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--accent)] py-2.5 text-[13px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-95 disabled:opacity-60"
      >
        {loading ? 'Processing...' : 'Sign In'}
      </button>
      <Link
        href="/auth/register"
        className="mt-4 block text-center text-[13px] text-[var(--text-secondary)] underline hover:text-[var(--text-primary)]"
      >
        Need an account?
      </Link>
    </form>
  );
}
