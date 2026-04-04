'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordForm() {
    const router = useRouter();
    const supabase = createClient();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { error: err } = await supabase.auth.updateUser({
                password: password,
            });

            if (err) throw err;
            setSuccess(true);

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full text-center">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
                <h3 className="mb-2 text-[15px] font-medium text-[var(--text-primary)]">
                    Password updated
                </h3>
                <p className="mb-6 text-[13px] text-[var(--text-secondary)]">
                    Your password has been successfully reset. Redirecting you to login...
                </p>
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

            <div className="mb-5">
                <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    New Password
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
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

            <div className="mb-6">
                <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    Confirm Password
                </label>
                <div className="relative flex items-center">
                    <Lock
                        size={18}
                        strokeWidth={1.5}
                        className="absolute left-3 text-[var(--text-muted)] transition-colors"
                    />
                    <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
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
                        Updating...
                    </span>
                ) : (
                    'Reset Password'
                )}
            </button>
        </form>
    );
}
