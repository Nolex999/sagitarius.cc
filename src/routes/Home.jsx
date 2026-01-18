// src/routes/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, User, ShieldAlert, Activity, 
  LogOut, Globe, Bell, Settings, Terminal 
} from 'lucide-react';
import './Home.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');

    // Récupérer le profil complet depuis la table SQL
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setUserProfile(profile);

    // Si Admin, on récupère la vue SQL 'admin_stats'
    if (profile?.role === 'admin') {
      const { data: stats } = await supabase.from('admin_stats').select('*').single();
      setAdminStats(stats);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div className="loader">INITIALIZING_SYSTEM...</div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar Gauche */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-dot"></span>
          SAGITARIUS
        </div>
        
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('network')} className={activeTab === 'network' ? 'active' : ''}>
            <Globe size={20} /> Network Tools
          </button>
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>
            <User size={20} /> Profile
          </button>
          
          {userProfile?.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} className={`admin-link ${activeTab === 'admin' ? 'active' : ''}`}>
              <ShieldAlert size={20} /> Admin Panel
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="avatar-small"></div>
            <span>{userProfile?.username}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}><LogOut size={18} /></button>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="main-content">
        <header className="content-header">
          <h2>{activeTab.toUpperCase()}</h2>
          <div className="system-status">
            <span className="status-indicator"></span> SYSTEM_ONLINE
          </div>
        </header>

        <section className="tab-container">
          {activeTab === 'dashboard' && <DashboardTab profile={userProfile} />}
          {activeTab === 'network' && <NetworkTab />}
          {activeTab === 'profile' && <ProfileTab profile={userProfile} />}
          {activeTab === 'admin' && <AdminTab stats={adminStats} />}
        </section>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS DES ONGLETS ---

const DashboardTab = ({ profile }) => (
  <div className="grid-view">
    <div className="card welcome-card">
      <h3>Welcome back, {profile?.username}</h3>
      <p>Last login: {new Date(profile?.last_login).toLocaleString()}</p>
      <div className="role-tag">{profile?.role}</div>
    </div>
    <div className="card news-card">
      <h3>System News</h3>
      <ul>
        <li>• V1.0 Launch: Invitation system active.</li>
        <li>• Security: All logs are now encrypted.</li>
      </ul>
    </div>
  </div>
);

const NetworkTab = () => {
  const [target, setTarget] = useState('');
  const [pingResult, setPingResult] = useState([]);

  const simulatePing = () => {
    setPingResult(prev => [...prev, `Pinging ${target}...`, `Reply from ${target}: bytes=32 time=24ms`]);
  };

  return (
    <div className="card terminal-card">
      <div className="terminal-header"><Terminal size={14}/> Network_Terminal</div>
      <div className="terminal-body">
        {pingResult.map((line, i) => <div key={i} className="line">{line}</div>)}
        <div className="input-line">
          <span>&gt;</span>
          <input 
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
            placeholder="enter_target_ip..." 
            onKeyPress={(e) => e.key === 'Enter' && simulatePing()}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ profile }) => (
  <div className="card profile-settings">
    <div className="profile-header">
      <div className="avatar-large"></div>
      <button className="btn-secondary">Change Avatar</button>
    </div>
    <div className="settings-group">
      <label>Language</label>
      <select defaultValue={profile?.preferences?.lang}>
        <option value="fr">French</option>
        <option value="en">English</option>
      </select>
    </div>
    <button className="submit-btn">Save Changes</button>
  </div>
);

const AdminTab = ({ stats }) => (
  <div className="admin-grid">
    <div className="stat-box">
      <span className="label">Total Members</span>
      <span className="value">{stats?.total_members || 0}</span>
    </div>
    <div className="stat-box">
      <span className="label">Online Now</span>
      <span className="value pulse">{stats?.online_now || 0}</span>
    </div>
    <div className="stat-box">
      <span className="label">Active Keys</span>
      <span className="value">{stats?.active_keys || 0}</span>
    </div>
  </div>
);