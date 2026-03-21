'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Globe, Copy, Check, ExternalLink, Loader2, Undo2, Redo2, User, Layout, Palette, Zap, Music, BarChart3, Layers, Search, Code, Package } from 'lucide-react';
import Image from 'next/image';
import BioEditor from '@/components/dashboard/bio/BioEditor';
import BioPreview from '@/components/dashboard/bio/BioPreview';
import { createClient } from '@/lib/supabase/client';
import type { BioConfig } from '@/types/bio';

const defaultConfig: BioConfig = {
  username: '',
  displayName: '',
  bio: '',
  avatarUrl: '',
  pronouns: '',
  location: '',
  badges: [],
  theme: {
    primaryColor: '#f97316',
    secondaryColor: '#ea580c',
    accentColor: '#ec4899',
    bgType: 'gradient',
    bgColor1: '#0a0a0a',
    bgColor2: '#1a0a2e',
    bgImageUrl: '',
    fontFamily: 'Inter',
    cardStyle: 'glass',
    borderRadius: 16,
    glowEnabled: true,
    glowColor: '#f97316',
    glowIntensity: 50,
  },
  effects: {
    bgEffect: 'particles',
    bgEffectIntensity: 50,
    bgEffectColor: '#f97316',
    cursorTrail: 'none',
    cursorTrailColor: '#f97316',
    avatarEffect: 'glow-pulse',
    textEffect: 'none',
    entranceAnimation: 'fade-up',
    clickEffect: 'none',
    hoverEffect: 'none',
    customCursor: 'default',
    audioVisualizer: false,
  },
  socials: [],
  customLinks: [],
  music: {
    enabled: false,
    type: 'spotify',
    url: '',
    autoplay: false,
  },
  stats: {
    showViews: true,
    showJoinDate: true,
    customStats: [],
  },
  customCss: '',
  bannerUrl: '',
  bannerHeight: 200,
  bannerOpacity: 100,
  bannerBlur: 0,
  boxWidth: 500,
  boxSpacing: 40,
  boxColor: '#000000',
  boxOpacity: 30,
  boxBlur: 12,
  boxShadowColor: '#000000',
  boxShadowOpacity: 50,
  boxTilt: 'none',
  borderStyle: 'none',
  borderWidth: 1,
  borderColor: '#ffffff',
  borderOpacity: 10,
  bgBlur: 0,
  bgOpacity: 100,
  avatarDecoration: 'none',
  avatarRadius: 50,
  usernameSparkles: 'none',
  layoutPreset: 'centered',
  scrollAnimation: true,
  glassmorphism: { enabled: true, blur: 12, opacity: 5 },
  statusIndicator: { enabled: false, text: 'Online', emoji: '🟢', color: '#22c55e' },
  seo: { title: '', description: '', ogImage: '' },
  profileShape: 'circle',
  backgroundOverlay: { enabled: false, color: '#000000', opacity: 30 },
  hoverEffect: 'none',
  clickEffect: 'none',
  clickSound: 'none',
  typingBio: false,
  entranceSpeed: 200,
  revealScreen: { enabled: false, text: 'Click to enter', blur: 15 },
  timeline: { enabled: false, items: [] },
  imageGallery: { enabled: false, images: [] },
  embedVideo: { enabled: false, url: '' },
  discordWidget: { enabled: false, userId: '' },
  languageTag: '',
};

