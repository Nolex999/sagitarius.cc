import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, User, ShieldAlert, Activity, LogOut, 
  Globe, Bell, Settings, Terminal, Plus, Trash2, ShieldCheck, UserMinus 
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
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile?.is_banned) {
      await supabase.auth.signOut();
      alert("Votre compte a été banni.");
      return navigate('/login');
    }
    setUserProfile(profile);
    setLoading(false);
  };

  if (loading) return <div className="loader">SYSTEM_BOOT_IN_PROGRESS...</div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">SAGITARIUS<span className="dot">.CC</span></div>
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
          <div className="user-info">
            <span className="username">{userProfile?.username}</span>
            <span className="role">{userProfile?.role}</span>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}><LogOut size={18}/></button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard user={userProfile} />}
        {activeTab === 'network' && <NetworkTools />}
        {activeTab === 'profile' && <ProfileSettings user={userProfile} />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

// ================= SUB-COMPONENTS =================

function Dashboard({ user }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setLogs(data || []));
  }, []);

  return (
    <div className="content-fade">
      <h1 className="tab-title">Control Center</h1>
      <div className="grid-3">
        <div className="stat-card"><h3>Identity</h3><p>{user.username}</p></div>
        <div className="stat-card"><h3>Access Level</h3><p className="highlight">{user.role.toUpperCase()}</p></div>
        <div className="stat-card"><h3>Member Since</h3><p>{new Date(user.created_at).toLocaleDateString()}</p></div>
      </div>
      <div className="card mt-2">
        <h3>Recent Security Activity</h3>
        <div className="log-list">
          {logs.map(log => (
            <div key={log.id} className="log-item">
              <span className="time">{new Date(log.created_at).toLocaleTimeString()}</span>
              <span className="event">{log.event_type}</span>
              <span className="desc">{log.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NetworkTools() {
  const [host, setHost] = useState('');
  const [output, setOutput] = useState(['Waiting for input...']);

  const runTool = async (type) => {
    setOutput(prev => [...prev, `[INIT] Running ${type} on ${host}...`]);
    // Ici on simule ou on utilise une API réelle (ex: ip-api.com)
    if (type === 'GEO_IP') {
      try {
        const res = await fetch(`http://ip-api.com/json/${host}`);
        const data = await res.json();
        setOutput(prev => [...prev, `[RESULT] City: ${data.city}, ISP: ${data.isp}, Org: ${data.org}`]);
      } catch { setOutput(prev => [...prev, '[ERROR] Trace failed.']); }
    } else {
        setOutput(prev => [...prev, `[SYSTEM] ICMP Packet sent to ${host}...`, `[SYSTEM] Reply in 24ms`]);
    }
  };

  return (
    <div className="content-fade">
      <h1 className="tab-title">Network Diagnostic</h1>
      <div className="terminal-container card">
        <div className="terminal-header">SAGITARIUS_CLI_V1.0</div>
        <div className="terminal-body">
          {output.map((line, i) => <div key={i} className="terminal-line">{line}</div>)}
          <div className="terminal-input-row">
            <span>{'>'}</span>
            <input value={host} onChange={e => setHost(e.target.value)} placeholder="IP or Domain..." />
          </div>
        </div>
        <div className="terminal-actions">
          <button onClick={() => runTool('PING')}><Activity size={14}/> PING</button>
          <button onClick={() => runTool('GEO_IP')}><Globe size={14}/> GEO_IP</button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [invites, setInvites] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const { data: inv } = await supabase.from('inv_code').select('*').order('created_at', { ascending: false });
    const { data: st } = await supabase.from('admin_stats').select('*').single();
    setInvites(inv || []);
    setStats(st || {});
  };

  const generateKey = async () => {
    const { data, error } = await supabase.rpc('create_new_invite', { p_max_uses: 1 });
    if (!error) refreshData();
  };

  const deleteKey = async (id) => {
    await supabase.from('inv_code').delete().eq('id', id);
    refreshData();
  };

  return (
    <div className="content-fade">
      <h1 className="tab-title">Administration</h1>
      <div className="grid-3 mb-2">
        <div className="stat-card"><h3>Users</h3><p>{stats.total_members}</p></div>
        <div className="stat-card"><h3>Online</h3><p className="pulse-text">{stats.online_now}</p></div>
        <div className="stat-card"><h3>Active Keys</h3><p>{stats.active_keys}</p></div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Invitation Management</h3>
          <button className="btn-small" onClick={generateKey}><Plus size={14}/> Create Key</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr><th>Code</th><th>Status</th><th>Used By</th><th>Action</th></tr>
          </thead>
          <tbody>
            {invites.map(inv => (
              <tr key={inv.id}>
                <td className="code-text">{inv.code}</td>
                <td><span className={`badge ${inv.is_used ? 'red' : 'green'}`}>{inv.is_used ? 'USED' : 'READY'}</span></td>
                <td>{inv.used_by || '---'}</td>
                <td><button onClick={() => deleteKey(inv.id)} className="btn-icon"><Trash2 size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfileSettings({ user }) {
  return (
    <div className="content-fade">
      <h1 className="tab-title">Profile Personalization</h1>
      <div className="card profile-grid">
        <div className="avatar-section">
          <div className="large-avatar">{user.username[0]}</div>
          <button className="btn-secondary">Upload Photo</button>
        </div>
        <div className="form-section">
          <div className="form-group">
            <label>Username</label>
            <input disabled value={user.username} />
          </div>
          <div className="form-group">
            <label>Language Preferences</label>
            <select defaultValue={user.preferences?.lang}>
              <option value="fr">French (Français)</option>
              <option value="en">English</option>
            </select>
          </div>
          <button className="submit-btn">Update Profile</button>
        </div>
      </div>
    </div>
  );
}