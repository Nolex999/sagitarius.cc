import { createClient } from '@/lib/supabase/server';
import CelebriteColumn from '@/components/dashboard/CelebriteColumn';
import LyceeColumn from '@/components/dashboard/LyceeColumn';

export const dynamic = 'force-dynamic';

export default async function DBPage() {
  const supabase = await createClient();

  const [celebritiesResult, classesResult, entriesResult] = await Promise.all([
    supabase.from('celebrities').select('*').order('created_at', { ascending: false }),
    supabase.from('lycee_classes').select('*').order('order_index'),
    supabase.from('lycee_entries').select('*').order('created_at', { ascending: false }),
  ]);

  const celebrities = celebritiesResult.data ?? [];
  const classes = classesResult.data ?? [];
  const entries = entriesResult.data ?? [];

  return (
    <div className="flex gap-4 overflow-x-auto p-6">
      <CelebriteColumn items={celebrities} />
      <LyceeColumn classes={classes} entries={entries} />
    </div>
  );
}
