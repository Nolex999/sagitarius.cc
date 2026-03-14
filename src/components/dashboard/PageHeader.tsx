'use client';

import { usePathname } from 'next/navigation';

const labels: Record<string, string> = {
  '/dashboard/db': 'DB',
  '/dashboard/firmware': 'Firmware',
  '/dashboard/s3': 'Section 3',
  '/dashboard/s4': 'Section 4',
  '/dashboard/s5': 'Section 5',
};

export default function PageHeader() {
  const pathname = usePathname();
  const label = labels[pathname] ?? '';
  return (
    <span className="font-mono text-[13px] uppercase tracking-wider text-[var(--text-secondary)]">
      {label}
    </span>
  );
}
