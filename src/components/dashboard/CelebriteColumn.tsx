'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DBColumn from './DBColumn';
import EntryCard from './EntryCard';
import AddEntryDrawer from './AddEntryDrawer';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Celebrity = Database['public']['Tables']['celebrities']['Row'];

export default function CelebriteColumn({ items }: { items: Celebrity[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [list, setList] = useState<Celebrity[]>(items);
  const supabase = createClient();

  const handleAdd = async (values: Record<string, string>) => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('celebrities')
      .insert({
        name: values.name,
        category: values.category || null,
        created_by: user.user?.id ?? null,
      })
      .select()
      .single();
    if (!error && data) {
      setList((p) => [...p, data]);
    }
  };

  return (
    <>
      <DBColumn
        title="Célébrité"
        actions={
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-8 w-8 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Plus size={18} strokeWidth={1.5} />
          </button>
        }
      >
        {list.length === 0 ? (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--text-muted)]">
            Aucune entrée
          </div>
        ) : (
          list.map((item) => (
            <EntryCard
              key={item.id}
              name={item.name}
              category={item.category}
            />
          ))
        )}
      </DBColumn>
      <AddEntryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Ajouter une célébrité"
        fields={[
          { name: 'name', label: 'Nom', required: true },
          { name: 'category', label: 'Catégorie' },
        ]}
        onSubmit={handleAdd}
      />
    </>
  );
}
