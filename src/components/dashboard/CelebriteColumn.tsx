'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import SoftwareColumn from './SoftwareColumn';
import EntryCard from './EntryCard';
import AddEntryDrawer from './AddEntryDrawer';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Celebrity = Database['public']['Tables']['celebrities']['Row'];

export default function CelebriteColumn({ items }: { items: Celebrity[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [list, setList] = useState<Celebrity[]>(items);
  const supabase = createClient();

  // Sync state with props
  useEffect(() => {
    setList(items);
  }, [items]);

  const handleAdd = async (values: Record<string, string>) => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('celebrities')
      .insert({
        name: values.name,
        category: values.category || null,
        email: values.email || null,
        habitation: values.habitation || null,
        telephone: values.telephone || null,
        created_by: user.user?.id ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding celebrity:', error);
      alert('Failed to add entry: ' + error.message);
      return;
    }

    if (data) {
      setList((p) => [data, ...p]);
    }
  };

  return (
    <>
      <SoftwareColumn
        title="Celebrity"
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
            No entries
          </div>
        ) : (
          list.map((item) => (
            <EntryCard
              key={item.id}
              name={item.name}
              category={item.category}
              email={item.email}
              habitation={item.habitation}
              telephone={item.telephone}
            />
          ))
        )}
      </SoftwareColumn>
      <AddEntryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add Celebrity"
        fields={[
          { name: 'name', label: 'Name', required: true },
          { name: 'category', label: 'Category' },
          { name: 'email', label: 'Email' },
          { name: 'habitation', label: 'Residence' },
          { name: 'telephone', label: 'Phone' },
        ]}
        onSubmit={handleAdd}
      />
    </>
  );
}
