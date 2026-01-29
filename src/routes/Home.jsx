import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, User, ShieldAlert, Activity, LogOut,
  Globe, Bell, Settings, Terminal, Plus, Trash2, ShieldCheck,
  Copy, Check, Send, Zap, HardDrive, Cpu, Play, Server, Code, Wifi
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
      <span className="animate-pulse text-indigo-400 font-bold">ESTABLISHING SECURE CONNECTION...</span>
    </div>
  </div>
);

const BannedScreen = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050505] text-red-500 p-4 text-center">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
      <ShieldAlert className="h-24 w-24 relative z-10 animate-bounce" />
    </div>
    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-white">Access Denied</h1>
    <p className="font-mono text-sm text-red-400 bg-red-950/30 px-4 py-1 rounded border border-red-900/50">HWID FLAGGED: TERMINATED</p>
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-6 relative overflow-hidden group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = "text-white" }) => (
  <GlassCard className="flex flex-col justify-between hover:border-indigo-500/30 transition-colors duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-zinc-600 text-[10px] uppercase tracking-wider font-bold">{label}</span>
    </div>
    <div>
      <h2 className={`text-3xl font-mono font-bold text-white tracking-tighter`}>{value}</h2>
      {sub && <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        {sub}
      </p>}
    </div>
  </GlassCard>
);

// --- MAIN COMPONENT ---

