import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, User, ShieldAlert, Activity, LogOut,
  Gem, Bell, Settings, Terminal, Plus, Trash2, ShieldCheck,
  Zap, Play, Download, Cloud, FileCode, CheckCircle2, Lock, Clock
} from 'lucide-react';
import './Home.css';

// --- INITIALISATION SUPABASE ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- COMPOSANTS UI UTILITAIRES ---

const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#050505] text-xs font-mono tracking-widest text-zinc-500">
    <div className="flex flex-col items-center gap-4 relative">
      <div className="absolute inset-0 bg-indigo-500/20 blur-xl animate-pulse rounded-full"></div>
      <Activity className="h-8 w-8 animate-spin text-indigo-500 relative z-10" />
      <span className="animate-pulse text-indigo-400 font-bold">INITIALIZING SYSTEM...</span>
    </div>
  </div>
);

const BannedScreen = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050505] text-red-500 p-4 text-center">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full"></div>
      <ShieldAlert className="h-24 w-24 relative z-10" />
    </div>
    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-white">Access Revoked</h1>
    <p className="font-mono text-sm text-red-400 bg-red-950/30 px-4 py-1 rounded border border-red-900/50">ACCOUNT TERMINATED</p>
  </div>
);

// Composant Carte "Solide" (Style inspiré de ton upload)
const SolidCard = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#0A0A0A] border border-white/5 rounded-xl p-6 relative overflow-hidden group shadow-lg transition-all duration-300 hover:border-white/10 ${onClick ? 'cursor-pointer hover:bg-[#0F0F0F] hover:-translate-y-1' : ''} ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = "text-white" }) => (
  <SolidCard className="flex flex-col justify-between h-full">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-zinc-900/50 border border-white/5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">{label}</span>
    </div>
    <div>
      <h2 className="text-2xl font-mono font-bold text-white tracking-tighter">{value}</h2>
      {sub && <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${sub.includes('Active') ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
        {sub}
      </p>}
    </div>
  </SolidCard>
);

// --- MAIN COMPONENT ---

