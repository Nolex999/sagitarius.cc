import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LogOut, User, Shield, LayoutDashboard, 
  FileText, Users, Bell, Settings, 
  Check, X, AlertTriangle, Activity, Plus, Copy, Trash2
} from 'lucide-react';
import './Home.css';

// Init Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const navigate = useNavigate();
  
  // États Globaux
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      // Récupération du profil complet
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (profileData) {
        // Vérification si BANNIS
        if (profileData.is_banned) {
          await supabase.auth.signOut();
          alert("ACCÈS REFUSÉ : Ce compte a été suspendu par l'administration.");
          navigate('/login');
          return;
        }

        setProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
        
        // Log de connexion (Audit)
        await supabase.rpc('log_activity', { 
          p_event: 'AUTH_LOGIN', 
          p_desc: 'Connexion utilisateur au dashboard' 
        });

      } else {
        // Fallback (ne devrait pas arriver avec le bon SQL)
        setProfile({ username: user.email, role: 'guest' });
      }

    } catch (error) {
      console.error('Erreur init:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="loading-screen">SYSTEM LOADING...</div>;

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SAGITARIUS</h2>
          <span className="version">PRIVATE NETWORK v2.0</span>
        </div>

        <nav className="nav-menu">
          <div className="divider"><span>MENU PRINCIPAL</span></div>
          
          <NavButton id="dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab} set={setActiveTab} />
          <NavButton id="profile" icon={<User size={20}/>} label="Mon Profil" active={activeTab} set={setActiveTab} />
          
          {isAdmin && (
            <>
              <div className="divider"><span>ADMINISTRATION</span></div>
              <NavButton id="admin_users" icon={<Users size={20}/>} label="Utilisateurs" active={activeTab} set={setActiveTab} />
              <NavButton id="admin_invites" icon={<FileText size={20}/>} label="Invitations" active={activeTab} set={setActiveTab} />
              <NavButton id="admin_logs" icon={<Shield size={20}/>} label="Audit Logs" active={activeTab} set={setActiveTab} />
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="main-content">
        <header className="top-bar">
          <h3>/{activeTab.replace('_', ' ').toUpperCase()}</h3>
          <div className="user-badge">
            <span className={`status-dot ${isAdmin ? 'admin-dot' : ''}`}></span>
            {profile?.username} <span className="role-tag">[{profile?.role?.toUpperCase()}]</span>
          </div>
        </header>

        <div className="content-wrapper">
          {activeTab === 'dashboard' && <DashboardTab user={user} isAdmin={isAdmin} />}
          {activeTab === 'profile' && <ProfileTab user={user} profile={profile} refresh={checkSession} />}
          
          {/* Sections Admin */}
          {isAdmin && activeTab === 'admin_users' && <AdminUsers />}
          {isAdmin && activeTab === 'admin_invites' && <AdminInvites user={user} />}
          {isAdmin && activeTab === 'admin_logs' && <AdminLogs />}
        </div>
      </main>
    </div>
  );
}

// --- COMPOSANT BOUTON NAV ---
const NavButton = ({ id, icon, label, active, set }) => (
  <button 
    className={`nav-item ${active === id ? 'active' : ''}`}
    onClick={() => set(id)}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// ============================================================================
// 1. DASHBOARD TAB (Monitoring & Stats)
// ============================================================================
function DashboardTab({ isAdmin }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Si admin, on charge les stats globales via la vue SQL 'admin_stats'
    if (isAdmin) {
      supabase.from('admin_stats').select('*').single().then(({ data }) => setStats(data));
    }
  }, [isAdmin]);

  return (
    <div className="panel-grid">
      {/* Carte de Bienvenue */}
      <div className="panel welcome-panel">
        <h2>Système Opérationnel</h2>
        <p>Connexion sécurisée établie. Tous les services sont nominaux.</p>
      </div>

      {isAdmin && stats && (
        <div className="stats-row">
          <StatCard label="Membres Totaux" value={stats.total_members} color="blue" />
          <StatCard label="En Ligne (15m)" value={stats.online_now} color="green" />
          <StatCard label="Clés Actives" value={stats.active_keys} color="purple" />
          <StatCard label="Incidents 24h" value={stats.events_24h} color="red" />
        </div>
      )}

      {/* Activité récente (Placeholder pour l'instant) */}
      <div className="panel">
        <h3><Activity size={18}/> Flux d'activité récent</h3>
        <div className="empty-state">Aucune alerte critique détectée sur le réseau.</div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, color }) => (
  <div className={`stat-card border-${color}`}>
    <label>{label}</label>
    <div className="stat-value">{value}</div>
  </div>
);


// ============================================================================
// 2. PROFILE TAB (UX Utilisateur)
// ============================================================================
function ProfileTab({ user, profile, refresh }) {
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Charger l'historique personnel
    supabase.from('audit_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setLogs(data || []));
  }, [user.id]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', user.id);
    
    if (error) alert("Erreur: " + error.message);
    else {
      setEditMode(false);
      refresh();
    }
  };

  return (
    <div className="panel-grid">
      <div className="panel profile-main">
        <div className="profile-header-large">
          <div className="avatar-large">{profile.username[0].toUpperCase()}</div>
          <div className="profile-info">
            {editMode ? (
              <div className="edit-row">
                <input value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                <button onClick={handleUpdate}><Check size={16}/></button>
                <button onClick={() => setEditMode(false)}><X size={16}/></button>
              </div>
            ) : (
              <h1>{profile.username} <button className="icon-btn" onClick={() => setEditMode(true)}><Settings size={14}/></button></h1>
            )}
            <span className="role-badge">{profile.role}</span>
            <span className="id-badge">ID: {user.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3><Shield size={18}/> Sécurité & Historique</h3>
        <table className="simple-table">
          <thead><tr><th>Date</th><th>Action</th><th>IP (Simulé)</th></tr></thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleDateString()}</td>
                <td>{log.event_type}</td>
                <td className="mono">192.168.X.X</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================================
// 3. ADMIN USERS (Gestion des membres)
// ============================================================================
function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  const toggleBan = async (userId, currentStatus) => {
    if (!confirm(`Voulez-vous vraiment ${currentStatus ? 'débannir' : 'bannir'} cet utilisateur ?`)) return;
    
    await supabase.from('profiles').update({ is_banned: !currentStatus }).eq('id', userId);
    fetchUsers();
  };

  return (
    <div className="panel">
      <div className="panel-header"><h2>Gestion des Utilisateurs</h2></div>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Username</th><th>Rôle</th><th>Statut</th><th>Dernière Connexion</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className={u.is_banned ? 'banned-row' : ''}>
                <td>{u.username}</td>
                <td><span className="role-badge">{u.role}</span></td>
                <td>
                  {u.is_banned 
                    ? <span className="status-badge red">BANNIS</span> 
                    : <span className="status-badge green">ACTIF</span>
                  }
                </td>
                <td>{u.last_login ? new Date(u.last_login).toLocaleDateString() : '-'}</td>
                <td>
                  <button className="action-link" onClick={() => toggleBan(u.id, u.is_banned)}>
                    {u.is_banned ? 'Débannir' : 'Bannir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================================
// 4. ADMIN INVITES (Génération avancée)
// ============================================================================
function AdminInvites({ user }) {
  const [invites, setInvites] = useState([]);
  const [maxUses, setMaxUses] = useState(1);
  const [duration, setDuration] = useState(24); // Heures

  useEffect(() => { fetchInvites(); }, []);

  const fetchInvites = async () => {
    const { data } = await supabase.from('inv_code').select('*').order('created_at', { ascending: false });
    if(data) setInvites(data);
  };

  const createInvite = async () => {
    const code = crypto.randomUUID().substring(0, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(duration));

    const { error } = await supabase.from('inv_code').insert([{
      code,
      max_uses: maxUses,
      expires_at: expiresAt.toISOString(),
      created_by: user.id
    }]);

    if (error) alert("Erreur: " + error.message);
    else fetchInvites();
  };

  const deleteInvite = async (id) => {
    await supabase.from('inv_code').delete().eq('id', id);
    fetchInvites();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Générateur de Clés</h2>
        <div className="controls">
          <select value={maxUses} onChange={e => setMaxUses(e.target.value)} className="dark-select">
            <option value="1">Usage Unique</option>
            <option value="10">10 Usages</option>
            <option value="100">100 Usages</option>
            <option value="9999">Illimité</option>
          </select>
          <select value={duration} onChange={e => setDuration(e.target.value)} className="dark-select">
            <option value="24">24 Heures</option>
            <option value="48">48 Heures</option>
            <option value="168">7 Jours</option>
            <option value="8760">Permanent</option>
          </select>
          <button className="action-btn" onClick={createInvite}><Plus size={16}/> Créer Clé</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Code</th><th>Usages</th><th>Expire le</th><th>Action</th></tr></thead>
          <tbody>
            {invites.map(inv => (
              <tr key={inv.id}>
                <td className="code-font">{inv.code}</td>
                <td>{inv.current_uses} / {inv.max_uses}</td>
                <td>{new Date(inv.expires_at).toLocaleDateString()}</td>
                <td>
                  <CopyButton text={inv.code} />
                  <button className="icon-btn danger" onClick={() => deleteInvite(inv.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================================
// 5. ADMIN LOGS (Audit Trail)
// ============================================================================
function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    supabase.from('audit_logs')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setLogs(data || []));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header"><h2>Journal d'Audit Système</h2></div>
      <div className="table-container logs-container">
        <table>
          <thead><tr><th>Date</th><th>Utilisateur</th><th>Événement</th><th>Détails</th></tr></thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td className="text-dim">{new Date(log.created_at).toLocaleString()}</td>
                <td className="highlight">{log.profiles?.username || 'Système'}</td>
                <td><span className="tag">{log.event_type}</span></td>
                <td>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Utilitaires
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="icon-btn" onClick={handleCopy} title="Copier">
      {copied ? <Check size={16} color="#4ade80"/> : <Copy size={16} />}
    </button>
  );
}