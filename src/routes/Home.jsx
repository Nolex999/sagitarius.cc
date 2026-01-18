import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  LogOut, LayoutDashboard, Users, 
  Plus, Globe, Palette, ChevronRight, Activity 
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

  if (loading) return <div className="loading-screen">ACCESSING NETWORK...</div>;

  return (
    <div className="app-viewport">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>SAGITARIUS<span className="pink-text">.CC</span></h1>
        </div>

        <nav className="nav-list">
          <div className="nav-section">MAIN</div>
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18}/> Overview
          </button>
          <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <Palette size={18}/> Customization
          </button>
          <button className={`nav-link ${activeTab === 'network' ? 'active' : ''}`} onClick={() => setActiveTab('network')}>
            <Globe size={18}/> Network Panel
          </button>
          
          {profile.role === 'admin' && (
            <>
              <div className="nav-section">ADMIN</div>
              <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                <Users size={18}/> Management
              </button>
            </>
          )}
        </nav>

        <button className="exit-btn" onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
          <LogOut size={18} /> Disconnect
        </button>
      </aside>

      <main className="stage">
        <header className="stage-header">
          <div className="location-path">root@{profile.username}:~/{activeTab}</div>
          <div className="user-meta">
            <span className={`rank-tag ${profile.role}`}>{profile.role}</span>
          </div>
        </header>

        <div className="stage-content">
          {activeTab === 'dashboard' && <DashboardView profile={profile} />}
          {activeTab === 'profile' && <ProfileEditor profile={profile} setProfile={setProfile} />}
          {activeTab === 'network' && <NetworkTools />}
        </div>
      </main>
    </div>
  );
}

/* --- VIEWS --- */
function DashboardView({ profile }) {
  return (
    <div className="view-fade">
      <div className="stats-row">
        <div className="stat-card">
          <label>Network Status</label>
          <div className="stat-val pink-glow">OPERATIONAL</div>
        </div>
        <div className="stat-card">
          <label>UID</label>
          <div className="stat-val">#{profile.id?.slice(0, 5)}</div>
        </div>
      </div>
    </div>
  );
}

function NetworkTools() {
  const [logs, setLogs] = useState(["Waiting for command..."]);
  return (
    <div className="view-fade">
      <div className="card">
        <h3>Network Tools</h3>
        <div className="input-row">
          <input className="shell-input" placeholder="Enter target..." />
          <button className="shell-btn" onClick={() => setLogs([...logs, "Tracing 8.8.8.8...", "Ping: 14ms"])}>Execute</button>
        </div>
        <div className="shell-window">
          {logs.map((l, i) => <div key={i} className="shell-line"><ChevronRight size={14}/> {l}</div>)}
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({ profile, setProfile }) {
  const [bio, setBio] = useState(profile.bio || '');
  const [color, setColor] = useState(profile.custom_color || '#ffb2f9');

  const save = async () => {
    await supabase.from('profiles').update({ bio, custom_color: color }).eq('id', profile.id);
    setProfile({...profile, bio, custom_color: color});
  };

  return (
    <div className="view-fade grid-split">
      <div className="card profile-preview" style={{ borderTop: `4px solid ${color}` }}>
        <div className="p-header">
          <div className="p-avatar" style={{ color: color, borderColor: color }}>{profile.username[0]}</div>
          <div>
            <h2 style={{ color: color }}>{profile.username}</h2>
            <p className="p-bio">{bio || "No description set."}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Edit Identity</h3>
        <div className="field">
          <label>About Me</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} className="shell-input" />
        </div>
        <div className="field">
          <label>Accent Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="color-tool" />
        </div>
        <button className="shell-btn full" onClick={save}>Apply Changes</button>
      </div>
    </div>
  );
}