export default function S3Page() {
  const [config, setConfig] = useState<BioConfig>(defaultConfig);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Undo / Redo history
  const [history, setHistory] = useState<BioConfig[]>([defaultConfig]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'effects', label: 'Effects', icon: Zap },
    { id: 'links', label: 'Links', icon: Layers },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'widgets', label: 'Widgets', icon: Package },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'advanced', label: 'Advanced', icon: Code },
  ];

  const handleConfigChange = useCallback((newConfig: BioConfig) => {
    setConfig(newConfig);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newConfig);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setConfig(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setConfig(history[historyIndex + 1]);
    }
  };

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        const role = profile?.role || 'member';
        setUserRole(role);

        // Allowed roles: owner, admin, vip, high_member
        const isAllowed = ['owner', 'admin', 'vip', 'high_member'].includes(role);
        if (!isAllowed) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from('bio_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setProfileId(data.id);
          setIsPublished(data.is_published);
          // Merge saved config with defaults to handle new fields
          const loadedConfig = { ...defaultConfig, ...(data.config as BioConfig) };
          setConfig(loadedConfig);
          setHistory([loadedConfig]);
          setHistoryIndex(0);
        } else {
          const initial = {
            ...defaultConfig,
            username: user.email?.split('@')[0] || '',
            displayName: user.email?.split('@')[0] || '',
          };
          setConfig(initial);
          setHistory([initial]);
          setHistoryIndex(0);
        }
      } catch {
        // No profile yet
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      if (!config.username.trim()) {
        alert('You must choose a username!');
        setSaving(false);
        return;
      }

      if (profileId) {
        const { error } = await supabase
          .from('bio_profiles')
          .update({
            username: config.username.toLowerCase().trim(),
            config: config as any,
            is_published: isPublished,
          })
          .eq('id', profileId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('bio_profiles')
          .insert({
            user_id: user.id,
            username: config.username.toLowerCase().trim(),
            config: config as any,
            is_published: isPublished,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setProfileId(data.id);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error('Save error:', err);
      if (err?.message?.includes('duplicate') || err?.message?.includes('unique')) {
        alert('This username is already taken!');
      } else {
        alert('Error saving: ' + (err?.message || 'Unknown error'));
      }
    } finally {
      setSaving(false);
    }
  }, [config, profileId, isPublished, supabase]);

  const handleTogglePublish = useCallback(async () => {
    const newState = !isPublished;
    setIsPublished(newState);
    
    if (profileId) {
      await supabase
        .from('bio_profiles')
        .update({ is_published: newState })
        .eq('id', profileId);
    }
  }, [isPublished, profileId, supabase]);

  const handleCopyUrl = useCallback(() => {
    const url = `${window.location.origin}/bio/${config.username.toLowerCase().trim()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [config.username]);

  const publicUrl = config.username ? `/bio/${config.username.toLowerCase().trim()}` : '';

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
          <Globe size={32} className="text-red-400 opacity-50 transition-all group-hover:opacity-100" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Access Restricted</h2>
        <div className="max-w-md space-y-2">
          <p className="text-sm text-white/40">The Bio Page is only accessible to <span className="text-[var(--accent-gold)] font-bold">Owner</span> and <span className="text-[var(--accent)] font-bold">Admin</span> users.</p>
          <p className="text-xs text-white/20">If you believe this is an error, please contact administrators.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard/software'}
          className="mt-4 px-6 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-white hover:bg-white/[0.06] transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#020202]">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 pt-[15px] pb-4 border-b border-white/[0.04] bg-[#050505]/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                <Image src="/logo.svg" alt="Logo" width={18} height={18} className="" />
             </div>
             <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-white">Sagitarius</span>
          </div>

          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-[var(--accent)]/20 text-[var(--accent-gold)] shadow-[0_0_20px_rgba(197,160,89,0.1)]' 
                      : 'text-white/30 hover:text-white hover:bg-white/5'
                  }`}
                  title={tab.label}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[var(--accent)] rounded-full" />
                  )}
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black border border-white/10 text-[8px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-2xl translate-y-2 group-hover:translate-y-0">
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-0.5 mr-2">
            <button 
              onClick={undo} 
              disabled={historyIndex === 0} 
              className={`p-1.5 rounded-md transition-all ${historyIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
            >
              <Undo2 size={13} />
            </button>
            <button 
              onClick={redo} 
              disabled={historyIndex === history.length - 1} 
              className={`p-1.5 rounded-md transition-all ${historyIndex === history.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
            >
              <Redo2 size={13} />
            </button>
          </div>

          <button
            onClick={handleTogglePublish}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all border ${
              isPublished
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
            }`}
          >
            <Globe size={12} />
            {isPublished ? 'Online' : 'Offline'}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-gold)] text-black text-[10px] uppercase font-black tracking-widest transition-all shadow-[0_4px_20px_rgba(197,160,89,0.2)] disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="w-[400px] shrink-0 overflow-y-auto border-r border-white/[0.04] bg-[#050505]/50">
          <BioEditor config={config} onChange={handleConfigChange} activeTab={activeTab as any} />
        </div>
        
        {/* Preview Panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
          {/* Sub-bar for Preview Controls */}
          <div className="flex items-center justify-between px-8 py-4 bg-[#050505]/30 border-b border-white/[0.04]">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
                 <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'desktop' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Desktop View</button>
                 <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'mobile' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Mobile View</button>
               </div>
               
               {config.username && (
                 <button onClick={handleCopyUrl} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/40 hover:text-white transition-all">
                   {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                   <span className="font-mono opacity-60">/{config.username}</span>
                 </button>
               )}
            </div>
            
            <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/50 animate-pulse" />
               Live Preview
            </div>
          </div>
          
          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center p-12 overflow-auto relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              previewMode === 'mobile' 
                ? 'w-[390px] h-[844px] rounded-[3.5rem] border-[12px] border-[#111] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden scale-[0.85]' 
                : 'w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl'
            }`}>
              <BioPreview config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
