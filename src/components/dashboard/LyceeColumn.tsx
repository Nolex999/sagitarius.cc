'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import SoftwareColumn from './SoftwareColumn';
import EntryCard from './EntryCard';
import AddEntryDrawer from './AddEntryDrawer';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type LyceeClass = Database['public']['Tables']['lycee_classes']['Row'];
type LyceeEntry = Database['public']['Tables']['lycee_entries']['Row'];

const MAX_CLASSES = 14;
const DEFAULT_CLASS_COUNT = 8;

export default function LyceeColumn({
  classes,
  entries: initialEntries,
}: {
  classes: LyceeClass[];
  entries: LyceeEntry[];
}) {
  const [entries, setEntries] = useState<LyceeEntry[]>(initialEntries);

  // Sync state with props
  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const supabase = createClient();

  // Use the first class as the default for new entries
  const defaultClassId = classes[0]?.id;

  const handleAddEntry = async (values: Record<string, string>) => {
    if (!defaultClassId) {
      alert("Erreur: Aucune classe lycée trouvée dans la base de données. Veuillez lancer le script SQL.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('lycee_entries')
      .insert({
        class_id: defaultClassId,
        name: values.name,
        info: values.info || null,
        email: values.email || null,
        habitation: values.habitation || null,
        telephone: values.telephone || null,
        created_by: userData.user?.id ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding lycee entry:', error);
      alert('Erreur lors de l\'ajout (Lycée): ' + error.message);
      return;
    }

    if (data) {
      setEntries((p) => [data, ...p]);
    }
  };

  return (
    <>
      <SoftwareColumn
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
        <div className="flex-1">
          {entries.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-[var(--text-muted)]">
              Aucune entrée
            </div>
          ) : (
            entries.map((e) => (
              <EntryCard 
                key={e.id} 
                name={e.name} 
                info={e.info} 
                email={e.email}
                habitation={e.habitation}
                telephone={e.telephone}
              />
            ))
          )}
        </div>
      </SoftwareColumn>
      <AddEntryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Ajouter une entrée"
        fields={[
          { name: 'name', label: 'Nom', required: true },
          { name: 'info', label: 'Info' },
          { name: 'email', label: 'Email' },
          { name: 'habitation', label: 'Habitation' },
          { name: 'telephone', label: 'Téléphone' },
        ]}
        onSubmit={handleAddEntry}
      />
    </>
  );
}
