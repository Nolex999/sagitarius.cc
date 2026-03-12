'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DBColumn from './DBColumn';
import EntryCard from './EntryCard';
import AddEntryDrawer from './AddEntryDrawer';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type LyceeClass = Database['public']['Tables']['lycee_classes']['Row'];
type LyceeEntry = Database['public']['Tables']['lycee_entries']['Row'];

const MAX_CLASSES = 14;
const DEFAULT_CLASS_COUNT = 8;

export default function LyceeColumn({
  classes: initialClasses,
  entries: initialEntries,
}: {
  classes: LyceeClass[];
  entries: LyceeEntry[];
}) {
  const [classes, setClasses] = useState<LyceeClass[]>(initialClasses);
  const [entries, setEntries] = useState<LyceeEntry[]>(initialEntries);
  const [activeClassId, setActiveClassId] = useState<string>(
    initialClasses[0]?.id ?? ''
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const supabase = createClient();

  const entriesByClass = useMemo(() => {
    const map: Record<string, LyceeEntry[]> = {};
    for (const e of entries) {
      if (!map[e.class_id]) map[e.class_id] = [];
      map[e.class_id].push(e);
    }
    return map;
  }, [entries]);

  const currentEntries = entriesByClass[activeClassId] ?? [];

  const handleAddClass = async () => {
    if (classes.length >= MAX_CLASSES) return;
    const nextNum = classes.length + 1;
    const { data, error } = await supabase
      .from('lycee_classes')
      .insert({ name: `2nde ${nextNum}`, order_index: nextNum })
      .select()
      .single();
    if (!error && data) {
      setClasses((p) => [...p, data]);
      setActiveClassId(data.id);
    }
  };

  const handleAddEntry = async (values: Record<string, string>) => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('lycee_entries')
      .insert({
        class_id: activeClassId,
        name: values.name,
        info: values.info || null,
        created_by: user.user?.id ?? null,
      })
      .select()
      .single();
    if (!error && data) {
      setEntries((p) => [...p, data]);
    }
  };

  return (
    <>
      <DBColumn
        title="Lycée"
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
        <div className="flex flex-col">
          <div className="flex items-end gap-0 border-b border-[#1f1f1f] overflow-x-auto">
            {classes.map((c) => {
              const isActive = c.id === activeClassId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveClassId(c.id)}
                  className={`shrink-0 px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'border-b border-[var(--text-primary)] text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
            {classes.length < MAX_CLASSES && (
              <button
                type="button"
                onClick={handleAddClass}
                className="shrink-0 px-2 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
          <div className="flex-1">
            {currentEntries.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-[var(--text-muted)]">
                Aucune entrée
              </div>
            ) : (
              currentEntries.map((e) => (
                <EntryCard key={e.id} name={e.name} info={e.info} />
              ))
            )}
          </div>
        </div>
      </DBColumn>
      <AddEntryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Ajouter une entrée"
        fields={[
          { name: 'name', label: 'Nom', required: true },
          { name: 'info', label: 'Info' },
        ]}
        onSubmit={handleAddEntry}
      />
    </>
  );
}
