'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RecoveryForm() {
    const supabase = createClient();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
            });

            if (err) throw err;
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du mail');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="w-full text-center">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
                <h3 className="mb-2 text-[15px] font-medium text-[var(--text-primary)]">
                    Check your email
                </h3>
                <p className="mb-6 text-[13px] text-[var(--text-secondary)]">
                    We've sent a password reset link to <span className="text-[var(--text-primary)]">{email}</span>.
                </p>
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-[13px] text-[var(--text-secondary)] underline transition-colors hover:text-[var(--text-primary)]"
                >
                    <ArrowLeft size={14} />
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {error && (
                <div className="mb-4 border border-[#ef4444] bg-[#ef4444]/10 px-3 py-2 text-[13px] text-[#ef4444] rounded-lg">
                    {error}
                </div>
            )}

            <div className="mb-6 text-center">
                <p className="text-[13px] text-[var(--text-secondary)]">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mb-5">
                <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    Email Address
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-10 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)] rounded-lg"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] py-2.5 text-[13px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-60 rounded-lg"
            >
                {loading ? (
                    <span className="inline-flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border border-[var(--bg-base)]/30 border-t-[var(--bg-base)]" />
                        Sending link...
                    </span>
                ) : (
                    'Send reset link'
                )}
            </button>

            <Link
                href="/auth/login"
                className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
                <ArrowLeft size={14} />
                Back to login
            </Link>
        </form>
    );
}
