import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LogOut, User, Shield, LayoutDashboard, 
  Users, Settings, Check, X, Activity, 
  Plus, Copy, Trash2, Terminal as TerminalIcon,
  ShieldAlert, Database, Key, Clock
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
      setProfile(profileData || { username: 'User', role: 'guest' });
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

  if (loading) return <div className="loading-screen">INITIALIZING SECURE SESSION...</div>;

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>SAGITARIUS<span className="brand-dot">.CC</span></h1>
          <p className="system-status">AUTHENTICATED AS {profile.role.toUpperCase()}</p>
        </div>

        <nav className="nav-menu">
          <div className="nav-label">Core</div>
          <NavBtn id="dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab} set={setActiveTab} />
          <NavBtn id="profile" icon={<User size={18}/>} label="Identity" active={activeTab} set={setActiveTab} />
          
          {hasPermission('moderator') && (
            <>
              <div className="nav-label">Moderation</div>
              <NavBtn id="users" icon={<Users size={18}/>} label="Network Nodes" active={activeTab} set={setActiveTab} />
              <NavBtn id="invites" icon={<Key size={18}/>} label="Access Keys" active={activeTab} set={setActiveTab} />
            </>
          )}

          {hasPermission('admin') && (
            <>
              <div className="nav-label">Security & Ops</div>
              <NavBtn id="audit" icon={<ShieldAlert size={18}/>} label="Audit Logs" active={activeTab} set={setActiveTab} />
              <NavBtn id="system" icon={<Database size={18}/>} label="System Config" active={activeTab} set={setActiveTab} />
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button className="terminal-toggle" onClick={() => setShowTerminal(!showTerminal)}>
            <TerminalIcon size={18} /> <span>Open Terminal</span>
          </button>
          <button className="logout-btn" onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
            <LogOut size={18} /> <span>Terminate</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <header className="top-header">
          <div className="path">/root/{activeTab}</div>
          <div className="user-badge-header">
             <span className="status-dot-online"></span>
             <span className="username-display">{profile.username}</span>
          </div>
        </header>

        <div className="content-scroll">
          {activeTab === 'dashboard' && <DashboardView profile={profile} isAdmin={hasPermission('admin')} />}
          {activeTab === 'profile' && <ProfileView user={user} profile={profile} refresh={checkSession} />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'invites' && <InvitesView user={user} />}
          {activeTab === 'audit' && <AuditView />}
          {activeTab === 'system' && <SystemConfigView />}
        </div>

        {showTerminal && <FakeTerminal user={profile.username} close={() => setShowTerminal(false)} />}
      </main>
    </div>
  );
}

/* ================= COMPOSANTS DE NAVIGATION ================= */
function NavBtn({ id, icon, label, active, set }) {
  return (
    <button className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => set(id)}>
      {icon} <span>{label}</span>
    </button>
  );
}

/* ================= VUE : DASHBOARD ================= */
function DashboardView({ profile, isAdmin }) {
  return (
    <div className="fade-in">
      <div className="grid-3">
        <div className="stat-box border-pink">
          <label>Network Status</label>
          <div className="value pink-text">ENCRYPTED</div>
        </div>
        <div className="stat-box">
          <label>Active Connections</label>
          <div className="value">42</div>
        </div>
        <div className="stat-box">
          <label>System Uptime</label>
          <div className="value">99.99%</div>
        </div>
      </div>

      <div className="panel mt-20">
        <h3><Activity size={18}/> System Notifications</h3>
        <div className="log-line"><span>[08:42:11]</span> Internal Kernel Update Applied.</div>
        <div className="log-line"><span>[10:15:03]</span> Security Handshake with 127.0.0.1 success.</div>
        <div className="log-line"><span>[12:00:00]</span> Welcome back, {profile.username}. Access granted.</div>
      </div>
    </div>
  );
}

