import { createClient } from '@/lib/supabase/server';
import PublicBioView from '@/components/bio/PublicBioView';
import type { BioConfig } from '@/types/bio';

export const dynamic = 'force-dynamic';

function FreedomDefault() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/30 text-sm">No bio configured yet. Edit yours in the dashboard.</p>
      </div>
    </main>
  );
}

function FreedomFallback({ views }: { views: number }) {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center flex-col gap-4">
      <p className="text-white/50 text-sm">No bio profile found for this account.</p>
    </main>
  );
}

export default async function FreedomPage() {
  let supabase;
  let data = null;
  let didFailToLoad = false;

  try {
    supabase = await createClient();

    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'owner')
      .maybeSingle();

    if (!ownerProfile) {
      return <FreedomDefault />;
    }

    const result = await supabase
      .from('bio_profiles')
      .select('*')
      .eq('user_id', ownerProfile.id)
      .eq('is_published', true)
      .maybeSingle();

    if (result.error) {
      console.error('Failed to load freedom bio', result.error);
      didFailToLoad = true;
    }
    data = result.data;
  } catch (error) {
    console.error('Failed to load freedom bio', error);
    didFailToLoad = true;
  }

  if (didFailToLoad) {
    return <FreedomFallback views={0} />;
  }

  if (!data) {
    return <FreedomDefault />;
  }

  const config = data.config as BioConfig;

  return (
    <div className="w-full h-screen">
      <PublicBioView config={config} views={data.views || 0} />
    </div>
  );
}
