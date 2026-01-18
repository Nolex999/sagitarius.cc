import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LogOut, User, Shield, LayoutDashboard, 
  Users, Settings, Check, X, Activity, 
  Plus, Copy, Trash2, Terminal as TerminalIcon,
  ShieldAlert, Database, Key, Clock, Globe, Zap, Palette
} from 'lucide-react';
import './Home.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return navigate('/login');
      setUser(authUser);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileData?.is_banned) {
        await supabase.auth.signOut();
        return navigate('/login');
      }
      setProfile(profileData || { username: 'User', role: 'guest', bio: '', custom_color: '#ffb2f9' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (requiredRole) => {
    const roles = ['guest', 'member', 'moderator', 'admin'];
    return roles.indexOf(profile?.role) >= roles.indexOf(requiredRole);
  };

  if (loading) return <div className="loading-screen">ACCESSING SAGITARIUS NETWORK...</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>SAGITARIUS<span className="brand-dot">.CC</span></h1>
          <p className="system-status">CORE INTERFACE v2.0</p>
        </div>

        <nav className="nav-menu">
          <div className="nav-label">General</div>
          <NavBtn id="dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab} set={setActiveTab} />
          <NavBtn id="profile" icon={<Palette size={18}/>} label="Customization" active={activeTab} set={setActiveTab} />
          <NavBtn id="tools" icon={<Globe size={18}/>} label="Network Panel" active={activeTab} set={setActiveTab} />
          
          {hasPermission('moderator') && (
            <>
              <div className="nav-label">Staff</div>
              <NavBtn id="users" icon={<Users size={18}/>} label="Users" active={activeTab} set={setActiveTab} />
              <NavBtn id="invites" icon={<Key size={18}/>} label="Invites" active={activeTab} set={setActiveTab} />
            </>
          )}

          {hasPermission('admin') && (
            <>
              <div className="nav-label">System</div>
              <NavBtn id="audit" icon={<ShieldAlert size={18}/>} label="Audit" active={activeTab} set={setActiveTab} />
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
            <LogOut size={18} /> <span>Disconnect</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="path">/sagitarius/{activeTab}</div>
          <div className="user-badge-header">
             <span className={`rank-tag ${profile.role}`}>{profile.role.toUpperCase()}</span>
             <span className="username-display">{profile.username}</span>
          </div>
        </header>

        <div className="content-scroll">
          {activeTab === 'dashboard' && <DashboardView profile={profile} />}
          {activeTab === 'profile' && <AdvancedProfile user={user} profile={profile} refresh={checkSession} />}
          {activeTab === 'tools' && <NetworkPanel />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'invites' && <InvitesView user={user} />}
        </div>
      </main>
    </div>
  );
}

function NavBtn({ id, icon, label, active, set }) {
  return (
    <button className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => set(id)}>
      {icon} <span>{label}</span>
    </button>
  );
}

/* --- NEW: NETWORK TOOLS PANEL --- */
function NetworkPanel() {
  const [target, setTarget] = useState('');
  const [results, setResults] = useState([]);
  const [pinging, setPinging] = useState(false);

  const runPing = () => {
    if (!target) return;
    setPinging(true);
    setResults([`Initiating trace to ${target}...`]);
    
    // Simulating real network response
    setTimeout(() => {
      setResults(prev => [...prev, `Reply from ${target}: bytes=32 time=14ms TTL=54`, `Reply from ${target}: bytes=32 time=12ms TTL=54`, `Connection stable.`]);
      setPinging(false);
    }, 1500);
  };

  return (
    <div className="panel">
      <h3><Globe size={18}/> Network Utilities</h3>
      <div className="tool-input-group">
        <input 
          placeholder="Enter IP or Domain..." 
          className="dark-input" 
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <button className="pink-btn" onClick={runPing} disabled={pinging}>
          {pinging ? 'Tracing...' : 'Run Ping'}
        </button>
      </div>
      <div className="terminal-box">
        {results.map((r, i) => <div key={i} className="log-entry">> {r}</div>)}
      </div>
    </div>
  );
}

/* --- NEW: ADVANCED PROFILE CUSTOMIZATION --- */
function AdvancedProfile({ user, profile, refresh }) {
  const [bio, setBio] = useState(profile.bio || '');
  const [color, setColor] = useState(profile.custom_color || '#ffb2f9');

  const saveProfile = async () => {
    await supabase.from('profiles').update({ bio, custom_color: color }).eq('id', user.id);
    refresh();
  };

  return (
    <div className="grid-2">
      <div className="panel profile-card-preview" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="preview-top">
          <div className="avatar-preview" style={{ boxShadow: `0 0 20px ${color}33`, borderColor: color }}>
            {profile.username[0]}
          </div>
          <div>
            <h2 style={{ color: color }}>{profile.username}</h2>
            <p className="bio-text">{bio || "No bio set."}</p>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Customize Identity</h3>
        <div className="form-group">
          <label>Profile Bio</label>
          <textarea className="dark-input" value={bio} onChange={e => setBio(e.target.value)} maxLength={150} />
        </div>
        <div className="form-group">
          <label>Accent Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="color-picker" />
        </div>
        <button className="pink-btn w-full" onClick={saveProfile}>Save Changes</button>
      </div>
    </div>
  );
}

/* --- VIEWS --- */
function DashboardView({ profile }) {
  return (
    <div className="fade-in">
      <div className="grid-3">
        <div className="stat-box border-pink">
          <label>Global Status</label>
          <div className="value pink-text">ONLINE</div>
        </div>
        <div className="stat-box">
          <label>Network Nodes</label>
          <div className="value">1,024</div>
        </div>
        <div className="stat-box">
          <label>Your Role</label>
          <div className="value">{profile.role.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => setUsers(data || []));
  }, []);

  return (
    <div className="panel">
      <h3>Network Directory</h3>
      <table className="admin-table">
        <thead><tr><th>Username</th><th>Rank</th><th>Status</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td><span className={`rank-tag ${u.role}`}>{u.role}</span></td>
              <td>{u.is_banned ? <span className="text-red">BANNED</span> : <span className="text-green">ACTIVE</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InvitesView({ user }) {
  const [invites, setInvites] = useState([]);
  const fetchInvites = async () => {
    const { data } = await supabase.from('inv_code').select('*').order('created_at', {ascending: false});
    setInvites(data || []);
  };
  useEffect(() => { fetchInvites(); }, []);

  const generate = async () => {
    const code = crypto.randomUUID().split('-')[0].toUpperCase();
    await supabase.from('inv_code').insert([{ code, created_by: user.id, expires_at: new Date(Date.now() + 86400000).toISOString() }]);
    fetchInvites();
  };

  return (
    <div className="panel">
      <div className="panel-header-flex">
        <h3>Access Keys</h3>
        <button className="pink-btn" onClick={generate}>Generate Key</button>
      </div>
      <table className="admin-table">
        <thead><tr><th>Key</th><th>Usage</th></tr></thead>
        <tbody>
          {invites.map(i => (
            <tr key={i.id}><td className="mono-pink">{i.code}</td><td>{i.is_used ? 'USED' : 'ACTIVE'}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}