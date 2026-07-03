import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PublicBioView from '@/components/bio/PublicBioView';
import type { BioConfig } from '@/types/bio';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ username: string }>;
};

function BioUnavailablePage({ username }: { username: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050403] px-6 text-center text-white">
      <div className="max-w-md space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent)]">
          Sagitarius.cc
        </p>
        <h1 className="text-2xl font-semibold">Bio temporarily unavailable</h1>
        <p className="text-sm leading-6 text-white/50">
          The public bio for @{username} could not be loaded right now.
        </p>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username: routeUsername } = await params;
  const username = routeUsername.toLowerCase();
  let data = null;

  try {
    const supabase = await createClient();
    const result = await supabase
      .from('bio_profiles')
      .select('config')
      .eq('username', username)
      .eq('is_published', true)
      .maybeSingle();
    if (result.error) {
      console.error('Failed to load bio metadata', result.error);
      return {
        title: 'Bio temporarily unavailable — Sagitarius.cc',
        description: 'This bio page could not be loaded right now.',
      };
    }
    data = result.data;
  } catch (error) {
    console.error('Failed to load bio metadata', error);
    return {
      title: 'Bio temporarily unavailable — Sagitarius.cc',
      description: 'This bio page could not be loaded right now.',
    };
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
  const { username: routeUsername } = await params;
  const username = routeUsername.toLowerCase();
  let supabase;
  let data = null;
  let didFailToLoad = false;

  try {
    supabase = await createClient();
    const result = await supabase
      .from('bio_profiles')
      .select('*')
      .eq('username', username)
      .eq('is_published', true)
      .maybeSingle();
    if (result.error) {
      console.error('Failed to load public bio', result.error);
      didFailToLoad = true;
    }
    data = result.data;
  } catch (error) {
    console.error('Failed to load public bio', error);
    didFailToLoad = true;
  }

  if (didFailToLoad) {
    return <BioUnavailablePage username={username} />;
  }

  if (!data) {
    notFound();
  }

  // Increment views in background
  if (supabase) {
    void supabase
      .rpc('increment_bio_views', {
        profile_username: username,
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
