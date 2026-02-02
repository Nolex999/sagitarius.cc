import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Shield, Download, FileCode, Gem, LogOut, 
  Users, Zap, CheckCircle2, Lock, Plus, Trash2, Ban, 
  Activity, Fingerprint, KeyRound, AlertTriangle
} from 'lucide-react';
import './Home.css';
import logoMain from '../assets/logo.svg'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/login'); return; }

    // 1. Récupérer le profil (peut être null si trigger pas encore exécuté)
    let { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    
    // Fallback: profil pas encore créé (trigger en retard) - réessayer une fois
    if (!prof) {
      await new Promise(r => setTimeout(r, 1500));
      const { data: retry } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      prof = retry;
    }
    
    // Fallback: utiliser les metadata si toujours pas de profil
    if (!prof) {
      prof = {
        id: session.user.id,
        username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
        role: 'member',
        is_banned: false
      };
    }
    
    // 2. Vérifier abonnement : used_by OU subscription_ends_at
    const { data: invite } = await supabase.from('inv_code').select('id').eq('used_by', session.user.id).maybeSingle();
    const subEnds = prof?.subscription_ends_at ? new Date(prof.subscription_ends_at) : null;
    const hasActiveSub = !!invite && (!subEnds || subEnds > new Date());
    
    setProfile(prof);
    setIsSubscribed(!!hasActiveSub);
    setLoading(false);
  };

  const handleActivateCode = async () => {
    if (!inviteCode) return;
    const { data } = await supabase.rpc('use_license_key', { p_code: inviteCode.trim().toUpperCase() });
    
    if (data?.success) {
      alert("Accès autorisé !");
      fetchUserData(); // Refresh l'état depuis la DB
    } else {
      alert(data?.message || "Erreur lors de l'activation");
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (loading) return <div className="loader-screen"><div className="spinner"></div></div>;
  if (profile?.is_banned) return <div className="banned-overlay">TERMINATED</div>;

  return (
    <div className="dashboard-root">
      {/* Animated Background */}
      <div className="bg-animated">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="main-container glass-panel">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon"><img src={logoMain} alt="logo" /></div>
            <span>SAGITARIUS</span>
          </div>

          <nav className="nav-list">
            <NavItem icon={User} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <NavItem icon={Gem} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            <NavItem icon={Download} label="Download" active={activeTab === 'download'} onClick={() => setActiveTab('download')} />
            <NavItem icon={FileCode} label="Lua Docs" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
            {profile?.role === 'admin' && (
              <NavItem icon={Shield} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} color="#3b82f6" />
            )}
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        </aside>

        {/* CONTENT */}
        <main className="content-area">
          <header className="content-header">
            <div className="header-left">
              <h1>{activeTab.toUpperCase()}</h1>
              {profile?.role === 'admin' && (
                <DashboardStats profile={profile} />
              )}
            </div>
            <div className="status-badge">
              <div className={`dot ${isSubscribed ? 'active' : ''}`}></div>
              {isSubscribed ? 'PREMIUM ACCESS' : 'NO LICENSE'}
            </div>
          </header>

          <div className="scroll-content">
            {activeTab === 'profile' && <ProfileView profile={profile} isSubscribed={isSubscribed} />}
            {activeTab === 'subscription' && (
              <SubscriptionView 
                isSubscribed={isSubscribed} 
                profile={profile}
                inviteCode={inviteCode} 
                setInviteCode={setInviteCode} 
                handleActivate={handleActivateCode} 
              />
            )}
            {activeTab === 'download' && <DownloadView isSubscribed={isSubscribed} />}
            {activeTab === 'docs' && <ComingSoon title="LUA DOCUMENTATION" />}
            {activeTab === 'admin' && <AdminPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

const DashboardStats = ({ profile }) => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    if (profile?.role !== 'admin') return;
    const fetchStats = async () => {
      const { data } = await supabase.rpc('get_admin_stats');
      if (data && !data.error) setStats(data);
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [profile?.role]);

  if (!stats) return null;
  return (
    <div className="dashboard-stats">
      <StatPill icon={Users} value={stats.total_members} label="Members" />
      <StatPill icon={Zap} value={stats.online_now} label="Online" />
      <StatPill icon={KeyRound} value={stats.active_keys} label="Keys" />
      <StatPill icon={Activity} value={stats.events_24h} label="24h" />
    </div>
  );
};

const StatPill = ({ icon: Icon, value, label }) => (
  <div className="stat-pill">
    <Icon size={14} />
    <span className="stat-value">{value ?? 0}</span>
    <span className="stat-label">{label}</span>
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick, color }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
    <Icon size={18} style={{ color: active ? (color || '#3b82f6') : undefined }} />
    <span>{label}</span>
  </div>
);

const ProfileView = ({ profile, isSubscribed }) => {
  const subEnds = profile?.subscription_ends_at ? new Date(profile.subscription_ends_at) : null;
  const subActive = subEnds && subEnds > new Date();
  const subLabel = subActive ? (subEnds.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })) : '—';
  return (
    <div className="view-fade">
      <div className="profile-card">
        <div className="avatar-large">{(profile?.username || 'U')[0].toUpperCase()}</div>
        <div className="profile-info">
          <h2>{profile?.username || 'User'}</h2>
          <p>{(profile?.role || 'member').toUpperCase()} MEMBER</p>
        </div>
      </div>
      <div className="grid-info">
        <InfoBox label="Hardware ID" value="Locked to session" icon={Fingerprint} />
        <InfoBox label="Account Status" value={profile?.is_banned ? 'Banned' : 'Active'} icon={Activity} />
        {isSubscribed && <InfoBox label="Subscription ends" value={subLabel} icon={Gem} />}
      </div>
    </div>
  );
};

