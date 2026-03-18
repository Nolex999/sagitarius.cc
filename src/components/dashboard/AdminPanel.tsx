'use client';

import { useState, useEffect } from 'react';
import {
  Users, Ticket, BarChart3, Shield, Crown, Copy, Check,
  Trash2, Plus, RefreshCw, Loader2, Search, UserX, UserCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type AdminTab = 'users' | 'invites' | 'stats';

interface UserProfile {
  id: string;
  username: string;
  role: string;
  created_at: string;
  email?: string;
}

interface InviteCode {
  id: string;
  code: string;
  is_active: boolean;
  max_uses: number;
  current_uses: number;
  expires_at: string | null;
  created_by: string;
}

export default function AdminPanel({ userRole }: { userRole: 'admin' | 'owner' }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invites, setInvites] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, totalBio: 0, totalViews: 0, activeInvites: 0 });

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setUsers(profilesData || []);

      // Load invite codes
      const { data: invitesData } = await supabase
        .from('inv_code')
        .select('*')
        .order('is_active', { ascending: false });
      setInvites(invitesData || []);

      // Load stats
      const { count: bioCount } = await supabase
        .from('bio_profiles')
        .select('*', { count: 'exact', head: true });

      const { data: viewsData } = await supabase
        .from('bio_profiles')
        .select('views');

      const totalViews = (viewsData || []).reduce((sum, b) => sum + (b.views || 0), 0);

      setStats({
        totalUsers: (profilesData || []).length,
        totalBio: bioCount || 0,
        totalViews,
        activeInvites: (invitesData || []).filter(i => i.is_active).length,
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async () => {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const code = crypto.randomUUID();
      
      const { error } = await supabase.from('inv_code').insert({
        code: code.toUpperCase(),
        is_active: true,
        max_uses: 1,
        current_uses: 0,
        created_by: user?.id,
      });

      if (error) throw error;
      await loadData();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setGenerating(false);
    }
  };

  const revokeCode = async (id: string) => {
    await supabase.from('inv_code').update({ is_active: false }).eq('id', id);
    await loadData();
  };

  const deleteCode = async (id: string) => {
    await supabase.from('inv_code').delete().eq('id', id);
    await loadData();
  };

  const changeRole = async (userId: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    await loadData();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredUsers = users.filter(u =>
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Shield size={18} className="text-orange-400" />
          Admin Panel
        </h1>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-widest">
          Complete site management
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
        {([
          { id: 'users' as const, label: 'Users', icon: Users, count: stats.totalUsers },
          { id: 'invites' as const, label: 'Invites', icon: Ticket, count: stats.activeInvites },
          { id: 'stats' as const, label: 'Statistics', icon: BarChart3 },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] uppercase tracking-wider font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-orange-500/15 text-orange-300 border border-orange-400/20'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/[0.02]'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[9px] bg-white/5">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search user..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
            <button onClick={loadData} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] text-[var(--text-muted)] hover:text-white transition-all">
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_140px_100px] gap-2 px-4 py-2 bg-white/[0.02] text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)]">
              <span>User</span>
              <span>Role</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {filteredUsers.map(user => (
              <div key={user.id} className="grid grid-cols-[1fr_100px_140px_100px] gap-2 px-4 py-3 border-t border-white/[0.04] items-center hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[11px] font-bold text-white/60">
                    {(user.username || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-white/80 truncate">{user.username || 'N/A'}</span>
                </div>
                <div>
                  {user.role === 'owner' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-black border border-white/20 text-white">
                      <Crown size={8} /> Owner
                    </span>
                  ) : user.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-yellow-500/10 border border-yellow-400/20 text-yellow-400">
                      <Shield size={8} /> Admin
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Member</span>
                  )}
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {new Date(user.created_at).toLocaleDateString('en-US')}
                </span>
                <div className="flex gap-1">
                  {user.role !== 'owner' && userRole === 'owner' && (
                    <>
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => changeRole(user.id, 'member')}
                          className="h-7 px-2 rounded-md text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-400/20 hover:bg-red-500/20 transition-all"
                          title="Demote"
                        >
                          <UserX size={11} />
                        </button>
                      ) : (
                        <button
                          onClick={() => changeRole(user.id, 'admin')}
                          className="h-7 px-2 rounded-md text-[9px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-500/20 transition-all"
                          title="Promote to Admin"
                        >
                          <UserCheck size={11} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="px-4 py-8 text-center text-[11px] text-[var(--text-muted)]">No users found</div>
            )}
          </div>
        </div>
      )}

      {/* Invites Tab */}
      {activeTab === 'invites' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={generateInviteCode}
              disabled={generating}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-orange-500/15 border border-orange-400/20 text-orange-300 text-[11px] uppercase tracking-wider font-bold hover:bg-orange-500/25 transition-all disabled:opacity-50"
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Generate code
            </button>
            <button onClick={loadData} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] text-[var(--text-muted)] hover:text-white transition-all">
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px_100px] gap-2 px-4 py-2 bg-white/[0.02] text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)]">
              <span>Code</span>
              <span>Status</span>
              <span>Uses</span>
              <span>Actions</span>
            </div>
            {invites.map(inv => (
              <div key={inv.id} className="grid grid-cols-[1fr_80px_80px_100px] gap-2 px-4 py-3 border-t border-white/[0.04] items-center hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/70 truncate">{inv.code}</span>
                  <button
                    onClick={() => copyCode(inv.code)}
                    className="shrink-0 h-6 w-6 flex items-center justify-center rounded-md hover:bg-white/5 transition-all text-[var(--text-muted)]"
                  >
                    {copiedCode === inv.code ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                  </button>
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-bold ${inv.is_active ? 'text-green-400' : 'text-red-400/60'}`}>
                  {inv.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {inv.current_uses}/{inv.max_uses || '∞'}
                </span>
                <div className="flex gap-1">
                  {inv.is_active && (
                    <button
                      onClick={() => revokeCode(inv.id)}
                      className="h-7 px-2 rounded-md text-[9px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-400/15 hover:bg-yellow-500/20 transition-all"
                    >
                      Revoke
                    </button>
                  )}
                  <button
                    onClick={() => deleteCode(inv.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-md text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {invites.length === 0 && (
              <div className="px-4 py-8 text-center text-[11px] text-[var(--text-muted)]">No invite codes</div>
            )}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Users', value: stats.totalUsers, icon: Users, color: '#f97316' },
              { label: 'Bio Pages', value: stats.totalBio, icon: BarChart3, color: '#fbbf24' },
              { label: 'Total views', value: stats.totalViews, icon: BarChart3, color: '#22c55e' },
              { label: 'Active invites', value: stats.activeInvites, icon: Ticket, color: '#f97316' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                  >
                    <stat.icon size={14} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] mt-1 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-[9px] uppercase tracking-[0.25em] font-bold text-[var(--text-muted)] mb-3">Recent signups</h3>
            <div className="space-y-2">
              {users.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center text-[9px] font-bold text-white/50">
                      {(user.username || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-xs text-white/70">{user.username}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {new Date(user.created_at).toLocaleDateString('en-US')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