/* ================= VUE : PROFILE ================= */
function ProfileView({ user, profile, refresh }) {
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);

  const handleUpdate = async () => {
    const { error } = await supabase.from('profiles').update({ username: newUsername }).eq('id', user.id);
    if (!error) { setEditMode(false); refresh(); }
  };

  return (
    <div className="panel profile-panel">
      <div className="profile-header">
        <div className="avatar-big">{profile.username[0].toUpperCase()}</div>
        <div className="profile-details">
          {editMode ? (
            <div className="edit-box">
              <input value={newUsername} onChange={e => setNewUsername(e.target.value)} className="dark-input" />
              <button className="icon-btn-confirm" onClick={handleUpdate}><Check size={18}/></button>
              <button className="icon-btn-cancel" onClick={() => setEditMode(false)}><X size={18}/></button>
            </div>
          ) : (
            <h1>{profile.username} <button className="icon-btn-edit" onClick={() => setEditMode(true)}><Settings size={16}/></button></h1>
          )}
          <div className="badges-row">
            <span className={`rank-badge ${profile.role}`}>{profile.role}</span>
            <span className="id-badge">UID: {user.id.slice(0,8)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= VUE : USERS (ADMIN) ================= */
function UsersView() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => setUsers(data || []));
  }, []);

  const toggleBan = async (u) => {
    await supabase.from('profiles').update({ is_banned: !u.is_banned }).eq('id', u.id);
    // Refresh local
    setUsers(users.map(user => user.id === u.id ? {...user, is_banned: !u.is_banned} : user));
  };

  return (
    <div className="panel">
      <h3><Users size={18}/> User Directory</h3>
      <table className="admin-table">
        <thead>
          <tr><th>Node</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td><span className={`rank-badge ${u.role}`}>{u.role}</span></td>
              <td>{u.is_banned ? <span className="text-red">BANNED</span> : <span className="text-green">ACTIVE</span>}</td>
              <td>
                <button className="table-btn" onClick={() => toggleBan(u)}>
                  {u.is_banned ? 'Restore' : 'Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= VUE : INVITES (ADMIN) ================= */
function InvitesView({ user }) {
  const [invites, setInvites] = useState([]);
  const [duration, setDuration] = useState(24);

  const fetchInvites = async () => {
    const { data } = await supabase.from('inv_code').select('*').order('created_at', {ascending: false});
    setInvites(data || []);
  };

  useEffect(() => { fetchInvites(); }, []);

  const generateCode = async () => {
    const code = crypto.randomUUID().split('-')[0].toUpperCase();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + parseInt(duration));
    
    await supabase.from('inv_code').insert([{
      code,
      created_by: user.id,
      expires_at: expiry.toISOString()
    }]);
    fetchInvites();
  };

  return (
    <div className="panel">
      <div className="panel-header-flex">
        <h3><Key size={18}/> Access Keys</h3>
        <div className="actions">
          <select value={duration} onChange={e => setDuration(e.target.value)} className="dark-select">
            <option value="24">24H</option>
            <option value="168">7 Days</option>
            <option value="8760">Forever</option>
          </select>
          <button className="pink-btn" onClick={generateCode}><Plus size={16}/> New Key</button>
        </div>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Code</th><th>Expiry</th><th>Status</th></tr>
        </thead>
        <tbody>
          {invites.map(i => (
            <tr key={i.id}>
              <td className="mono-pink">{i.code}</td>
              <td>{new Date(i.expires_at).toLocaleDateString()}</td>
              <td>{i.is_used ? 'USED' : 'READY'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= VUE : AUDIT (ADMIN) ================= */
function AuditView() {
  return (
    <div className="panel">
      <h3><ShieldAlert size={18}/> Global Audit Logs</h3>
      <div className="audit-list">
        <div className="audit-item"><Clock size={14}/> [14:02] ADMIN updated global config. <span className="immutable-tag">IMMUTABLE</span></div>
        <div className="audit-item"><Clock size={14}/> [13:45] USER_01 changed password.</div>
        <div className="audit-item"><Clock size={14}/> [12:10] New invite generated by ROOT.</div>
      </div>
    </div>
  );
}

/* ================= VUE : SYSTEM CONFIG (ADMIN) ================= */
function SystemConfigView() {
  return (
    <div className="grid-3">
      <div className="panel">
        <h4>Maintenance Mode</h4>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
        <p className="desc">Only Admins can login.</p>
      </div>
      <div className="panel">
        <h4>Stealth Mode</h4>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
        <p className="desc">Hide stats from Guest role.</p>
      </div>
    </div>
  );
}

/* ================= BONUS : FAKE TERMINAL ================= */
function FakeTerminal({ user, close }) {
  const [lines, setLines] = useState([`>> Sagitarius OS v1.0.4.5 initialized.`, `>> Welcome, ${user}. Type 'help' for commands.`]);
  const [input, setInput] = useState('');

  const exec = (e) => {
    if (e.key === 'Enter') {
      let res = `Command not recognized: ${input}`;
      if (input === 'help') res = "Available: status, whoami, clear, uptime";
      if (input === 'status') res = "All systems NOMINAL. Network encryption: AES-256.";
      if (input === 'whoami') res = `Current User: ${user} | Security clearance: HIGH.`;
      if (input === 'clear') { setLines([]); setInput(''); return; }
      
      setLines([...lines, `${user}@sagitarius:~$ ${input}`, res]);
      setInput('');
    }
  };

  return (
    <div className="terminal-overlay">
      <div className="terminal-header">
        <span>SAGITARIUS_TERMINAL.EXE</span>
        <button onClick={close}><X size={14}/></button>
      </div>
      <div className="terminal-body">
        {lines.map((l, i) => <div key={i}>{l}</div>)}
        <div className="terminal-input-row">
          <span>{user}@sagitarius:~$</span>
          <input autoFocus value={input} onChange={e => setInput(e.target.value)} onKeyDown={exec} />
        </div>
      </div>
    </div>
  );
}