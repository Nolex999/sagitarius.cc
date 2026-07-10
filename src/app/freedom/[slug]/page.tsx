import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import FreedomViewer from '@/components/freedom/FreedomViewer';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} — Freedom`, description: `Freedom page by ${slug}` };
}

export default async function FreedomSlugPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('freedom_pages')
    .select('config, views')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) notFound();

  const config = typeof data.config === 'string' ? JSON.parse(data.config) : data.config;

  // Increment views
  try { await supabase.rpc('increment_freedom_page_views', { page_slug: slug }); } catch {}

  return <FreedomViewer config={config} initialViews={data.views || 0} />;
}
