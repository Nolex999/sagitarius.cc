import type { Metadata } from 'next';
import TalmorPage from '@/components/talmor/TalmorPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Talmor — Roblox Executor | Sagitarius',
  description: 'Talmor, the ultimate Roblox script executor. Instant execution, advanced anti-detection, and automatic updates.',
  openGraph: {
    title: 'Talmor — Roblox Executor',
    description: 'The ultimate Roblox script executor. Rebuilt for speed and stability.',
    url: 'https://sagitarius.cc/talmor',
    siteName: 'Sagitarius',
    images: [{ url: '/og-talmor.png', width: 1200, height: 630, alt: 'Talmor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talmor',
    description: 'The ultimate Roblox script executor.',
    images: ['/og-talmor.png'],
  },
};

export default function Page() {
  return <TalmorPage />;
}