export default function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // dashboard | sub | download | docs | admin
  const [subExpiry, setSubExpiry] = useState(null);
  const [injectStatus, setInjectStatus] = useState('IDLE'); // IDLE | INJECTING | INJECTED

  // AUTH & DATA
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }
        
        const { data: userProfile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (error) throw error;
        
        setSession(session);
        setProfile(userProfile);
        
        // Simulation date sub
        if (userProfile.subscription_end) {
           setSubExpiry(new Date(userProfile.subscription_end));
        }

        setLoading(false);
      } catch (error) { navigate('/login'); }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  // Simulation Injection
  const handleInject = () => {
    if (injectStatus === 'INJECTING' || injectStatus === 'INJECTED') return;
    setInjectStatus('INJECTING');
    setTimeout(() => setInjectStatus('INJECTED'), 2500);
  };

  // Simulation Ajout Sub
  const handleAddSub = (days) => {
    const now = new Date();
    const currentExpiry = subExpiry && subExpiry > now ? subExpiry : now;
    const newDate = new Date(currentExpiry);
    newDate.setDate(newDate.getDate() + days);
    setSubExpiry(newDate);
    // TODO: Appel Supabase réel ici
  };

  if (loading) return <Loader />;
  if (profile?.is_banned) return <BannedScreen />;

  const isSubActive = subExpiry && subExpiry > new Date();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-900/5 rounded-full blur-[150px]"></div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className="sticky top-0 h-screen w-20 lg:w-72 border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl flex flex-col justify-between py-8 z-50 shrink-0">
        <div className="px-3 lg:px-6 flex flex-col w-full h-full">
          {/* BRAND */}
          <div className="mb-10 flex items-center justify-center lg:justify-start gap-4 group cursor-pointer lg:px-2">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-indigo-600 blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
              <div className="h-10 w-10 bg-gradient-to-br from-zinc-900 to-black rounded-lg flex items-center justify-center relative z-10 border border-white/10">
                <Zap className="text-indigo-500 w-5 h-5 fill-indigo-500/20" />
              </div>
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="font-bold text-white text-lg tracking-tight leading-none">SAGITARIUS</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Client v3.5</span>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="space-y-1 w-full flex-1">
            <NavBtn label="Profile" active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={User} />
            <NavBtn label="Subscription" active={view === 'sub'} onClick={() => setView('sub')} icon={Gem} />
            <NavBtn label="Download" active={view === 'download'} onClick={() => setView('download')} icon={Download} />
            <NavBtn label="Lua Docs" active={view === 'docs'} onClick={() => setView('docs')} icon={FileCode} />
            {isAdmin && (
               <>
                <div className="my-4 h-px bg-white/5 mx-2"></div>
                <NavBtn label="Admin Panel" active={view === 'admin'} onClick={() => setView('admin')} icon={ShieldCheck} />
               </>
            )}
          </nav>

          {/* USER FOOTER */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="hidden lg:flex items-center gap-3 mb-4 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                  {profile.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-white truncate">{profile.username}</span>
                  <span className="text-[10px] text-zinc-600 uppercase">{profile.role}</span>
                </div>
            </div>
            <button onClick={handleLogout} className="flex items-center justify-center lg:justify-start w-full p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 group">
              <LogOut className="w-5 h-5 lg:mr-3 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden lg:inline text-xs font-bold tracking-wider">DISCONNECT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-12 w-full min-w-0 relative z-10 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto pb-10">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                {view === 'docs' ? 'Documentation' : view === 'sub' ? 'Store & Plans' : view.charAt(0).toUpperCase() + view.slice(1)}
              </h1>
              <p className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SYSTEM ONLINE // {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* ACTION & NOTIFS */}
            <div className="flex items-center gap-4">
              {view === 'download' && isSubActive && (
                 <button
                 onClick={handleInject}
                 className={`relative overflow-hidden px-6 py-2.5 rounded-lg font-bold text-xs tracking-wider transition-all duration-300 ${injectStatus === 'INJECTED' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
               >
                 <div className="flex items-center gap-2">
                   {injectStatus === 'INJECTING' ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                   {injectStatus === 'IDLE' ? 'INJECT' : injectStatus === 'INJECTING' ? 'LOADING...' : 'READY'}
                 </div>
               </button>
              )}
              
              <div className="h-10 w-10 bg-[#0A0A0A] rounded-full flex items-center justify-center border border-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              </div>
            </div>
          </div>

          {/* DYNAMIC VIEWS */}
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            {view === 'dashboard' && <ProfileModule profile={profile} subExpiry={subExpiry} isSubActive={isSubActive} />}
            {view === 'sub' && <SubscriptionModule onAddSub={handleAddSub} subExpiry={subExpiry} />}
            {view === 'download' && <DownloadModule isSubActive={isSubActive} />}
            {view === 'docs' && <DocsModule />}
            {view === 'admin' && isAdmin && <AdminModule />}
          </div>

        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const NavBtn = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center lg:justify-start w-full px-4 py-3 rounded-lg transition-all duration-300 group gap-3 relative ${active
      ? 'text-white bg-white/[0.03]'
      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]'
      }`}
  >
    {active && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-indigo-500"></div>}
    <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
    <span className="hidden lg:inline text-sm font-medium tracking-wide">{label}</span>
  </button>
);

// --- MODULES ---

const ProfileModule = ({ profile, isSubActive, subExpiry }) => (
  <div className="space-y-6">
    {/* STATS ROW */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        icon={User} 
        label="Account Type" 
        value={isSubActive ? "PREMIUM" : "FREE USER"} 
        sub={isSubActive ? "Prioritized" : "Limited Access"} 
        color="text-indigo-400" 
      />
      <StatCard 
        icon={ShieldCheck} 
        label="Security Status" 
        value="SECURE" 
        sub="HWID Hidden" 
        color="text-emerald-400" 
      />
      <StatCard 
        icon={Clock} 
        label="Days Remaining" 
        value={isSubActive ? Math.ceil((subExpiry - new Date()) / (1000 * 60 * 60 * 24)) : "0"} 
        sub={isSubActive ? "Active" : "Expired"} 
        color="text-zinc-400" 
      />
    </div>

    {/* INFO SECTION */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SolidCard className="h-full">
        <h3 className="text-lg font-bold text-white mb-4">User Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-sm text-zinc-500">Username</span>
            <span className="text-sm text-zinc-300 font-mono">{profile.username}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-sm text-zinc-500">User ID</span>
            <span className="text-sm text-zinc-300 font-mono">{profile.id.split('-')[0]}...</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-sm text-zinc-500">Registration</span>
            <span className="text-sm text-zinc-300 font-mono">{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </SolidCard>

      <SolidCard className="h-full bg-indigo-500/[0.02] border-indigo-500/10">
        <h3 className="text-lg font-bold text-white mb-2">Welcome Back</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          You are connected to the Sagitarius Node. 
          {isSubActive 
            ? " Your premium subscription unlocks all features including cloud configs and Lua scripting engine."
            : " You currently have restricted access. Visit the Subscription tab to unlock the full potential."}
        </p>
        <div className="mt-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-zinc-500 font-mono">Server Load: 12%</span>
        </div>
      </SolidCard>
    </div>
  </div>
);

const SubscriptionModule = ({ onAddSub, subExpiry }) => {
  const plans = [
    { days: 14, label: '14 DAYS', price: 'Free', sub: 'Trial' },
    { days: 30, label: '30 DAYS', price: 'Free', sub: 'Standard' },
    { days: 90, label: '90 DAYS', price: 'Free', sub: 'Quarterly' },
    { days: 360, label: 'LIFETIME', price: 'Free', sub: 'Ultimate' },
  ];

  return (
    <div className="space-y-6">
       <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
          <Gem className="w-6 h-6 text-indigo-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Unlock Full Access</h4>
            <p className="text-xs text-indigo-200/70">Select a plan below. Activation is instant.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {plans.map((plan) => (
           <SolidCard 
             key={plan.days} 
             onClick={() => onAddSub(plan.days)}
             className="flex flex-col items-center justify-center py-8 gap-4 hover:border-indigo-500/30 group"
           >
             <div className="p-3 rounded-full bg-zinc-900 group-hover:bg-indigo-500/10 transition-colors">
               <Clock className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400" />
             </div>
             <div className="text-center">
               <h3 className="text-xl font-bold text-white">{plan.label}</h3>
               <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{plan.sub}</p>
             </div>
             <button className="mt-2 px-4 py-1 rounded-full text-xs font-medium bg-white/5 text-zinc-300 border border-white/5 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all">
               Activate
             </button>
           </SolidCard>
         ))}
       </div>
    </div>
  );
};

const DownloadModule = ({ isSubActive }) => (
  <div className="flex flex-col items-center justify-center py-10 space-y-8">
    <div className={`relative group transition-all duration-500 ${isSubActive ? '' : 'grayscale opacity-50'}`}>
        {isSubActive && <div className="absolute inset-0 bg-indigo-500/30 blur-[60px] rounded-full"></div>}
        <SolidCard className="w-64 h-64 flex flex-col items-center justify-center bg-[#080808] z-10 relative">
           <Cloud className={`w-16 h-16 mb-6 ${isSubActive ? 'text-indigo-400' : 'text-zinc-600'}`} />
           <h3 className="text-xl font-bold text-white">Client v3.5</h3>
           <p className="text-xs text-zinc-500 mt-2 font-mono">Stable Build • x64</p>
        </SolidCard>
    </div>

    <div className="text-center">
        {!isSubActive && (
            <div className="mb-4 px-4 py-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs inline-flex items-center gap-2">
                <Lock className="w-3 h-3" /> Subscription Required
            </div>
        )}
        <p className="text-zinc-500 text-sm max-w-md mx-auto mb-6">
            Ensure your antivirus is disabled before downloading. The loader is encrypted to prevent detection.
        </p>
        <button 
            disabled={!isSubActive}
            className={`px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${isSubActive ? 'bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
            DOWNLOAD LOADER
        </button>
    </div>
  </div>
);

const DocsModule = () => (
  <div className="flex flex-col items-center justify-center h-[500px]">
      <div className="p-4 bg-zinc-900/50 rounded-full mb-6">
        <FileCode className="w-10 h-10 text-zinc-600" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-300 mb-2">Documentation</h2>
      <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Module Coming Soon</p>
      <div className="mt-8 w-64 h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-900/50 w-1/3 rounded-full"></div>
      </div>
  </div>
);

const AdminModule = () => {
    const [invites, setInvites] = useState(['SAG-KEY-8392', 'SAG-KEY-1120']);
    const [users, setUsers] = useState([
        { id: 1, name: 'Slayer_One', status: 'active' },
        { id: 2, name: 'Ghost_Rider', status: 'banned' },
    ]);

    const addKey = () => setInvites([...invites, `SAG-KEY-${Math.floor(Math.random()*9000)}`]);
    const toggleBan = (id) => setUsers(users.map(u => u.id === id ? {...u, status: u.status === 'active' ? 'banned' : 'active'} : u));
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INVITE MANAGER */}
            <SolidCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white">Invitations</h3>
                    <button onClick={addKey} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-2">
                    {invites.map(key => (
                        <div key={key} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                            <span className="font-mono text-xs text-zinc-400">{key}</span>
                            <button onClick={() => setInvites(invites.filter(k => k !== key))} className="text-zinc-600 hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </SolidCard>

            {/* USER MANAGER */}
            <SolidCard>
                <h3 className="font-bold text-white mb-6">Users</h3>
                <div className="space-y-2">
                    {users.map(u => (
                        <div key={u.id} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                             <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-zinc-300">{u.name}</span>
                             </div>
                             <button 
                                onClick={() => toggleBan(u.id)}
                                className={`text-xs px-3 py-1 rounded font-medium ${u.status === 'active' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}
                             >
                                {u.status === 'active' ? 'Ban' : 'Unban'}
                             </button>
                        </div>
                    ))}
                </div>
            </SolidCard>
        </div>
    );
};
