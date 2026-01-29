import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, User, ShieldAlert, Activity, LogOut,
  Globe, Bell, Settings, Terminal, Plus, Trash2, ShieldCheck, Copy, Check, Send
} from 'lucide-react';
import './Home.css'; // Assure-toi que ce fichier contient @tailwind directives si tu n'as pas setup Tailwind globalement

// --- INITIALISATION SUPABASE (Code fourni) ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- COMPOSANTS UI UTILITAIRES ---

const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#050505] text-xs font-mono tracking-widest text-zinc-500">
    <div className="flex flex-col items-center gap-4">
      <Activity className="h-8 w-8 animate-pulse text-indigo-500" />
      <span className="animate-pulse">INITIALIZING SECURE LINK...</span>
    </div>
  </div>
);

const BannedScreen = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#050505] text-red-500 p-4 text-center">
    <ShieldAlert className="h-16 w-16 mb-4 opacity-80" />
    <h1 className="text-3xl font-black uppercase tracking-tighter">Access Revoked</h1>
    <p className="mt-2 font-mono text-sm text-red-400/60">Your unique signature has been terminated.</p>
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = "text-white" }) => (
  <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-lg flex flex-col justify-between hover:border-zinc-700 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">{label}</span>
      {Icon && <Icon className="h-4 w-4 text-zinc-600" />}
    </div>
    <div>
      <h2 className={`text-2xl font-mono font-bold ${color}`}>{value}</h2>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function Home() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'network' | 'admin' | 'settings'
  const [showNotifications, setShowNotifications] = useState(false);

  // 1. AUTH & SECURITY
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/login');
          return;
        }

        // Fetch Profile for Role & Ban status
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (mounted) {
          setSession(session);
          setProfile(userProfile);
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        navigate('/login');
      }
    };

    checkAuth();
    return () => { mounted = false; };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Render Logic
  if (loading) return <Loader />;
  if (profile?.is_banned) return <BannedScreen />;
  if (!session) return null;

  const isAdmin = profile.role === 'admin';
  const isMod = ['admin', 'moderator'].includes(profile.role);

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30">

      {/* SIDEBAR */}
      <aside className="w-16 lg:w-64 border-r border-zinc-900 bg-black/40 flex flex-col justify-between py-6 fixed h-full z-20">
        <div className="px-0 lg:px-6 flex flex-col items-center lg:items-start">
          <div className="mb-10 flex items-center justify-center lg:justify-start w-full">
            <div className="h-8 w-8 bg-indigo-600 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <span className="font-bold text-white text-lg">S</span>
            </div>
            <span className="hidden lg:block ml-3 font-bold tracking-tighter text-white">
              SAGITARIUS
            </span>
          </div>

          <nav className="space-y-2 w-full px-2 lg:px-0">
            <NavBtn label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={LayoutDashboard} />
            <NavBtn label="Network" active={view === 'network'} onClick={() => setView('network')} icon={Globe} />
            {isMod && (
              <NavBtn label="Admin Panel" active={view === 'admin'} onClick={() => setView('admin')} icon={ShieldCheck} />
            )}
            <NavBtn label="Settings" active={view === 'settings'} onClick={() => setView('settings')} icon={Settings} />
          </nav>
        </div>

        <div className="px-0 lg:px-6 w-full">
          <div className="hidden lg:block mb-4 px-3 py-2 bg-zinc-900/50 rounded border border-zinc-800">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${profile.is_banned ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Operative</p>
            </div>
            <p className="text-xs font-mono text-white truncate">{profile.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start w-full p-2 text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 lg:mr-3" />
            <span className="hidden lg:inline text-xs font-bold">DISCONNECT</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-16 lg:ml-64 p-6 lg:p-10 max-w-7xl mx-auto w-full relative">
        {/* NOTIFICATION OVERLAY */}
        {showNotifications && (
          <div className="absolute top-16 right-10 w-80 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
              <button onClick={() => setShowNotifications(false)} className="text-zinc-500 hover:text-white">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.1929 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
            </div>
            <div className="p-2">
              <div className="flex flex-col gap-1">
                <div className="p-3 bg-zinc-950/50 rounded border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <div className="flex gap-2 text-xs">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span className="text-zinc-300">System updated to v2.4.0</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 pl-6">2 hours ago</span>
                </div>
                <div className="p-3 bg-zinc-950/50 rounded border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <div className="flex gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-zinc-300">Security audit passed</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 pl-6">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed top-6 right-6 lg:right-10 z-30">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-10 w-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 hover:border-indigo-500 transition-colors"
          >
            <Bell className={`w-4 h-4 ${showNotifications ? 'text-indigo-500' : 'text-zinc-400'}`} />
          </button>
        </div>

        {view === 'dashboard' && <UserDashboard profile={profile} session={session} />}
        {view === 'network' && <NetworkModule profile={profile} />}
        {view === 'admin' && isAdmin && <AdminModule profile={profile} />}
        {view === 'settings' && <SettingsModule profile={profile} session={session} />}
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: NAVIGATION BUTTON ---
const NavBtn = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center lg:justify-start w-full p-3 rounded-md transition-all duration-200 ${active
        ? 'bg-zinc-900 text-indigo-400 shadow-inner border border-zinc-800'
        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/30'
      }`}
  >
    <Icon className="w-5 h-5 lg:mr-3" strokeWidth={active ? 2.5 : 2} />
    <span className="hidden lg:inline text-sm font-medium">{label}</span>
  </button>
);

// --- MODULE 1: USER DASHBOARD ---
const UserDashboard = ({ profile, session }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-zinc-500 text-sm font-mono mt-1">ID: {profile.id.split('-')[0]}... • IP: HIDDEN</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={Activity} label="Status" value="ACTIVE" sub="Full Access Granted" color="text-green-500" />
        <StatCard icon={ShieldCheck} label="Clearance" value={profile.role.toUpperCase()} sub="Level 1" color="text-indigo-400" />
        <StatCard icon={Terminal} label="Joined" value={new Date(profile.created_at).toLocaleDateString()} color="text-zinc-400" />
      </div>

      <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-white">Identity Matrix</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-600 font-bold tracking-wider">Public Handle</label>
            <div className="bg-black border border-zinc-800 p-3 rounded-md text-zinc-300 font-mono text-sm">
              @{profile.username}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-600 font-bold tracking-wider">Encrypted Email</label>
            <div className="bg-black border border-zinc-800 p-3 rounded-md text-zinc-300 font-mono text-sm flex justify-between items-center">
              <span className="truncate">{session.user.email}</span>
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODULE 2: REALTIME NETWORK ---
const NetworkModule = ({ profile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    // Channel Realtime pour Chat + Presence
    const channel = supabase.channel('sagitarius-global')
      .on('presence', { event: 'sync' }, () => {
        setOnlineUsers(channel.presenceState());
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        setMessages(prev => [...prev, payload]);
        // Scroll automatique fluide
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: profile.id,
            username: profile.username,
            role: profile.role
          });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const payload = {
      text: input,
      user: profile.username,
      role: profile.role,
      timestamp: new Date().toISOString()
    };

    // Optimistic Update
    setMessages(prev => [...prev, payload]);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    await supabase.channel('sagitarius-global').send({
      type: 'broadcast', event: 'chat', payload
    });
  };

  const onlineCount = Object.keys(onlineUsers).length;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col border border-zinc-800 bg-zinc-950/50 rounded-lg overflow-hidden shadow-2xl">
      {/* Header Chat */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-indigo-500" />
          <span className="font-bold text-white text-sm tracking-wider">GLOBAL_NET</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-black/40 rounded-full border border-zinc-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-zinc-400 font-mono">{onlineCount} NODES ONLINE</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#050505] to-zinc-900/20">
        {messages.map((m, i) => {
          const isMe = m.user === profile.username;
          const isAdminMsg = m.role === 'admin';
          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className="flex items-baseline space-x-2 mb-1">
                <span className={`text-[10px] font-mono font-bold ${isAdminMsg ? 'text-red-500' : 'text-zinc-600'}`}>
                  {isMe ? 'YOU' : m.user}
                </span>
                <span className="text-[10px] text-zinc-800">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`px-4 py-2 rounded-lg text-sm max-w-[85%] break-words shadow-lg ${isMe
                  ? 'bg-indigo-600 text-white'
                  : isAdminMsg
                    ? 'bg-red-900/20 text-red-200 border border-red-900/50'
                    : 'bg-zinc-800 text-zinc-300'
                }`}>
                {m.text}
              </div>
            </div>
          )
        })}
        <div className="text-center text-[10px] text-zinc-800 py-4 font-mono">--- ENCRYPTED CHANNEL START ---</div>
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur">
        <div className="relative">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Transmit data..."
            className="w-full bg-black border border-zinc-700 text-zinc-200 pl-4 pr-12 py-3 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1 text-zinc-500 hover:text-indigo-400 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- MODULE 3: ADMIN PANEL ---
const AdminModule = ({ profile }) => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({ max_uses: 1, email: '' });
  const [lastCode, setLastCode] = useState(null);

  const fetchData = async () => {
    // Utilisation des tables existantes pour stats rapides
    const { data: s } = await supabase.from('admin_stats').select('*').single();
    const { data: l } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(15);
    if (s) setStats(s);
    if (l) setLogs(l);
  };

  useEffect(() => {
    fetchData();
    // Live update logs
    const channel = supabase.channel('admin_audit')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        (payload) => setLogs(prev => [payload.new, ...prev].slice(0, 15))
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const generateInvite = async () => {
    const code = `SAG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Insert sans recréer la table (conforme aux instructions)
    const { error } = await supabase.from('inv_code').insert([{
      code,
      max_uses: settings.max_uses,
      restricted_to_email: settings.email || null,
      created_by: profile.id
    }]);

    if (!error) {
      setLastCode(code);
      // RPC Call pour log
      await supabase.rpc('log_activity', {
        event: 'INVITE_CREATED',
        desc: `Admin generated code ${code} (${settings.max_uses} uses)`,
        meta: { creator: profile.username }
      });
      fetchData(); // Refresh stats
    } else {
      alert("Error generating code");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6 text-red-500">
        <ShieldAlert className="w-6 h-6" />
        <h2 className="text-xl font-bold tracking-tight">ADMINISTRATION LAYER</h2>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.total_users || 0} color="text-white" />
        <StatCard label="Active Codes" value={stats?.active_invites || 0} color="text-indigo-400" />
        <StatCard label="24h Logins" value={stats?.logins_24h || 0} color="text-green-400" />
        <StatCard label="Sys Load" value="LOW" color="text-zinc-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Invite Factory */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" /> Invite Factory
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-24">
                <label className="text-[10px] uppercase text-zinc-500 font-bold">Uses</label>
                <input
                  type="number"
                  min="1"
                  value={settings.max_uses}
                  onChange={e => setSettings({ ...settings, max_uses: e.target.value })}
                  className="w-full bg-black border border-zinc-700 text-white p-2 rounded mt-1 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase text-zinc-500 font-bold">Restricted Email (Optional)</label>
                <input
                  type="email"
                  placeholder="vip@example.com"
                  value={settings.email}
                  onChange={e => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-black border border-zinc-700 text-white p-2 rounded mt-1 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={generateInvite}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-sm transition-all"
            >
              GENERATE ACCESS KEY
            </button>

            {lastCode && (
              <div className="mt-4 p-4 bg-green-900/10 border border-green-500/30 rounded flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-green-500 uppercase font-bold">Generated Key</span>
                  <span className="font-mono text-xl text-green-400 font-bold tracking-widest">{lastCode}</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(lastCode)}
                  className="p-2 hover:bg-green-500/20 rounded text-green-400"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 flex flex-col h-[400px]">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-500" /> Audit Stream
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {logs.map((log) => (
              <div key={log.id} className="text-xs border-b border-zinc-800/50 pb-2 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-indigo-400 font-bold">{log.event}</span>
                  <span className="text-zinc-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-zinc-400 truncate">{log.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- MODULE 4: SETTINGS ---
const SettingsModule = ({ profile }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-indigo-500" />
        <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
      </div>

      <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-8">
        <h2 className="text-lg font-bold text-white mb-4">Account Security</h2>
        <div className="grid gap-6 max-w-xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Display Name</label>
            <input
              disabled
              value={profile.username}
              className="bg-black/50 border border-zinc-800 rounded p-2 text-zinc-500 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Passphrase</label>
            <button className="bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-sm hover:border-indigo-500 transition-colors text-left flex justify-between items-center">
              <span>Change Password</span>
              <ShieldCheck className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-8">
        <h2 className="text-lg font-bold text-white mb-4">Notification Stream</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-zinc-800/50">
            <div>
              <h3 className="text-sm font-medium text-white">System Alerts</h3>
              <p className="text-xs text-zinc-500">Receive critical system status updates</p>
            </div>
            <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-zinc-800/50">
            <div>
              <h3 className="text-sm font-medium text-white">Network Activity</h3>
              <p className="text-xs text-zinc-500">Notify when nodes join the global net</p>
            </div>
            <div className="w-10 h-5 bg-zinc-700 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-400 rounded-full shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
