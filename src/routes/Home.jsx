import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LogOut, User, LayoutDashboard, Users, 
  Plus, Copy, Trash2, Globe, Palette, ShieldAlert,
  ChevronRight, Activity, Terminal as TerminalIcon
} from 'lucide-react';
import './Home.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(p || { username: 'User', role: 'member', bio: '', custom_color: '#ffb2f9' });
      setLoading(false);
    };
    fetchSession();
  }, [navigate]);

  if (loading) return <div className="loading-screen">LOADING SYSTEM...</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>SAGITARIUS<span className="pink-text">.CC</span></h1>
        </div>

        <nav className="nav-menu">
          <div className="nav-label">General</div>
          <NavBtn id="dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab} set={setActiveTab} />
          <NavBtn id="profile" icon={<Palette size={18}/>} label="Customization" active={activeTab} set={setActiveTab} />
          <NavBtn id="panel" icon={<Globe size={18}/>} label="Network Panel" active={activeTab} set={setActiveTab} />
          
          {profile.role === 'admin' && (
            <>
              <div className="nav-label">Administration</div>
              <NavBtn id="users" icon={<Users size={18}/>} label="Users" active={activeTab} set={setActiveTab} />
              <NavBtn id="invites" icon={<Plus size={18}/>} label="Invites" active={activeTab} set={setActiveTab} />
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
          <LogOut size={18} /> <span>Disconnect</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="breadcrumb">/{activeTab}</div>
          <div className="user-status">
            <span className={`badge ${profile.role}`}>{profile.role}</span>
            <span className="username">{profile.username}</span>
          </div>
        </header>

        <div className="view-container">
          {activeTab === 'dashboard' && <DashboardView profile={profile} />}
          {activeTab === 'profile' && <ProfileCustomizer profile={profile} setProfile={setProfile} />}
          {activeTab === 'panel' && <NetworkTools />}
          {activeTab === 'users' && <UsersAdmin />}
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

/* --- ONGLET : NETWORK PANEL --- */
function NetworkTools() {
  const [host, setHost] = useState('');
  const [logs, setLogs] = useState([]);

  const handlePing = () => {
    if (!host) return;
    setLogs([`Tracing route to ${host}...`, `Request timed out.`, `Reply from ${host}: bytes=32 time=12ms`]);
  };

  return (
    <div className="panel animate-in">
      <h3>Network Utilities</h3>
      <div className="input-group">
        <input className="dark-input" placeholder="IP Address / Domain" value={host} onChange={e => setHost(e.target.value)} />
        <button className="pink-btn" onClick={handlePing}>Execute Ping</button>
      </div>
      <div className="terminal-output">
        {logs.map((l, i) => <div key={i} className="log-row"><ChevronRight size={14}/> {l}</div>)}
      </div>
    </div>
  );
}

/* --- ONGLET : CUSTOMIZATION (STYLE PRIVATE) --- */
function ProfileCustomizer({ profile, setProfile }) {
  const [bio, setBio] = useState(profile.bio || '');
  const [color, setColor] = useState(profile.custom_color || '#ffb2f9');

  const save = async () => {
    await supabase.from('profiles').update({ bio, custom_color: color }).eq('id', profile.id);
    setProfile({...profile, bio, custom_color: color});
  };

  return (
    <div className="grid-layout">
      <div className="panel preview-box" style={{ borderColor: color }}>
        <div className="preview-header">
          <div className="avatar-circle" style={{ borderColor: color, color: color }}>{profile.username[0]}</div>
          <div>
            <h2 style={{ color: color }}>{profile.username}</h2>
            <p className="bio-display">{bio || "No bio set."}</p>
          </div>
        </div>
        <div className="preview-footer">
          <span className="uid-tag">UID: {profile.id?.slice(0, 8)}</span>
        </div>
      </div>

      <div className="panel">
        <h3>Identity Settings</h3>
        <label>Bio</label>
        <textarea className="dark-input" value={bio} onChange={e => setBio(e.target.value)} />
        <label>Accent Color</label>
        <input type="color" className="color-input" value={color} onChange={e => setColor(e.target.value)} />
        <button className="pink-btn" onClick={save}>Update Identity</button>
      </div>
    </div>
  );
}

function DashboardView({ profile }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <label>Status</label>
        <div className="val pink-text">ACTIVE</div>
      </div>
      <div className="stat-card">
        <label>Member Since</label>
        <div className="val">{new Date(profile.created_at).toLocaleDateString()}</div>
      </div>
    </div>
  );
}

function UsersAdmin() {
  return <div className="panel">Admin restricted area.</div>;
}