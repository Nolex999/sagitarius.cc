import type { Metadata } from 'next';
import TalmorDashboard from '@/components/talmor/TalmorDashboard';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Talmor Dashboard',
  description: 'Talmor script executor dashboard.',
};

export default function Page() {
  return <TalmorDashboard />;
}
