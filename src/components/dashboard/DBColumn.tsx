import type { ReactNode } from 'react';

type DBColumnProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function DBColumn({ title, children, actions }: DBColumnProps) {
  return (
    <div className="flex min-h-[500px] w-[320px] shrink-0 flex-col rounded-sm border border-[#1f1f1f] bg-[var(--bg-surface)]">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-mono text-[13px] font-medium uppercase tracking-wide text-[var(--text-primary)]">
          {title}
        </span>
        {actions}
      </div>
      <div className="border-b border-[#1f1f1f]" />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
