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
  let data = null;

  try {
    const supabase = await createClient();
    const result = await supabase
      .from('bio_profiles')
      .select('config')
      .eq('username', params.username.toLowerCase())
      .eq('is_published', true)
      .single();
    data = result.data;
  } catch (error) {
    console.error('Failed to load bio metadata', error);
  }

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
  let supabase;
  let data = null;

  try {
    supabase = await createClient();
    const result = await supabase
      .from('bio_profiles')
      .select('*')
      .eq('username', params.username.toLowerCase())
      .eq('is_published', true)
      .single();
    data = result.data;
  } catch (error) {
    console.error('Failed to load public bio', error);
  }

  if (!data) {
    notFound();
  }

  // Increment views in background
  if (supabase) {
    void supabase
      .rpc('increment_bio_views', {
        profile_username: params.username.toLowerCase(),
      })
      .then(({ error }) => {
        if (error) {
          console.error('Failed to increment bio views', error);
        }
      }, (error) => {
        console.error('Failed to increment bio views', error);
      });
  }

  const config = data.config as BioConfig;

  return (
    <div className="w-full h-screen">
      <PublicBioView config={config} views={data.views || 0} />
    </div>
  );
}
