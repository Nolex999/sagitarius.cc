'use client';

import BioPreview from '@/components/dashboard/bio/BioPreview';
import type { BioConfig } from '@/types/bio';

interface PublicBioViewProps {
  config: BioConfig;
  views: number;
}

export default function PublicBioView({ config, views }: PublicBioViewProps) {
  // Override the stats views with real data
  const enhancedConfig: BioConfig = {
    ...config,
    stats: {
      ...config.stats,
      // Real view count will be shown in the preview
    },
  };

  return (
    <div className="w-full h-full">
      <BioPreview config={enhancedConfig} realViews={views} />
    </div>
  );
}
