import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  User, Shield, Download, FileCode, CreditCard,
  LogOut, Activity, Lock, Cpu, Zap, ChevronRight,
  Terminal, ShieldAlert, CheckCircle2, AlertCircle
} from 'lucide-react';
import './Home.css';

// --- INITIALISATION SUPABASE ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- COMPOSANTS UI ---

const Loader = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#020202] text-zinc-500">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-600/20 blur-2xl rounded-full animate-pulse"></div>
      <Zap className="h-10 w-10 text-indigo-500 animate-bounce relative z-10" />
    </div>
    <span className="mt-4 font-mono text-xs tracking-[0.2em] text-indigo-400 animate-pulse">INITIALIZING SAGITARIUS...</span>
  </div>
);

const BannedScreen = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#020202] text-red-500">
    <ShieldAlert className="h-20 w-20 mb-4 opacity-80" />
    <h1 className="text-3xl font-black uppercase tracking-widest text-white">Restricted</h1>
    <p className="font-mono text-xs text-red-500 mt-2 bg-red-950/20 px-4 py-1 rounded border border-red-900/30">
      HWID TERMINATED
    </p>
  </div>
);

// --- COMPOSANT PRINCIPAL ---

export default function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

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
        setLoading(false);
      } catch (error) { navigate('/login'); }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  if (loading) return <Loader />;
  if (profile?.is_banned) return <BannedScreen />;

  const isAdmin = profile?.role === 'admin';

  // --- CONTENU DES ONGLETS ---
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileView profile={profile} session={session} handleLogout={handleLogout} />;
      case 'subscription':
        return <SubscriptionView />;
      case 'download':
        return <DownloadView />;
      case 'docs':
        return <LuaDocsView />;
      case 'admin':
        return isAdmin ? <AdminView /> : <div className="text-red-500 font-mono">ACCESS DENIED</div>;
      default:
        return <ProfileView profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020202] flex items-center justify-center p-4 md:p-8 overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* BACKGROUND FX */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* MAIN CENTERED UI */}
      <div className="relative w-full max-w-5xl h-[650px] bg-[#080808] border border-white/5 rounded-2xl shadow-2xl flex overflow-hidden backdrop-blur-sm ring-1 ring-white/5">
        
        {/* SIDEBAR */}
        <div className="w-20 lg:w-64 border-r border-white/5 bg-[#050505] flex flex-col py-6">
          {/* Header */}
          <div className="px-6 mb-10 flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="hidden lg:block font-bold text-white tracking-tight text-lg">SAGITARIUS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            <TabButton icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <TabButton icon={CreditCard} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            <TabButton icon={Download} label="Download" active={activeTab === 'download'} onClick={() => setActiveTab('download')} />
            <TabButton icon={FileCode} label="Lua Docs" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
            {isAdmin && (
              <>
                <div className="my-4 h-px bg-white/5 mx-3"></div>
                <TabButton icon={Shield} label="Admin Panel" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} isAdmin />
              </>
            )}
          </nav>

          {/* User Footer */}
          <div className="px-3 pt-4 border-t border-white/5">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-all group">
              <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden lg:block text-xs font-medium uppercase tracking-wider">Disconnect</span>
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-[#0A0A0A] relative flex flex-col">
          {/* Top Bar Decoration */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-20">
            <h2 className="text-lg font-medium text-white tracking-wide">
              {activeTab === 'docs' ? 'Documentation' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">System Stable</span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

const TabButton = ({ icon: Icon, label, active, onClick, isAdmin }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
        : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
    }`}
  >
    <Icon className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'} ${isAdmin ? 'text-amber-500' : ''}`} />
    <span className="hidden lg:block text-sm font-medium">{label}</span>
    {active && <div className="ml-auto w-1 h-1 rounded-full bg-indigo-500 hidden lg:block shadow-[0_0_5px_#6366f1]" />}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#0F0F0F] border border-white/5 rounded-xl p-6 relative overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- VUES DES ONGLETS ---

const ProfileView = ({ profile, session }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-6 pb-6 border-b border-white/5">
      <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-zinc-800 to-black border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
        {profile.username.substring(0, 2).toUpperCase()}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{profile.username}</h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
          {profile.role} User
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <div className="flex items-center gap-3 mb-4 text-zinc-400">
          <Activity className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-bold">Hardware ID</span>
        </div>
        <p className="font-mono text-sm text-zinc-500 truncate">7A-4F-91-BB-CC-22-HASHED</p>
      </Card>
      <Card>
        <div className="flex items-center gap-3 mb-4 text-zinc-400">
          <Lock className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider font-bold">Security Level</span>
        </div>
        <p className="font-mono text-sm text-emerald-500">ENCRYPTED (AES-256)</p>
      </Card>
    </div>

    <Card className="border-indigo-500/20 bg-indigo-900/5">
      <h4 className="text-white font-bold mb-2">Announcement</h4>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Welcome to Sagittarius v3.0. The new loader interface is now live. 
        Please ensure your antivirus is disabled before injecting.
      </p>
    </Card>
  </div>
);

const SubscriptionView = () => (
  <div className="space-y-6">
    <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-black p-8 text-center">
      <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-32 h-32 text-indigo-500" /></div>
      <h3 className="text-3xl font-bold text-white mb-2">Lifetime Access</h3>
      <p className="text-zinc-400 mb-6">Your subscription is active and valid indefinitely.</p>
      <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors shadow-lg shadow-indigo-600/20">
        Manage Plan
      </button>
    </div>

    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mt-8 mb-4">Payment History</h4>
    <div className="space-y-2">
      {[1].map((_, i) => (
        <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="text-sm text-white font-medium">Lifetime License Key</p>
              <p className="text-xs text-zinc-500">Oct 24, 2023</p>
            </div>
          </div>
          <span className="font-mono text-sm text-white">$49.99</span>
        </div>
      ))}
    </div>
  </div>
);

const DownloadView = () => (
  <div className="flex flex-col items-center text-center space-y-8 py-10">
    <div className="h-32 w-32 rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center relative group">
      <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
      <Download className="w-12 h-12 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
    </div>
    
    <div>
      <h3 className="text-2xl font-bold text-white">Sagittarius Client v3.2</h3>
      <p className="text-sm text-zinc-500 mt-2">Latest build compiled 2 hours ago.</p>
    </div>

    <button className="flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      <Download className="w-5 h-5" />
      <span>DOWNLOAD LOADER</span>
    </button>

    <div className="w-full max-w-md bg-[#0F0F0F] rounded-lg p-4 border border-white/5 text-left mt-8">
      <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3">Changelog</h4>
      <ul className="space-y-2 text-sm text-zinc-400 font-mono">
        <li className="flex gap-2"><span className="text-green-500">[+]</span> Added new aimbot resolver</li>
        <li className="flex gap-2"><span className="text-amber-500">[*]</span> Fixed crash on injection</li>
        <li className="flex gap-2"><span className="text-blue-500">[-]</span> Removed legacy HUD</li>
      </ul>
    </div>
  </div>
);

const LuaDocsView = () => (
  <div className="space-y-4">
    <div className="flex gap-2 mb-6">
      <span className="px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20">API v2</span>
      <span className="px-3 py-1 rounded bg-zinc-800 text-zinc-400 text-xs font-mono border border-white/5">ReadOnly</span>
    </div>
    
    {['Global', 'UserCmd', 'Render', 'Client'].map((category) => (
      <div key={category} className="border border-white/5 rounded-lg overflow-hidden">
        <div className="bg-[#121212] px-4 py-2 border-b border-white/5 flex justify-between items-center">
          <span className="font-bold text-zinc-300 text-sm">{category}</span>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </div>
        <div className="bg-[#0A0A0A] p-4 space-y-2">
          <div className="font-mono text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer">
            {category.toLowerCase()}.get_local_player()
          </div>
          <div className="font-mono text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer">
            {category.toLowerCase()}.is_key_down(key)
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AdminView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-red-900/5 border-red-500/20">
        <div className="text-red-400 text-xs font-bold uppercase mb-1">Detected Users</div>
        <div className="text-2xl font-bold text-white">12</div>
      </Card>
      <Card className="bg-emerald-900/5 border-emerald-500/20">
        <div className="text-emerald-400 text-xs font-bold uppercase mb-1">Active Subs</div>
        <div className="text-2xl font-bold text-white">842</div>
      </Card>
    </div>

    <div className="bg-[#0F0F0F] rounded-xl border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-white text-sm">User Management</h3>
        <Terminal className="w-4 h-4 text-zinc-500" />
      </div>
      <table className="w-full text-left text-sm text-zinc-400">
        <thead className="bg-white/5 text-zinc-200 font-medium">
          <tr>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr>
            <td className="px-6 py-4">xX_Slayer_Xx</td>
            <td className="px-6 py-4"><span className="text-emerald-500 text-xs bg-emerald-500/10 px-2 py-1 rounded">Active</span></td>
            <td className="px-6 py-4 text-right"><button className="text-zinc-500 hover:text-white">Edit</button></td>
          </tr>
          <tr>
            <td className="px-6 py-4">Cheater123</td>
            <td className="px-6 py-4"><span className="text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded">Banned</span></td>
            <td className="px-6 py-4 text-right"><button className="text-zinc-500 hover:text-white">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
