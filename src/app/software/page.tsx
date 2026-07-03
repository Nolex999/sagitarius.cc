import type { Metadata } from 'next';
import SoftwareShowcase from '@/components/software/SoftwareShowcase';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Sagitarius Software | Loader Presentation',
  description: 'Interactive 3D presentation for Sagitarius software and loader access.',
  openGraph: {
    title: 'Sagitarius Software',
    description: 'Interactive 3D presentation for the Sagitarius loader.',
    url: 'https://software.sagitarius.cc',
  },
};

export default function SoftwarePage() {
  return <SoftwareShowcase />;
}
