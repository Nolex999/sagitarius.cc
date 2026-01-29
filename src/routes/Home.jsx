import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, User, ShieldAlert, Activity, LogOut,
  Globe, Bell, Settings, Terminal, Plus, Trash2, ShieldCheck,
  Copy, Check, Send, Zap, HardDrive, Cpu, Play, Server, Code, Wifi, Cloud, FileText, Download, UploadCloud
} from 'lucide-react';

// ... (Imports & Init remain same)

// Renamed from GlassCard to SolidCard for clarity in editing, though we kept prop name
const SolidCard = ({ children, className = "" }) => (
  // POLISH: Changed border-zinc-800 to border-white/10 for crisper contrast
  // POLISH: Added hover:border-white/20 for interaction feedback
  <div className={`bg-[#0A0A0A] border border-white/10 rounded-lg p-6 relative overflow-hidden group shadow-lg transition-colors hover:border-white/20 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color = "text-white" }) => (
  <SolidCard className="flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-zinc-900 border border-white/10 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">{label}</span>
    </div>
    <div>
      <h2 className={`text-3xl font-mono font-bold text-white tracking-tighter`}>{value}</h2>
      {sub && <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
  const [view, setView] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [connectStatus, setConnectStatus] = useState('IDLE'); // IDLE | CONNECTING | CONNECTED

  // ... (Auth & Logout remain same)

  // ... (Loader & Banned checks remain same)

  const isMod = ['admin', 'moderator'].includes(profile.role);
  const isAdmin = profile.role === 'admin';

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* ... (Background remains same) ... */}

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 border-r border-white/5 bg-black/60 backdrop-blur-xl flex flex-col justify-between py-8 fixed h-full z-40 transition-all duration-300">
        <div className="px-0 lg:px-6 flex flex-col w-full">
          {/* ... (Logo remains same) ... */}
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
            <NavBtn label="File Cloud" active={view === 'cloud'} onClick={() => setView('cloud')} icon={Cloud} />
            <NavBtn label="HTTP Client" active={view === 'http'} onClick={() => setView('http')} icon={Code} />
            <NavBtn label="Network" active={view === 'network'} onClick={() => setView('network')} icon={Globe} />
            {isMod && (
              <NavBtn label="Admin" active={view === 'admin'} onClick={() => setView('admin')} icon={ShieldCheck} />
            )}
            <NavBtn label="Settings" active={view === 'settings'} onClick={() => setView('settings')} icon={Settings} />
          </nav>
        </div>

        {/* ... (User Profile remains same) ... */}
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

        {/* ... (Header & Connect Button remain same, updated title calc) ... */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              {view === 'http' ? 'HTTP Protocol' : view === 'cloud' ? 'Secure Cloud Storage' : view.charAt(0).toUpperCase() + view.slice(1)}
            </h1>
            <p className="text-xs text-zinc-500 font-mono">SYSTEM v2.5.0 // ONLINE</p>
          </div>

          <div className="flex items-center gap-6">
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

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-10 w-10 bg-zinc-900/50 backdrop-blur rounded-full flex items-center justify-center border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all"
              >
                <Bell className={`w-4 h-4 ${showNotifications ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT VIEWS */}
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
          {view === 'dashboard' && <UserDashboard profile={profile} />}
          {view === 'cloud' && <FileShareModule isAdmin={isAdmin} />}
          {view === 'http' && <HttpModule />}
          {view === 'network' && <NetworkModule profile={profile} />}
          {view === 'admin' && isAdmin && <AdminModule profile={profile} />}
          {view === 'settings' && <SettingsModule profile={profile} />}
        </div>

      </main>
    </div>
  );
}

// ... (NavBtn remains same) ...

// --- MODULES ---

const UserDashboard = ({ profile }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={Activity} label="System Status" value="OPERATIONAL" sub="Latency: 24ms" color="text-emerald-400 border-white/10" />
      <StatCard icon={Cpu} label="Tier" value="PROFESSIONAL" sub="Valid License" color="text-indigo-400 border-white/10" />
      <StatCard icon={Terminal} label="API Requests" value="8,492" sub="Lifetime Calls" color="text-purple-400 border-white/10" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SolidCard className="bg-[#0A0A0A]">
          <h2 className="text-xl font-bold text-white mb-2">Welcome, {profile.username}.</h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            The network is stable. You can now use the HTTP Client to simulate secure protocol exchanges or monitor global traffic.
          </p>
        </SolidCard>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider pl-1">System Logs</h3>
          {[1, 2, 3].map(i => (
            <SolidCard key={i} className="py-4 flex gap-4 items-center group cursor-pointer hover:bg-zinc-900 border-transparent hover:border-zinc-800 transition-all">
              <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-indigo-400 font-mono border border-zinc-800">INFO</span>
                  <span className="text-xs text-zinc-500">Today, 14:02</span>
                </div>
                <h4 className="text-white font-medium group-hover:text-indigo-400 transition-colors">Protocol updated to HTTPS/2</h4>
              </div>
            </SolidCard>
          ))}
        </div>
      </div>
      {/* ... (Side Widget remains as previous SolidCard implementation) ... */}
      <div className="space-y-6">
        <SolidCard>
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Node Identity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-sm text-zinc-400">Handle</span>
              <span className="font-mono text-xs text-indigo-400">{profile.username}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-sm text-zinc-400">Location</span>
              <span className="font-mono text-xs text-zinc-500">ENCRYPTED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Signature</span>
              <span className="font-mono text-xs text-emerald-500">VERIFIED</span>
            </div>
          </div>
        </SolidCard>
      </div>
    </div>
  </div>
);

