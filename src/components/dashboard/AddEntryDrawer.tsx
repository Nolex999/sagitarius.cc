'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

type AddEntryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: { name: string; label: string; placeholder?: string; required?: boolean }[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  children?: React.ReactNode;
};

export default function AddEntryDrawer({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  children,
}: AddEntryDrawerProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values: Record<string, string> = {};
    fields.forEach((f) => {
      values[f.name] = (formData.get(f.name) as string) ?? '';
    });
    await onSubmit(values);
    form.reset();
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="animate-slide-in-right fixed right-4 top-4 z-50 h-[calc(100vh-2rem)] w-[400px] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl rounded-[var(--radius-xl)] flex flex-col overflow-hidden"
        role="dialog"
        aria-label={title}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--text-muted)] transition-colors hover:text-white"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-6 overflow-y-auto p-6"
          >
            {fields.map((f) => (
              <div key={f.name}>
                <label className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type="text"
                  placeholder={f.placeholder}
                  required={f.required}
                  className="w-full rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[13px] text-white outline-none transition-all placeholder:text-[#333] focus:border-white/20 focus:bg-white/[0.05]"
                />
              </div>
            ))}
            {children}
            <div className="mt-auto flex flex-col gap-3 pt-6">
              <button
                type="submit"
                className="w-full bg-white px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#444] transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}
