import type { Metadata } from 'next';
import TalmorPage from '@/components/talmor/TalmorPage';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Talmor | Sign In',
  description: 'Talmor script executor. Sign in to access your Lua development environment.',
  openGraph: {
    title: 'Talmor',
    description: 'The ultimate Roblox script executor.',
    url: 'https://sagitarius.cc/talmor',
    siteName: 'Sagitarius',
  },
};

export default function Page() {
  return <TalmorPage />;
}
