import type { ReactNode } from 'react';

type SoftwareColumnProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function SoftwareColumn({ title, children, actions }: SoftwareColumnProps) {
  return (
    <div className="flex min-h-[500px] w-full max-w-[340px] shrink-0 flex-col overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] rounded-[var(--radius-xl)] shadow-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">
          {title}
        </span>
        {actions}
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