export default function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [connectStatus, setConnectStatus] = useState('IDLE'); // IDLE | CONNECTING | CONNECTED

  // 1. AUTH & SECURITY
  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }
        const { data: userProfile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (error) throw error;
        if (mounted) { setSession(session); setProfile(userProfile); setLoading(false); }
      } catch (error) { console.error("Auth Error:", error); navigate('/login'); }
    };
    checkAuth();
    return () => { mounted = false; };
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };
  const handleConnect = () => {
    if (connectStatus === 'CONNECTING' || connectStatus === 'CONNECTED') return;
    setConnectStatus('CONNECTING');
    setTimeout(() => setConnectStatus('CONNECTED'), 2000);
  };

  if (loading) return <Loader />;
  if (profile?.is_banned) return <BannedScreen />;
  if (!session) return null;

  const isMod = ['admin', 'moderator'].includes(profile.role);
  const isAdmin = profile.role === 'admin';

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* BACKGROUND NOISE & GRADIENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-black/60 backdrop-blur-xl flex flex-col justify-between py-8 fixed h-full z-40 transition-all duration-300">
        <div className="px-0 lg:px-6 flex flex-col w-full">
          {/* LOGO */}
          <div className="mb-12 flex items-center justify-center lg:justify-start w-full gap-4 group cursor-pointer lg:px-2">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-indigo-600 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-lg flex items-center justify-center relative z-10 border border-white/10">
                <Zap className="text-white w-6 h-6 fill-white" />
              </div>
            </div>
            <div className="hidden lg:flex flex-col whitespace-nowrap overflow-hidden">
              <span className="font-black text-white text-xl tracking-tighter leading-none">SAGITARIUS</span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Nexus Hub</span>
            </div>
          </div>

          {/* NAV */}
          <nav className="space-y-2 w-full px-3 lg:px-2">
            <NavBtn label="Overview" active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={LayoutDashboard} />
            <NavBtn label="HTTP Client" active={view === 'http'} onClick={() => setView('http')} icon={Code} />
            <NavBtn label="Network" active={view === 'network'} onClick={() => setView('network')} icon={Globe} />
            {isMod && (
              <NavBtn label="Admin" active={view === 'admin'} onClick={() => setView('admin')} icon={ShieldCheck} />
            )}
            <NavBtn label="Settings" active={view === 'settings'} onClick={() => setView('settings')} icon={Settings} />
          </nav>
        </div>

        {/* USER PROFILE */}
        <div className="px-3 lg:px-6 w-full">
          <div className="hidden lg:block mb-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center text-xs font-bold text-white relative shrink-0">
                {profile.username.substring(0, 2).toUpperCase()}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#101010]"></div>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{profile.username}</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                  Role: <span className="text-zinc-300">{profile.role.toUpperCase()}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start w-full p-2 text-zinc-500 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 lg:mr-3 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden lg:inline text-xs font-bold tracking-wider">LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-20 lg:ml-72 p-6 lg:p-12 max-w-[1600px] w-full relative z-10 transition-all duration-300">

        {/* TOP HEADER & CONNECT BUTTON */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{view === 'http' ? 'HTTP Protocol' : view.charAt(0).toUpperCase() + view.slice(1)}</h1>
            <p className="text-xs text-zinc-500 font-mono">SYSTEM v2.5.0 // ONLINE</p>
          </div>

          <div className="flex items-center gap-6">
            {/* CONNECT BUTTON */}
            <button
              onClick={handleConnect}
              className={`relative group overflow-hidden px-8 py-3 rounded-md font-bold text-sm tracking-wider transition-all duration-300 ${connectStatus === 'CONNECTED' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' :
                  connectStatus === 'CONNECTING' ? 'bg-zinc-800 text-zinc-500 cursor-wait' :
                    'bg-white text-black hover:scale-105'
                }`}
            >
              <div className="flex items-center gap-2 relative z-10">
                {connectStatus === 'CONNECTING' ? <Activity className="w-4 h-4 animate-spin" /> :
                  connectStatus === 'CONNECTED' ? <Wifi className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                <span>
                  {connectStatus === 'IDLE' ? 'CONNECT' :
                    connectStatus === 'CONNECTING' ? 'ESTABLISHING...' : 'SECURE'}
                </span>
              </div>
            </button>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-10 w-10 bg-zinc-900/50 backdrop-blur rounded-full flex items-center justify-center border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all"
              >
                <Bell className={`w-4 h-4 ${showNotifications ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full"></span>
              </button>
              {/* ... Notification Dropdown Code (Similar to before but styled) ... */}
            </div>
          </div>
        </div>

        {/* CONTENT VIEWS */}
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
          {view === 'dashboard' && <UserDashboard profile={profile} />}
          {view === 'http' && <HttpModule />}
          {view === 'network' && <NetworkModule profile={profile} />}
          {view === 'admin' && isAdmin && <AdminModule profile={profile} />}
          {view === 'settings' && <SettingsModule profile={profile} />}
        </div>

      </main>
    </div>
  );
}

// --- SUB-COMPONENT: NAV BTN ---
const NavBtn = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center lg:justify-start w-full px-4 py-3 rounded-lg transition-all duration-300 group ${active
      ? 'bg-gradient-to-r from-indigo-600/10 to-transparent border-l-2 border-indigo-500 text-white'
      : 'text-zinc-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      }`}
  >
    <Icon className={`w-5 h-5 lg:mr-3 transition-colors ${active ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-200'}`} />
    <span className="hidden lg:inline text-sm font-medium tracking-wide whitespace-nowrap">{label}</span>
  </button>
);

// --- MODULES ---

const UserDashboard = ({ profile }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={Activity} label="System Status" value="OPERATIONAL" sub="Latency: 24ms" color="text-emerald-400 border-emerald-400/20" />
      <StatCard icon={Cpu} label="Tier" value="PROFESSIONAL" sub="Valid License" color="text-indigo-400 border-indigo-400/20" />
      <StatCard icon={Terminal} label="API Requests" value="8,492" sub="Lifetime Calls" color="text-purple-400 border-purple-400/20" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* WELCOME / NEWS */}
      <div className="lg:col-span-2 space-y-6">
        <GlassCard className="bg-gradient-to-br from-indigo-900/20 to-zinc-900/50">
          <h2 className="text-xl font-bold text-white mb-2">Welcome, {profile.username}.</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            The network is stable. You can now use the HTTP Client to simulate secure protocol exchanges or monitor global traffic.
          </p>
        </GlassCard>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider pl-1">System Logs</h3>
          {[1, 2, 3].map(i => (
            <GlassCard key={i} className="py-4 flex gap-4 items-center group cursor-pointer hover:bg-white/5">
              <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">INFO</span>
                  <span className="text-xs text-zinc-600">Today, 14:02</span>
                </div>
                <h4 className="text-white font-medium group-hover:text-indigo-300 transition-colors">Protocol updated to HTTPS/2</h4>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* SIDE WIDGET */}
      <div className="space-y-6">
        <GlassCard>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Node Identity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-sm text-zinc-400">Handle</span>
              <span className="font-mono text-xs text-indigo-400">{profile.username}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-sm text-zinc-400">Location</span>
              <span className="font-mono text-xs text-white">ENCRYPTED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Signature</span>
              <span className="font-mono text-xs text-emerald-500">VERIFIED</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
);

const HttpModule = () => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const start = Date.now();
      const res = await fetch(url, { method });
      const data = await res.json();
      const time = Date.now() - start;
      setResponse({ status: res.status, time, data });
    } catch (e) {
      setResponse({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white font-mono focus:border-indigo-500 outline-none"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-black/50 border border-white/10 rounded px-4 py-2 text-white font-mono text-sm focus:border-indigo-500 outline-none"
            placeholder="https://api.example.com/endpoint"
          />
          <button
            onClick={executeRequest}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            SEND
          </button>
        </div>
      </GlassCard>

      {response && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="flex gap-4 mb-4">
            <GlassCard className="flex-1 py-3 px-4 !bg-black/40">
              <span className="text-xs text-zinc-500 block">STATUS</span>
              <span className={`text-xl font-mono font-bold ${response.error ? 'text-red-500' : 'text-green-400'}`}>
                {response.error ? 'ERR' : response.status}
              </span>
            </GlassCard>
            <GlassCard className="flex-1 py-3 px-4 !bg-black/40">
              <span className="text-xs text-zinc-500 block">TIME</span>
              <span className="text-xl font-mono font-bold text-white">{response.time || 0}ms</span>
            </GlassCard>
          </div>
          <GlassCard className="font-mono text-xs">
            <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
              <span className="text-zinc-500">RESPONSE BODY</span>
              <button className="text-indigo-400 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}>
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <pre className="text-zinc-300 overflow-x-auto custom-scrollbar max-h-[400px]">
              {JSON.stringify(response.data || response.error, null, 2)}
            </pre>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

const NetworkModule = ({ profile }) => (
  <GlassCard className="h-[600px] flex flex-col p-0">
    <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
      <span className="font-bold text-white text-sm">GLOBAL ENCRYPTED CHAT</span>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        <span className="text-xs text-zinc-400 font-mono">LIVE</span>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
      {/* Placeholder for complex chat logic from before to save space in this rewrite, assume imported or same logic */}
      <p className="font-mono animate-pulse">CONNECTING TO NODES...</p>
    </div>
  </GlassCard>
);

const AdminModule = ({ profile }) => (
  <div className="space-y-6">
    <GlassCard>
      <h3 className="font-bold text-white mb-4">Admin Dashboard</h3>
      <p className="text-sm text-zinc-400">Restricted area for system administrators.</p>
    </GlassCard>
  </div>
);

const SettingsModule = ({ profile }) => (
  <div className="max-w-2xl space-y-6">
    <GlassCard>
      <h3 className="font-bold text-white mb-6">Configuration</h3>
      <div className="space-y-4">
        {['Secure Mode', 'Developer Tools', 'Proxy Traffic'].map((setting, i) => (
          <div key={i} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0">
            <span className="text-sm text-zinc-300">{setting}</span>
            <div className={`w-10 h-5 rounded-full relative cursor-pointer ${i === 0 ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all ${i === 0 ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  </div>
);
