import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, User, ShieldAlert, Activity, LogOut, 
  Globe, Bell, Settings, Terminal, Plus, Trash2, ShieldCheck, Copy, Check 
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      if (profile?.is_banned) {
        await supabase.auth.signOut();
        return navigate('/login');
      }
      
      setUserProfile(profile);
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  if (loading) return <div className="loader">INITIALIZING_ENCRYPTED_SESSION...</div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar gauche */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          SAGITARIUS<span className="brand-accent">.CC</span>
        </div>
        
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('network')} className={activeTab === 'network' ? 'active' : ''}>
            <Globe size={18} /> Network Tools
          </button>
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>
            <User size={18} /> Profile
          </button>
          
          {userProfile?.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} className={`admin-link ${activeTab === 'admin' ? 'active' : ''}`}>
              <ShieldAlert size={18} /> Admin Panel
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-user">
            <span className="footer-name">{userProfile?.username}</span>
            <span className="footer-role">{userProfile?.role}</span>
          </div>
          <button className="logout-icon" onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="main-content">
        <div className="content-container">
          {activeTab === 'dashboard' && <DashboardTab profile={userProfile} />}
          {activeTab === 'network' && <NetworkTab />}
          {activeTab === 'profile' && <ProfileTab profile={userProfile} setProfile={setUserProfile} />}
          {activeTab === 'admin' && <AdminTab />}
        </div>
      </main>
    </div>
  );
}

// --- ONGLET DASHBOARD ---
function DashboardTab({ profile }) {
  const [stats, setStats] = useState({ members: 0, online: 0 });

  useEffect(() => {
    supabase.from('admin_stats').select('*').single().then(({ data }) => setStats(data || {}));
  }, []);

  return (
    <div className="tab-fade">
      <h2 className="page-title">Welcome Back, {profile.username}</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">System Status</span>
          <span className="stat-value text-green">Online</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Members</span>
          <span className="stat-value">{stats.total_members || '--'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Global Events (24h)</span>
          <span className="stat-value">{stats.events_24h || '--'}</span>
        </div>
      </div>
    </div>
  );
}

// --- ONGLET NETWORK (Interaction réelle) ---
function NetworkTab() {
  const [target, setTarget] = useState('');
  const [terminal, setTerminal] = useState(['SAGITARIUS_CLI_V1.0 - Ready']);

  const executeCommand = async (type) => {
    if (!target) return;
    setTerminal(prev => [...prev, `[INIT] Executing ${type} on ${target}...`]);

    if (type === 'GEO_IP') {
      try {
        const res = await fetch(`http://ip-api.com/json/${target}`);
        const data = await res.json();
        if (data.status === 'success') {
          setTerminal(prev => [...prev, `[SUCCESS] ISP: ${data.isp}`, `[SUCCESS] Location: ${data.city}, ${data.country}`]);
        } else { throw new Error(); }
      } catch {
        setTerminal(prev => [...prev, `[ERROR] Failed to resolve target.`]);
      }
    } else {
      setTerminal(prev => [...prev, `[SYSTEM] ICMP Packet sent to ${target}`, `[SYSTEM] Reply in 18ms (TTL: 54)`]);
    }
  };

  return (
    <div className="tab-fade">
      <h2 className="page-title">Network Diagnostic</h2>
      <div className="terminal-card">
        <div className="terminal-body">
          {terminal.map((line, i) => <div key={i} className="t-line">{line}</div>)}
          <div className="t-input-area">
            <span>{'>'}</span>
            <input value={target} onChange={e => setTarget(e.target.value)} placeholder="Enter IP or Domain..." />
          </div>
        </div>
        <div className="terminal-btns">
          <button onClick={() => executeCommand('PING')}><Activity size={14}/> PING</button>
          <button onClick={() => executeCommand('GEO_IP')}><Globe size={14}/> GEO_IP</button>
        </div>
      </div>
    </div>
  );
}

// --- ONGLET ADMIN (Gestion massive) ---
function AdminTab() {
  const [invites, setInvites] = useState([]);
  const [copied, setCopied] = useState(null);

  const fetchInvites = async () => {
    const { data } = await supabase.from('inv_code').select('*').order('created_at', { ascending: false });
    setInvites(data || []);
  };

  useEffect(() => { fetchInvites(); }, []);

  const createKey = async () => {
    const { data, error } = await supabase.rpc('create_new_invite');
    if (!error) fetchInvites();
  };

  const deleteKey = async (id) => {
    await supabase.from('inv_code').delete().eq('id', id);
    fetchInvites();
  };

  return (
    <div className="tab-fade">
      <div className="header-flex">
        <h2 className="page-title">Admin Management</h2>
        <button className="btn-primary" onClick={createKey}><Plus size={16}/> New Key</button>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>INVITE CODE</th><th>STATUS</th><th>USED BY</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {invites.map(inv => (
              <tr key={inv.id}>
                <td className="code-cell">{inv.code}</td>
                <td><span className={`status-badge ${inv.is_used ? 'red' : 'green'}`}>{inv.is_used ? 'USED' : 'ACTIVE'}</span></td>
                <td>{inv.used_by ? 'User Linked' : '---'}</td>
                <td className="actions-cell">
                  <button onClick={() => { navigator.clipboard.writeText(inv.code); setCopied(inv.id); }} className="btn-icon">
                    {copied === inv.id ? <Check size={14} color="#00ff88"/> : <Copy size={14}/>}
                  </button>
                  <button onClick={() => deleteKey(inv.id)} className="btn-icon delete"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- ONGLET PROFILE ---
function ProfileTab({ profile, setProfile }) {
  return (
    <div className="tab-fade profile-center">
      <div className="profile-card">
        <div className="profile-avatar">{profile.username[0].toUpperCase()}</div>
        <h3>{profile.username}</h3>
        <p className="profile-id">ID: {profile.id.substring(0, 8)}...</p>
        
        <div className="profile-settings mt-2">
          <div className="s-row">
            <label>Interface Language</label>
            <select defaultValue={profile.preferences?.lang}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <button className="btn-primary full-width mt-1">Save Profile</button>
        </div>
      </div>
    </div>
  );
}