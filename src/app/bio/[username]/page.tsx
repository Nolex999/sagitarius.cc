import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PublicBioView from '@/components/bio/PublicBioView';
import type { BioConfig } from '@/types/bio';

export const dynamic = 'force-dynamic';

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('bio_profiles')
    .select('config')
    .eq('username', params.username.toLowerCase())
    .eq('is_published', true)
    .single();

  if (!data) {
    return { title: 'Not Found — Sagitarius.cc' };
  }

  const config = data.config as BioConfig;
  return {
    title: `${config.displayName || config.username} — Sagitarius.cc`,
    description: config.bio || `${config.displayName}'s profile on Sagitarius.cc`,
  };
}

export default async function PublicBioPage({ params }: Props) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('bio_profiles')
    .select('*')
    .eq('username', params.username.toLowerCase())
    .eq('is_published', true)
    .single();

  if (!data) {
    notFound();
  }

  // Increment views in background
  supabase.rpc('increment_bio_views', { profile_username: params.username.toLowerCase() });

  const config = data.config as BioConfig;

  return (
    <div className="w-full h-screen">
      <PublicBioView config={config} views={data.views || 0} />
    </div>
  );
}
