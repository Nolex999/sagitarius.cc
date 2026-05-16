'use client';

import { useState, useEffect } from 'react';
import {
  Crown, Settings, AlertTriangle, Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function OwnerSettings() {
  const [loading, setLoading] = useState(true);
  const [confirmDanger, setConfirmDanger] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const supabase = createClient();

  const dangerAction = async (action: string) => {
    if (confirmDanger !== action) {
      setConfirmDanger(action);
      return;
    }

    try {
      switch (action) {
        case 'purge-invites':
          await supabase.from('inv_code').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          break;
        case 'reset-views':
          await supabase.from('bio_profiles').update({ views: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');
          break;
      }
      setActionDone(action);
      setTimeout(() => setActionDone(null), 2000);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
    setConfirmDanger(null);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Crown size={18} className="text-white" />
          Owner Settings
        </h1>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-widest">
          Configuration globale — Owner uniquement
        </p>
      </div>

      {/* Site Configuration */}
      <div className="mb-8">
        <h2 className="text-[9px] uppercase tracking-[0.25em] font-bold text-[var(--text-muted)] mb-4 flex items-center gap-2">
          <Settings size={12} /> Configuration
        </h2>
        <div className="rounded-2xl border border-white/[0.06] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Site name</p>
              <p className="text-[10px] text-[var(--text-muted)]">Sagitarius.cc</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Version</p>
              <p className="text-[10px] text-[var(--text-muted)]">2.0.0 — Build {new Date().toLocaleDateString('en-US')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <h2 className="text-[9px] uppercase tracking-[0.25em] font-bold text-red-400/60 mb-4 flex items-center gap-2">
          <AlertTriangle size={12} /> Danger Zone
        </h2>
        <div className="rounded-2xl border border-red-500/15 p-5 space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-white">Supprimer tous les codes d'invitation</p>
              <p className="text-[10px] text-[var(--text-muted)]">Cette action est irréversible</p>
            </div>
            <button
              onClick={() => dangerAction('purge-invites')}
              className={`h-8 px-4 rounded-lg text-[10px] font-bold transition-all ${
                confirmDanger === 'purge-invites'
                  ? 'bg-red-500 text-white'
                  : actionDone === 'purge-invites'
                    ? 'bg-green-500/15 text-green-400 border border-green-400/20'
                    : 'text-red-400/60 border border-red-400/15 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              {actionDone === 'purge-invites' ? 'Done ✓' : confirmDanger === 'purge-invites' ? 'Confirmer?' : 'Supprimer'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-red-500/10">
            <div>
              <p className="text-xs font-bold text-white">Réinitialiser les vues des pages bio</p>
              <p className="text-[10px] text-[var(--text-muted)]">Remet toutes les vues à 0</p>
            </div>
            <button
              onClick={() => dangerAction('reset-views')}
              className={`h-8 px-4 rounded-lg text-[10px] font-bold transition-all ${
                confirmDanger === 'reset-views'
                  ? 'bg-red-500 text-white'
                  : actionDone === 'reset-views'
                    ? 'bg-green-500/15 text-green-400 border border-green-400/20'
                    : 'text-red-400/60 border border-red-400/15 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              {actionDone === 'reset-views' ? 'Done ✓' : confirmDanger === 'reset-views' ? 'Confirmer?' : 'Réinitialiser'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
