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
        className="animate-slide-in-right fixed right-0 top-0 z-50 h-full w-[360px] border-l border-[var(--border)] bg-[#0f0f0f] shadow-lg"
        role="dialog"
        aria-label={title}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <h2 className="font-mono text-[13px] font-medium uppercase tracking-wide text-[var(--text-primary)]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
          >
            {fields.map((f) => (
              <div key={f.name}>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type="text"
                  placeholder={f.placeholder}
                  required={f.required}
                  className="w-full border border-[var(--border)] bg-transparent px-3 py-2 text-[13px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--border-active)]"
                />
              </div>
            ))}
            {children}
            <div className="mt-auto flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-[var(--accent)] px-4 py-2 text-[13px] font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-[13px] text-[#555] hover:text-[var(--text-secondary)]"
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
