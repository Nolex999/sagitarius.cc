import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  User, Shield, Download, FileCode, Gem, LogOut, 
  Zap, CheckCircle2, Lock, Plus, Trash2, Ban, 
  Activity, Fingerprint, KeyRound, AlertTriangle
} from 'lucide-react';
import './Home.css';

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

    // 1. Récupérer le profil
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    
    // 2. Vérifier si l'user a déjà utilisé un code (Subscription)
    const { data: invite } = await supabase.from('inv_code').select('*').eq('used_by', session.user.id).single();
    
    setProfile(prof);
    setIsSubscribed(!!invite);
    setLoading(false);
  };

  const handleActivateCode = async () => {
    if (!inviteCode) return;
    const { data, error } = await supabase.rpc('use_invite_code', { p_code: inviteCode });
    
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
      {/* Glow Effects */}
      <div className="bg-glow"></div>

      <div className="main-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon"></div>
            <span>SAGITARIUS</span>
          </div>

          <nav className="nav-list">
            <NavItem icon={User} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <NavItem icon={Gem} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            <NavItem icon={Download} label="Download" active={activeTab === 'download'} onClick={() => setActiveTab('download')} />
            <NavItem icon={FileCode} label="Lua Docs" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
            {profile?.role === 'admin' && (
              <NavItem icon={Shield} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} color="#a855f7" />
            )}
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        </aside>

        {/* CONTENT */}
        <main className="content-area">
          <header className="content-header">
            <h1>{activeTab.toUpperCase()}</h1>
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
                inviteCode={inviteCode} 
                setInviteCode={setInviteCode} 
                handleActivate={handleActivateCode} 
              />
            )}
            {activeTab === 'download' && <DownloadView isSubscribed={isSubscribed} />}
            {activeTab === 'docs' && <ComingSoon title="LUA DOCUMENTATION" />}
            {activeTab === 'admin' && <AdminPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick, color }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon size={18} style={{ color: active ? (color || '#6366f1') : '#52525b' }} />
    <span>{label}</span>
  </div>
);

const ProfileView = ({ profile, isSubscribed }) => (
  <div className="view-fade">
    <div className="profile-card">
      <div className="avatar-large">{profile.username[0].toUpperCase()}</div>
      <div className="profile-info">
        <h2>{profile.username}</h2>
        <p>{profile.role.toUpperCase()} MEMBER</p>
      </div>
    </div>
    <div className="grid-info">
      <InfoBox label="Hardware ID" value="Locked to session" icon={Fingerprint} />
      <InfoBox label="Account Status" value={profile.is_banned ? 'Banned' : 'Active'} icon={Activity} />
    </div>
  </div>
);

const SubscriptionView = ({ isSubscribed, inviteCode, setInviteCode, handleActivate }) => (
  <div className="view-fade">
    {isSubscribed ? (
      <div className="sub-active-card">
        <CheckCircle2 size={48} className="text-indigo-500" />
        <h3>Subscription Active</h3>
        <p>Your hardware is authorized for injection.</p>
      </div>
    ) : (
      <div className="sub-form">
        <KeyRound size={40} className="mb-4 text-zinc-600" />
        <h3>Activate License</h3>
        <p>Enter your invitation code to unlock the loader.</p>
        <div className="input-group">
          <input 
            type="text" 
            placeholder="SAG-XXXX-XXXX" 
            value={inviteCode} 
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
          <button onClick={handleActivate}>Activate</button>
        </div>
      </div>
    )}
  </div>
);

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
  useEffect(() => {
    const fetchKeys = async () => {
      const { data } = await supabase.from('inv_code').select('*');
      setKeys(data || []);
    };
    fetchKeys();
  }, []);

  return (
    <div className="view-fade space-y-4">
      <div className="admin-header">
        <h3>Invite Keys</h3>
        <button className="btn-small"><Plus size={14} /> Generate</button>
      </div>
      <div className="key-list">
        {keys.map(k => (
          <div key={k.id} className="key-item">
            <code>{k.code}</code>
            <span className={k.is_used ? 'used' : 'unused'}>{k.is_used ? 'Used' : 'Available'}</span>
            <Trash2 size={14} className="delete-icon" />
          </div>
        ))}
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

const ComingSoon = ({ title }) => (
  <div className="coming-soon">
    <AlertTriangle size={32} />
    <h3>{title}</h3>
    <p>This module is currently under development.</p>
  </div>
);
