import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LogOut, User, Shield, Terminal, 
  Copy, Check, Plus, Ticket, Activity 
} from 'lucide-react';
import './Home.css'; // Nous créerons ce fichier CSS juste après

// Init Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const navigate = useNavigate();
  
  // États
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      // 1. Récupérer l'utilisateur Auth
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      // 2. Vérifier si Admin (Ici, on peut soit vérifier une table 'profiles', soit une liste d'emails en dur pour commencer)
      // Pour faire "pro", on suppose qu'il y a une table profiles avec une colonne 'role'
      // Si tu n'as pas de table profile, remplace par : const isUserAdmin = user.email === 'ton_email@admin.com';
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fallback si pas de table profile encore : on utilise les métadonnées
      const metaUsername = user.user_metadata.username || 'User';
      
      setProfile(profileData || { username: metaUsername, role: 'member' });
      
      // LOGIQUE ADMIN : Si le profil dit 'admin' OU si c'est ton email spécifique
      if (profileData) {
        setProfile(profileData);
        setIsAdmin(profileData.role === 'admin'); // Mise à jour automatique de l'état
        console.log("Rôle actuel détecté :", profileData.role);
      } else {
        const metaUsername = user.user_metadata.username || 'User';
        setProfile({ username: metaUsername, role: 'member' });
      }

    } catch (error) {
      console.error('Error loading user data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="loading-screen">INITIALIZING SYSTEM...</div>;

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SAGITARIUS</h2>
          <span className="version">v1.0.4-b</span>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>Profile</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={20} />
            <span>Status</span>
          </button>

          {/* Onglet Admin visible uniquement si isAdmin */}
          {isAdmin && (
            <div className="admin-section">
              <div className="divider"><span>ADMINISTRATION</span></div>
              <button 
                className={`nav-item danger ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <Shield size={20} />
                <span>Panel Admin</span>
              </button>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Disconnect</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-content">
        <header className="top-bar">
          <h3>/{activeTab.toUpperCase()}</h3>
          <div className="user-badge">
            <span className="status-dot"></span>
            {user.email}
          </div>
        </header>

        <div className="content-wrapper">
          {activeTab === 'profile' && <ProfileTab user={user} profile={profile} />}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'admin' && isAdmin && <AdminPanel user={user} />}
        </div>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS (Pour garder le code propre) ---

function ProfileTab({ user, profile }) {
  return (
    <div className="panel profile-panel">
      <div className="profile-header">
        <div className="avatar-placeholder">{profile.username[0].toUpperCase()}</div>
        <div>
          <h1>{profile.username}</h1>
          <span className="role-badge">{profile.role || 'MEMBER'}</span>
        </div>
      </div>
      
      <div className="info-grid">
        <div className="info-card">
          <label>UUID</label>
          <code>{user.id}</code>
        </div>
        <div className="info-card">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
        <div className="info-card">
          <label>Last Sign In</label>
          <p>{new Date(user.last_sign_in_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="panel">
      <div className="placeholder-content">
        <Terminal size={48} className="flicker" />
        <h2>SYSTEM ONLINE</h2>
        <p>Welcome to the private network. No alerts detected.</p>
      </div>
    </div>
  );
}

function AdminPanel({ user }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les invites existantes
  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    const { data } = await supabase
      .from('inv_code')
      .select('*')
      .order('created_at', { ascending: false });
    if(data) setInvites(data);
  };

  const createInvite = async () => {
    setLoading(true);
    // Génération UUID
    const newCode = crypto.randomUUID(); 
    
    try {
      const { error } = await supabase
        .from('inv_code')
        .insert([{ 
          code: newCode, 
          is_used: false,
          created_by: user.id // Assure-toi que cette colonne existe ou retire-la
        }]);

      if (error) throw error;
      await fetchInvites();
    } catch (err) {
      alert("Erreur création invite: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel admin-panel">
      <div className="panel-header">
        <h2>Invitation Management</h2>
        <button className="action-btn" onClick={createInvite} disabled={loading}>
          <Plus size={16} />
          {loading ? 'Generating...' : 'Generate New Key'}
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((inv) => (
              <tr key={inv.id} className={inv.is_used ? 'used' : 'active'}>
                <td className="code-font">{inv.code}</td>
                <td>
                  <span className={`status-badge ${inv.is_used ? 'red' : 'green'}`}>
                    {inv.is_used ? 'USED' : 'AVAILABLE'}
                  </span>
                </td>
                <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                <td>
                  {!inv.is_used && (
                    <CopyButton text={inv.code} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Petit utilitaire pour copier
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="icon-btn" onClick={handleCopy} title="Copy Code">
      {copied ? <Check size={16} color="#4ade80"/> : <Copy size={16} />}
    </button>
  );
}