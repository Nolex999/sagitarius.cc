'use client';

import { usePathname } from 'next/navigation';

const labels: Record<string, string> = {
  '/dashboard/software': 'Software',
  '/dashboard/get-key': 'Get Key',
  '/dashboard/inbox': 'Inbox',
  '/dashboard/firmware': 'Firmware',
  '/dashboard/s3': 'Bio Page',
  '/dashboard/s4': 'Admin',
  '/dashboard/s5': 'Settings',
  '/dashboard/s6': 'Software',
  '/dashboard/s7': 'Analytics',
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