const FileShareModule = ({ isAdmin }) => {
  const [files, setFiles] = useState([
    { id: 1, name: 'config_v2_stable.json', size: '2.4 KB', date: '2023-10-27', uploader: 'Admin' },
    { id: 2, name: 'injector_log_dump.txt', size: '14 KB', date: '2023-10-26', uploader: 'System' },
    { id: 3, name: 'bypass_module_x64.dll', size: '4.2 MB', date: '2023-10-25', uploader: 'Admin' },
  ]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Simulate upload
    const newFiles = droppedFiles.map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      date: new Date().toISOString().split('T')[0],
      uploader: 'You'
    }));

    setFiles(prev => [...newFiles, ...prev]);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* ADMIN UPLOAD ZONE */}
      {isAdmin && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-zinc-800 rounded-xl p-10 flex flex-col items-center justify-center text-zinc-500 hover:border-indigo-500/50 hover:bg-zinc-900/50 transition-all cursor-pointer bg-[#0A0A0A]"
        >
          <UploadCloud className="w-12 h-12 mb-4 text-zinc-600" />
          <h3 className="text-lg font-bold text-white">Drop files here to upload</h3>
          <p className="text-sm text-zinc-500 mt-2">Only administrators can add files to the cloud.</p>
        </div>
      )}

      {/* FILE LIST */}
      <div className="grid grid-cols-1 gap-4">
        {files.map(file => (
          <SolidCard key={file.id} className="flex items-center justify-between group hover:border-zinc-700">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-zinc-900 rounded flex items-center justify-center border border-zinc-800">
                <FileText className="text-indigo-400 w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm group-hover:text-indigo-400 transition-colors">{file.name}</h4>
                <div className="flex gap-3 text-[10px] text-zinc-500 uppercase tracking-wider font-mono mt-1">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.date}</span>
                  <span>•</span>
                  <span>{file.uploader}</span>
                </div>
              </div>
            </div>

            <button className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </SolidCard>
        ))}

        {files.length === 0 && (
          <div className="text-center text-zinc-500 py-10 font-mono text-sm">NO FILES IN SECURE CLOUD</div>
        )}
      </div>
    </div>
  );
};

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
      <SolidCard>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-mono focus:border-indigo-500 outline-none"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-4 py-2 text-white font-mono text-sm focus:border-indigo-500 outline-none"
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
      </SolidCard>

      {response && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <div className="flex gap-4 mb-4">
            <SolidCard className="flex-1 py-3 px-4 !bg-zinc-900">
              <span className="text-xs text-zinc-500 block">STATUS</span>
              <span className={`text-xl font-mono font-bold ${response.error ? 'text-red-500' : 'text-green-400'}`}>
                {response.error ? 'ERR' : response.status}
              </span>
            </SolidCard>
            <SolidCard className="flex-1 py-3 px-4 !bg-zinc-900">
              <span className="text-xs text-zinc-500 block">TIME</span>
              <span className="text-xl font-mono font-bold text-white">{response.time || 0}ms</span>
            </SolidCard>
          </div>
          <SolidCard className="font-mono text-xs">
            <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">RESPONSE BODY</span>
              <button className="text-indigo-400 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}>
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <pre className="text-zinc-300 overflow-x-auto custom-scrollbar max-h-[400px]">
              {JSON.stringify(response.data || response.error, null, 2)}
            </pre>
          </SolidCard>
        </div>
      )}
    </div>
  );
};

const NetworkModule = ({ profile }) => (
  <SolidCard className="h-[600px] flex flex-col p-0">
    <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
      <span className="font-bold text-white text-sm">GLOBAL ENCRYPTED CHAT</span>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        <span className="text-xs text-zinc-400 font-mono">LIVE</span>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
      <p className="font-mono animate-pulse">CONNECTING TO NODES...</p>
    </div>
  </SolidCard>
);

const AdminModule = ({ profile }) => (
  <div className="space-y-6">
    <SolidCard>
      <h3 className="font-bold text-white mb-4">Admin Dashboard</h3>
      <p className="text-sm text-zinc-400">Restricted area for system administrators.</p>
    </SolidCard>
  </div>
);

const SettingsModule = ({ profile }) => (
  <div className="max-w-2xl space-y-6">
    <SolidCard>
      <h3 className="font-bold text-white mb-6">Configuration</h3>
      <div className="space-y-4">
        {['Secure Mode', 'Developer Tools', 'Proxy Traffic'].map((setting, i) => (
          <div key={i} className="flex justify-between items-center pb-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 p-2 rounded transition-colors -mx-2 px-2 cursor-pointer">
            <span className="text-sm text-zinc-300">{setting}</span>
            <div className={`w-10 h-5 rounded-full relative ${i === 0 ? 'bg-indigo-600' : 'bg-zinc-800 border border-zinc-700'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all ${i === 0 ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </SolidCard>
  </div>
);
```