const SubscriptionView = ({ isSubscribed, profile, inviteCode, setInviteCode, handleActivate }) => {
  const subEnds = profile?.subscription_ends_at ? new Date(profile.subscription_ends_at) : null;
  const subActive = subEnds && subEnds > new Date();
  return (
  <div className="view-fade">
    {isSubscribed ? (
      <div className="sub-active-card">
        <CheckCircle2 size={40} />
        <h3>Subscription Active</h3>
        <p>Your hardware is authorized for injection.</p>
        {subActive && subEnds && (
          <p className="sub-expiry">Valid until {subEnds.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        )}
      </div>
    ) : (
      <div className="sub-form">
        <KeyRound size={40} className="mb-4 text-zinc-600" />
        <h3>Activate License</h3>
        <p>Enter your license key to unlock the loader.</p>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="LIC-XXXX-XXXX-XXXX" 
            value={inviteCode} 
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
          <button onClick={handleActivate}>Activate</button>
        </div>
      </div>
    )}
  </div>
  );
};

const DownloadView = ({ isSubscribed }) => (
  <div className="view-fade text-center py-12">
    {!isSubscribed ? (
      <div className="locked-state">
        <Lock size={60} />
        <h2>Download Locked</h2>
        <p>You need an active subscription to download the client.</p>
      </div>
    ) : (
      <div className="unlocked-state">
        <div className="download-circle">
          <Download size={40} />
        </div>
        <h2>Sagitarius Client v4.0</h2>
        <button className="dl-btn">Download Now</button>
      </div>
    )}
  </div>
);

const AdminPanel = () => {
  const [keys, setKeys] = useState([]);
  const [genLoading, setGenLoading] = useState(null);
  const [newCode, setNewCode] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchKeys = async () => {
    const { data } = await supabase.from('inv_code').select('*').order('created_at', { ascending: false });
    setKeys(data || []);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleGenerateInvite = async () => {
    setGenLoading('invite');
    setNewCode(null);
    try {
      const { data, error } = await supabase.rpc('generate_invite_code', { p_expires_days: 7, p_max_uses: 1 });
      if (error) throw error;
      if (data?.success) {
        setNewCode({ code: data.code, type: 'invite' });
        fetchKeys();
      } else {
        alert(data?.message || 'Erreur');
      }
    } catch (err) {
      alert(err?.message || 'Erreur');
    } finally {
      setGenLoading(null);
    }
  };

  const handleGenerateLicense = async () => {
    setGenLoading('license');
    setNewCode(null);
    try {
      const { data, error } = await supabase.rpc('generate_license_key', { p_duration_days: 30, p_max_uses: 1, p_expires_days: 90 });
      if (error) throw error;
      if (data?.success) {
        setNewCode({ code: data.code, type: 'license' });
        fetchKeys();
      } else {
        alert(data?.message || 'Erreur');
      }
    } catch (err) {
      alert(err?.message || 'Erreur');
    } finally {
      setGenLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce code ?')) return;
    setDeletingId(id);
    try {
      const { data, error } = await supabase.rpc('delete_invite_code', { p_id: id });
      if (error) throw error;
      if (data?.success) {
        fetchKeys();
      } else {
        alert(data?.message || 'Erreur');
      }
    } catch (err) {
      alert(err?.message || 'Impossible de supprimer');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="view-fade admin-panel">
      <div className="admin-section">
        <div className="admin-header">
          <h3>Invite codes</h3>
          <span className="admin-desc">Inscription — format INVT</span>
          <button type="button" className="btn-small" onClick={handleGenerateInvite} disabled={genLoading}>
            <Plus size={14} /> {genLoading === 'invite' ? '...' : 'Generate'}
          </button>
        </div>
        {newCode?.type === 'invite' && (
          <div className="new-code-alert alert-invite">
            <strong>Invite:</strong>{' '}
            <code onClick={() => { navigator.clipboard?.writeText(newCode.code); alert('Copied!'); }} className="copyable-code" title="Click to copy">
              {newCode.code}
            </code>
          </div>
        )}
        <div className="key-list">
          {keys.filter(k => k.code_type === 'invite').map(k => (
            <div key={k.id} className="key-item">
              <code>{k.code}</code>
              <span className={`key-type type-invite`}>INV</span>
              <span className={k.is_used ? 'used' : 'unused'}>{k.is_used ? 'Used' : 'Available'}</span>
              <button type="button" className="delete-btn" onClick={() => handleDelete(k.id)} disabled={deletingId === k.id} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {keys.filter(k => k.code_type === 'invite').length === 0 && (
            <p className="key-empty">No invite codes yet</p>
          )}
        </div>
      </div>
      <div className="admin-section">
        <div className="admin-header">
          <h3>License keys</h3>
          <span className="admin-desc">Abonnement — format LIC</span>
          <button type="button" className="btn-small" onClick={handleGenerateLicense} disabled={genLoading}>
            <Plus size={14} /> {genLoading === 'license' ? '...' : 'Generate'}
          </button>
        </div>
        {newCode && (
          <div className={`new-code-alert ${newCode.type === 'license' ? 'alert-license' : 'alert-invite'}`}>
            <strong>{newCode.type === 'license' ? 'License' : 'Invite'}:</strong>{' '}
            <code onClick={() => { navigator.clipboard?.writeText(newCode.code); alert('Copied!'); }} className="copyable-code" title="Click to copy">
              {newCode.code}
            </code>
          </div>
        )}
        <div className="key-list">
          {keys.filter(k => k.code_type === 'license' || !k.code_type).map(k => (
            <div key={k.id} className="key-item">
              <code>{k.code}</code>
              <span className={`key-type type-license`}>LIC</span>
              <span className={k.is_used ? 'used' : 'unused'}>{k.is_used ? 'Used' : 'Available'}</span>
            <button
              type="button"
              className="delete-btn"
              onClick={() => handleDelete(k.id)}
              disabled={deletingId === k.id}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const InfoBox = ({ label, value, icon: Icon }) => (
  <div className="info-box">
    <Icon size={16} className="text-zinc-500" />
    <div>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  </div>
);

const ComingSoon = ({ title }) => (
  <div className="coming-soon">
    <AlertTriangle size={32} />
    <h3>{title}</h3>
    <p>This module is currently under development.</p>
  </div>
);
