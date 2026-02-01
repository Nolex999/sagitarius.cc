import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  User, Shield, Download, FileCode, Gem,
  LogOut, Zap, Clock, Lock, CheckCircle2,
  Trash2, Plus, Ban, Unlock, Ghost
} from 'lucide-react';
import './Home.css';

// --- INITIALISATION SUPABASE ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- COMPOSANTS UI ---

const Loader = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#030303]">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full animate-pulse"></div>
      <Ghost className="h-12 w-12 text-zinc-600 animate-bounce relative z-10" />
    </div>
  </div>
);

const BannedScreen = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#030303]">
    <h1 className="text-2xl font-medium tracking-widest text-zinc-500 uppercase">Access Restricted</h1>
  </div>
);

// --- COMPOSANT PRINCIPAL ---

export default function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // État local pour simuler l'abonnement dans cette démo
  const [subExpiry, setSubExpiry] = useState(null); 

  // Auth Logic
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }
        
        const { data: userProfile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (error) throw error;
        
        setSession(session);
        setProfile(userProfile);
        
        // Simuler si l'user a déjà une sub en DB
        if (userProfile.subscription_end) {
            setSubExpiry(new Date(userProfile.subscription_end));
        }

        setLoading(false);
      } catch (error) { navigate('/login'); }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  // Fonction pour ajouter du temps (Simulée)
  const handleAddSub = (days) => {
    const now = new Date();
    const currentExpiry = subExpiry && subExpiry > now ? subExpiry : now;
    const newDate = new Date(currentExpiry);
    newDate.setDate(newDate.getDate() + days);
    setSubExpiry(newDate);
    // Ici, vous feriez normalement un appel Supabase pour update la DB
  };

  const isSubActive = subExpiry && subExpiry > new Date();
  const isAdmin = profile?.role === 'admin';

  if (loading) return <Loader />;
  if (profile?.is_banned) return <BannedScreen />;

  // --- CONTENU DES ONGLETS ---
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileView profile={profile} subExpiry={subExpiry} />;
      case 'subscription':
        return <SubscriptionView onAddSub={handleAddSub} subExpiry={subExpiry} />;
      case 'download':
        return <DownloadView isSubActive={isSubActive} />;
      case 'docs':
        return <ComingSoonView title="Documentation" />;
      case 'admin':
        return isAdmin ? <AdminView /> : <div className="text-zinc-600 font-mono text-center mt-20">RESTRICTED</div>;
      default:
        return <ProfileView profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] flex items-center justify-center p-6 overflow-hidden relative selection:bg-indigo-500/20 selection:text-indigo-200">
      
      {/* BACKGROUND ATMOSPHERE - Plus subtil et pâle */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,25,0.4),#030303)] pointer-events-none"></div>
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* MAIN CONTAINER - Arrondi et Fluide */}
      <div className="relative w-full max-w-6xl h-[700px] bg-[#050505]/60 border border-white/5 rounded-[32px] flex overflow-hidden backdrop-blur-2xl shadow-2xl">
        
        {/* SIDEBAR - Minimaliste */}
        <div className="w-20 lg:w-72 border-r border-white/5 bg-black/20 flex flex-col py-8 px-4">
          <div className="mb-12 pl-2 lg:pl-4 flex items-center gap-3 opacity-80">
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
              <Ghost className="h-4 w-4 text-zinc-400" />
            </div>
            <span className="hidden lg:block font-medium text-zinc-300 tracking-wide">SAGITARIUS</span>
          </div>

          <nav className="flex-1 space-y-2">
            <NavBtn icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <NavBtn icon={Gem} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            <NavBtn icon={Download} label="Client" active={activeTab === 'download'} onClick={() => setActiveTab('download')} />
            <NavBtn icon={FileCode} label="Lua Docs" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
            {isAdmin && (
              <>
                <div className="my-6 h-px bg-white/5 w-full"></div>
                <NavBtn icon={Shield} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
              </>
            )}
          </nav>

          <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all duration-300">
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:block text-sm font-medium">Log out</span>
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 relative flex flex-col bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <div className="max-w-4xl mx-auto animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS UI ---

const NavBtn = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 ease-out group ${
      active 
        ? 'bg-white/5 text-zinc-100 shadow-[0_0_20px_rgba(255,255,255,0.02)]' 
        : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.02]'
    }`}
  >
    <Icon className={`h-4 w-4 transition-colors ${active ? 'text-indigo-300' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
    <span className="hidden lg:block text-sm font-medium">{label}</span>
  </button>
);

const FluidCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white/[0.02] border border-white/[0.03] backdrop-blur-md rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ${onClick ? 'cursor-pointer hover:bg-white/[0.04] hover:border-white/10 hover:scale-[1.01]' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- VUES ---

const ProfileView = ({ profile, subExpiry }) => {
  const isActive = subExpiry && subExpiry > new Date();

  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-center gap-8">
        <div className="h-24 w-24 rounded-full bg-zinc-900/50 border border-white/5 flex items-center justify-center text-3xl font-light text-zinc-500 shadow-inner">
          {profile.username.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-3xl font-medium text-zinc-200 tracking-tight mb-2">{profile.username}</h2>
          <div className="flex gap-3">
             <span className="px-3 py-1 rounded-full text-[10px] bg-white/5 text-zinc-400 border border-white/5 tracking-wider uppercase">
               UID: {profile.id.split('-')[0]}
             </span>
             {isActive && (
               <span className="px-3 py-1 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 tracking-wider uppercase shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                 Premium
               </span>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FluidCard className="flex flex-col justify-between h-32">
          <span className="text-xs text-zinc-600 font-medium uppercase tracking-widest">Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            <span className="text-xl text-zinc-300 font-light">Undetected</span>
          </div>
        </FluidCard>
        
        <FluidCard className="flex flex-col justify-between h-32">
          <span className="text-xs text-zinc-600 font-medium uppercase tracking-widest">Subscription</span>
          <span className={`text-xl font-light ${isActive ? 'text-indigo-300' : 'text-zinc-500'}`}>
            {isActive ? `${Math.ceil((subExpiry - new Date()) / (1000 * 60 * 60 * 24))} Days Left` : 'Inactive'}
          </span>
        </FluidCard>
      </div>
    </div>
  );
};

const SubscriptionView = ({ onAddSub, subExpiry }) => {
  const options = [
    { days: 14, label: '14 Days' },
    { days: 30, label: '30 Days' },
    { days: 60, label: '60 Days' },
    { days: 180, label: '180 Days' },
    { days: 360, label: '360 Days' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-light text-zinc-200 mb-2">Extend Access</h2>
        <p className="text-zinc-500 text-sm">Select a duration to instantly activate your license.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((opt) => (
          <FluidCard 
            key={opt.days} 
            onClick={() => onAddSub(opt.days)}
            className="group flex flex-col items-center justify-center py-8 hover:bg-white/[0.04]"
          >
            <Clock className="w-6 h-6 text-zinc-600 mb-4 group-hover:text-indigo-300 transition-colors duration-500" />
            <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">{opt.label}</span>
            <span className="text-xs text-zinc-600 mt-1">Free Upgrade</span>
          </FluidCard>
        ))}
      </div>

      {subExpiry && subExpiry > new Date() && (
        <div className="mt-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
          <span className="text-emerald-400/80 text-sm font-medium tracking-wide">
            Active until {subExpiry.toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
};

const DownloadView = ({ isSubActive }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-8">
      <div className={`
        h-40 w-40 rounded-full flex items-center justify-center relative transition-all duration-700
        ${isSubActive ? 'bg-indigo-500/5 shadow-[0_0_50px_rgba(99,102,241,0.1)]' : 'bg-zinc-900/20 grayscale'}
      `}>
        {isSubActive && <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>}
        <Download className={`w-12 h-12 transition-colors duration-500 ${isSubActive ? 'text-indigo-300' : 'text-zinc-700'}`} />
      </div>

      <div>
        <h2 className="text-2xl font-light text-zinc-200">Client Loader v3.4</h2>
        <p className="text-zinc-600 text-sm mt-2">
          {isSubActive ? 'Ready for injection.' : 'Subscription required to download.'}
        </p>
      </div>

      <button
        disabled={!isSubActive}
        className={`
          px-10 py-4 rounded-2xl font-medium tracking-wide transition-all duration-500
          ${isSubActive 
            ? 'bg-zinc-100 text-black hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
            : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5'}
        `}
      >
        {isSubActive ? 'Initialize Download' : 'Locked'}
      </button>
    </div>
  );
};

const ComingSoonView = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[500px]">
    <Clock className="w-12 h-12 text-zinc-800 mb-6" />
    <h2 className="text-3xl font-thin text-zinc-700 uppercase tracking-[0.3em]">{title}</h2>
    <p className="text-zinc-800 mt-4 text-xs font-mono">MODULE_NOT_LOADED</p>
  </div>
);

const AdminView = () => {
  const [view, setView] = useState('invites'); // invites | users
  
  // Mock Data Simulée
  const [invites, setInvites] = useState(['SAG-8392-XKA', 'SAG-1129-LPO', 'SAG-9921-MZN']);
  const [users, setUsers] = useState([
    { id: 1, name: 'Slayer_One', status: 'active' },
    { id: 2, name: 'Ghost_Rider', status: 'banned' },
    { id: 3, name: 'Newbie22', status: 'active' },
  ]);

  const createInvite = () => {
    const code = `SAG-${Math.floor(1000 + Math.random() * 9000)}-GEN`;
    setInvites([...invites, code]);
  };

  const deleteInvite = (code) => {
    setInvites(invites.filter(i => i !== code));
  };

  const toggleBan = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setView('invites')} 
          className={`px-4 py-2 rounded-xl text-sm transition-colors ${view === 'invites' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
          Invitations
        </button>
        <button 
          onClick={() => setView('users')} 
          className={`px-4 py-2 rounded-xl text-sm transition-colors ${view === 'users' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
          User Management
        </button>
      </div>

      {view === 'invites' && (
        <div className="space-y-4 animate-fade-in">
          <FluidCard onClick={createInvite} className="border-dashed border-white/10 flex items-center justify-center gap-3 py-4 opacity-70 hover:opacity-100">
            <Plus className="w-4 h-4 text-indigo-300" />
            <span className="text-sm text-zinc-300">Generate New Key</span>
          </FluidCard>
          
          <div className="space-y-2">
            {invites.map((code) => (
              <div key={code} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="font-mono text-xs text-zinc-400 tracking-wider">{code}</span>
                <button onClick={() => deleteInvite(code)} className="text-zinc-700 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {invites.length === 0 && <div className="text-center text-zinc-700 text-xs py-4">No active invites.</div>}
          </div>
        </div>
      )}

      {view === 'users' && (
        <div className="space-y-2 animate-fade-in">
          {users.map((u) => (
            <div key={u.id} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 group">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}></div>
                <span className={`text-sm ${u.status === 'banned' ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>{u.name}</span>
              </div>
              
              <button 
                onClick={() => toggleBan(u.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${u.status === 'active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
              >
                {u.status === 'active' ? 'Ban' : 'Unban'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
