'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Ticket } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // 1. Validate invitation code (inv_code with code_type='invite')
      const { data: validData } = await supabase.rpc('validate_invite_code', {
        p_code: formData.inviteCode.trim(),
      });
      if (!validData?.valid) {
        throw new Error(
          (validData as { message?: string })?.message ||
          'Code invalide ou déjà utilisé.'
        );
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas.');
      }

      // 2. Sign up (no email confirmation)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined,
          data: { invited: true },
        },
      });

      if (authError) throw authError;

      // 3. Mark invite code as used
      if (authData.user) {
        await supabase.rpc('use_invite_code', {
          p_code: formData.inviteCode.trim().toUpperCase(),
        });
      }

      router.push('/dashboard/db');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-3 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)]';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && (
        <div className="mb-4 border border-[#ef4444] bg-[#ef4444]/10 px-3 py-2 text-[13px] text-[#ef4444]">
          {error}
        </div>
      )}
      <div className="mb-5">
        <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
          Code d&apos;invitation
        </label>
        <div className="relative flex items-center">
          <Ticket
            size={18}
            strokeWidth={1.5}
            className="absolute left-3 text-[var(--text-muted)]"
          />
          <input
            name="inviteCode"
            type="text"
            value={formData.inviteCode}
            onChange={(e) =>
              setFormData((p) => ({ ...p, inviteCode: e.target.value }))
            }
            placeholder="UUID (ex: 6696a32-c314-4fac-94ea-ecb3ad115a98)"
            required
            className={inputClass}
          />
        </div>
      </div>
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
            className={inputClass}
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
      <div className="mb-5">
        <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
          Confirm password
        </label>
        <div className="relative flex items-center">
          <Lock
            size={18}
            strokeWidth={1.5}
            className="absolute left-3 text-[var(--text-muted)]"
          />
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
            }
            placeholder="Confirm password"
            required
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--accent)] py-2.5 text-[13px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border border-[var(--bg-base)]/30 border-t-[var(--bg-base)]" />
            Processing...
          </span>
        ) : (
          'Create account'
        )}
      </button>
      <Link
        href="/auth/login"
        className="mt-4 block text-center text-[13px] text-[var(--text-secondary)] underline transition-colors hover:text-[var(--text-primary)]"
      >
        Already registered?
      </Link>
    </form>
  );
}
