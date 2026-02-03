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
            {activeTab === 'docs' && <LuaDocsView />}
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

const PLANS = [
  { days: 7, label: '1 Week', price: 4.99, popular: false },
  { days: 30, label: '1 Month', price: 14.99, popular: true },
  { days: 77, label: '77 Days', price: 29.99, popular: false },
  { days: 180, label: '180 Days', price: 59.99, popular: false }
];

const SubscriptionView = ({ isSubscribed, profile, inviteCode, setInviteCode, handleActivate }) => {
  const subEnds = profile?.subscription_ends_at ? new Date(profile.subscription_ends_at) : null;
  const subActive = subEnds && subEnds > new Date();
  const amountPaid = Number(profile?.subscription_amount_paid ?? 0);

  const handlePurchase = (days, price, isUpgrade = false) => {
    const amountToCharge = isUpgrade ? Math.max(0, price - amountPaid) : price;
    if (isUpgrade && amountToCharge === 0) return;
    // TODO: Intégrer Stripe avec amountToCharge et duration days
    const stripeUrl = `https://buy.stripe.com/checkout?price=${amountToCharge}&duration=${days}&upgrade=${isUpgrade}`;
    window.open(stripeUrl, '_blank');
  };

  return (
  <div className="view-fade">
    {isSubscribed ? (
      <>
        <div className="sub-active-card">
          <CheckCircle2 size={40} />
          <h3>Subscription Active</h3>
          <p>Your hardware is authorized for injection.</p>
          {subActive && subEnds && (
            <p className="sub-expiry">Valid until {subEnds.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          )}
          {amountPaid > 0 && (
            <p className="sub-credit">Credit toward upgrade: ${amountPaid.toFixed(2)}</p>
          )}
        </div>

        <div className="purchase-section upgrade-section">
          <h4 className="purchase-title">Upgrade your plan</h4>
          <p className="purchase-desc">Pay the difference: new plan price minus what you already paid.</p>
          <div className="plans-grid">
            {PLANS.map((plan) => {
              const upgradePrice = Math.max(0, plan.price - amountPaid);
              const isAlreadyCovered = upgradePrice === 0;
              return (
                <div key={plan.days} className={`plan-card ${plan.popular ? 'plan-popular' : ''}`}>
                  {plan.popular && <span className="plan-badge">Popular</span>}
                  <div className="plan-duration">{plan.label}</div>
                  <div className="plan-price">${plan.price.toFixed(2)}</div>
                  {amountPaid > 0 && (
                    <div className="plan-upgrade-price">
                      {isAlreadyCovered ? 'Already covered' : `Upgrade for $${upgradePrice.toFixed(2)}`}
                    </div>
                  )}
                  <button
                    className="plan-btn"
                    onClick={() => handlePurchase(plan.days, plan.price, true)}
                    disabled={isAlreadyCovered}
                  >
                    {isAlreadyCovered ? 'Included' : 'Upgrade'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="sub-form">
          <KeyRound size={40} className="mb-4 text-zinc-600" />
          <h3>Activate License</h3>
          <p>Enter your license key to unlock the loader.</p>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="SAG-XXXX-XXXX-XXXX" 
              value={inviteCode} 
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
            <button onClick={handleActivate}>Activate</button>
          </div>
        </div>
        
        <div className="purchase-section">
          <h4 className="purchase-title">Or purchase a subscription</h4>
          <div className="plans-grid">
            {PLANS.map((plan) => (
              <div key={plan.days} className={`plan-card ${plan.popular ? 'plan-popular' : ''}`}>
                {plan.popular && <span className="plan-badge">Popular</span>}
                <div className="plan-duration">{plan.label}</div>
                <div className="plan-price">${plan.price.toFixed(2)}</div>
                <button 
                  className="plan-btn" 
                  onClick={() => handlePurchase(plan.days, plan.price, false)}
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>
      </>
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
          <span className="admin-desc">Inscription — format UUID</span>
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
          <span className="admin-desc">Abonnement — format SAG</span>
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
              <span className={`key-type type-license`}>SAG</span>
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

const LuaDocsView = () => {
  const [activeSection, setActiveSection] = useState('globals');
  
  const sections = [
    { id: 'globals', title: 'Globals' },
    { id: 'callbacks', title: 'Callbacks' },
    { id: 'usercmd', title: 'UserCmd' },
    { id: 'engine', title: 'Engine' },
    { id: 'entity', title: 'Entity' },
    { id: 'render', title: 'Render' },
    { id: 'trace', title: 'Trace' },
    { id: 'utils', title: 'Utils' }
  ];

  return (
    <div className="lua-docs">
      <div className="docs-sidebar">
        <h3>Table of Contents</h3>
        <nav className="docs-nav">
          {sections.map(s => (
            <button
              key={s.id}
              className={`docs-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              {s.title}
            </button>
          ))}
        </nav>
      </div>
      <div className="docs-content">
        {activeSection === 'globals' && (
          <div className="docs-section">
            <h2>Globals</h2>
            <p>Global variables and functions available everywhere.</p>
            <table className="docs-table">
              <thead><tr><th>Function</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>print(...)</code></td><td>Print to console.</td></tr>
                <tr><td><code>realtime()</code></td><td>Get time since game start.</td></tr>
                <tr><td><code>curtime()</code></td><td>Get current server time.</td></tr>
                <tr><td><code>frametime()</code></td><td>Get time taken to render last frame.</td></tr>
                <tr><td><code>tickcount()</code></td><td>Get current tick count.</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'callbacks' && (
          <div className="docs-section">
            <h2>Callbacks</h2>
            <p>Register functions to be called at specific events.</p>
            <p><code>callbacks.register(event_name, unique_name, function)</code></p>
            <table className="docs-table">
              <thead><tr><th>Event Name</th><th>Description</th><th>Arguments</th></tr></thead>
              <tbody>
                <tr><td><code>paint</code></td><td>Called every frame for rendering.</td><td><code>none</code></td></tr>
                <tr><td><code>createmove</code></td><td>Called every tick for movement.</td><td><code>cmd</code></td></tr>
                <tr><td><code>draw_model</code></td><td>Called before drawing a model (chams).</td><td><code>context</code></td></tr>
                <tr><td><code>fire_event</code></td><td>Called when a game event fires.</td><td><code>event</code></td></tr>
                <tr><td><code>unload</code></td><td>Called when script is unloaded.</td><td><code>none</code></td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'usercmd' && (
          <div className="docs-section">
            <h2>UserCmd</h2>
            <p>Control player input. (Object passed in <code>createmove</code>)</p>
            <table className="docs-table">
              <thead><tr><th>Field/Method</th><th>Description</th><th>Type</th></tr></thead>
              <tbody>
                <tr><td><code>cmd.command_number</code></td><td>Command sequence number.</td><td><code>int</code></td></tr>
                <tr><td><code>cmd.tick_count</code></td><td>Tick count for this command.</td><td><code>int</code></td></tr>
                <tr><td><code>cmd.viewangles</code></td><td>Player view angles.</td><td><code>QAngle</code></td></tr>
                <tr><td><code>cmd.forwardmove</code></td><td>Forward/Backward movement.</td><td><code>float</code></td></tr>
                <tr><td><code>cmd.sidemove</code></td><td>Left/Right movement.</td><td><code>float</code></td></tr>
                <tr><td><code>cmd.buttons</code></td><td>Input buttons bitmask.</td><td><code>int</code></td></tr>
                <tr><td><code>cmd:get_mouse_x()</code></td><td>Mouse delta X.</td><td><code>int</code></td></tr>
                <tr><td><code>cmd:get_mouse_y()</code></td><td>Mouse delta Y.</td><td><code>int</code></td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'engine' && (
          <div className="docs-section">
            <h2>Engine</h2>
            <p>Interact with the game engine.</p>
            <table className="docs-table">
              <thead><tr><th>Function</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>engine.in_game()</code></td><td>Check if connected and in-game.</td></tr>
                <tr><td><code>engine.is_connected()</code></td><td>Check if connected to server.</td></tr>
                <tr><td><code>engine.get_local_player()</code></td><td>Get local player entity index.</td></tr>
                <tr><td><code>engine.get_screen_size()</code></td><td>Get screen width and height.</td></tr>
                <tr><td><code>engine.get_view_angles()</code></td><td>Get current view angles.</td></tr>
                <tr><td><code>engine.set_view_angles(ang)</code></td><td>Set view angles.</td></tr>
                <tr><td><code>engine.get_max_clients()</code></td><td>Get max players on server.</td></tr>
                <tr><td><code>engine.exec(cmd)</code></td><td>Execute console command.</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'entity' && (
          <div className="docs-section">
            <h2>Entity</h2>
            <p>Interact with game entities.</p>
            <p><code>entity.get(index)</code> → returns Entity Object</p>
            <p><code>entity.get_local_player()</code> → returns Entity Object</p>
            <table className="docs-table">
              <thead><tr><th>Method</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>ent:get_index()</code></td><td>Get entity index.</td></tr>
                <tr><td><code>ent:is_valid()</code></td><td>Check if entity is valid.</td></tr>
                <tr><td><code>ent:is_alive()</code></td><td>Check if player is alive.</td></tr>
                <tr><td><code>ent:is_dormant()</code></td><td>Check if entity is dormant.</td></tr>
                <tr><td><code>ent:get_class_id()</code></td><td>Get class ID.</td></tr>
                <tr><td><code>ent:get_prop_int(name)</code></td><td>Get integer netvar/prop.</td></tr>
                <tr><td><code>ent:get_prop_float(name)</code></td><td>Get float netvar/prop.</td></tr>
                <tr><td><code>ent:get_prop_vector(name)</code></td><td>Get vector netvar/prop.</td></tr>
                <tr><td><code>ent:get_origin()</code></td><td>Get entity position.</td></tr>
                <tr><td><code>ent:get_eye_pos()</code></td><td>Get eye position.</td></tr>
                <tr><td><code>ent:get_bbox()</code></td><td>Get bounding box {x, y, w, h}.</td></tr>
                <tr><td><code>ent:get_name()</code></td><td>Get player name.</td></tr>
                <tr><td><code>ent:get_weapon()</code></td><td>Get active weapon entity.</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'render' && (
          <div className="docs-section">
            <h2>Render</h2>
            <p>Draw shapes and text to the screen. (Use in <code>paint</code> callback)</p>
            <table className="docs-table">
              <thead><tr><th>Function</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>render.rect(x, y, w, h, color)</code></td><td>Draw outlined rectangle.</td></tr>
                <tr><td><code>render.filled_rect(x, y, w, h, color)</code></td><td>Draw filled rectangle.</td></tr>
                <tr><td><code>render.line(x1, y1, x2, y2, color)</code></td><td>Draw line.</td></tr>
                <tr><td><code>render.circle(x, y, radius, color)</code></td><td>Draw circle.</td></tr>
                <tr><td><code>render.text(font, x, y, color, text)</code></td><td>Draw text.</td></tr>
                <tr><td><code>render.create_font(name, size, weight, flags)</code></td><td>Create a font.</td></tr>
                <tr><td><code>render.get_text_size(font, text)</code></td><td>Get width and height of text.</td></tr>
                <tr><td><code>render.world_to_screen(vec)</code></td><td>Convert world pos to screen pos.</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'trace' && (
          <div className="docs-section">
            <h2>Trace</h2>
            <p>Raycasting utilities.</p>
            <table className="docs-table">
              <thead><tr><th>Function</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>trace.line(start, end, mask, skip_ent)</code></td><td>Trace a ray.</td></tr>
                <tr><td><code>trace.hull(start, end, min, max, mask, skip_ent)</code></td><td>Trace a hull (box).</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {activeSection === 'utils' && (
          <div className="docs-section">
            <h2>Utils</h2>
            <p>Helper functions.</p>
            <table className="docs-table">
              <thead><tr><th>Function</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>utils.create_interface(module, name)</code></td><td>Get raw interface pointer.</td></tr>
                <tr><td><code>utils.pattern_scan(module, signature)</code></td><td>Find pattern in memory.</td></tr>
                <tr><td><code>utils.color(r, g, b, a)</code></td><td>Create a color object.</td></tr>
                <tr><td><code>utils.vector(x, y, z)</code></td><td>Create a vector object.</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};