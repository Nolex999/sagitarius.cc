'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Globe, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
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
  badges: [],
  theme: {
    primaryColor: '#a855f7',
    secondaryColor: '#6366f1',
    accentColor: '#ec4899',
    bgType: 'gradient',
    bgColor1: '#0a0a0a',
    bgColor2: '#1a0a2e',
    bgImageUrl: '',
    fontFamily: 'Inter',
    cardStyle: 'glass',
    borderRadius: 16,
    glowEnabled: true,
    glowColor: '#a855f7',
    glowIntensity: 50,
  },
  effects: {
    bgEffect: 'particles',
    bgEffectIntensity: 50,
    bgEffectColor: '#a855f7',
    cursorTrail: 'none',
    cursorTrailColor: '#a855f7',
    avatarEffect: 'glow-pulse',
    textEffect: 'none',
    entranceAnimation: 'fade-up',
    clickEffect: 'none',
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
  layoutPreset: 'centered',
  scrollAnimation: true,
  glassmorphism: { enabled: true, blur: 12, opacity: 5 },
  borderStyle: 'none',
  statusIndicator: { enabled: false, text: 'Online', emoji: '🟢', color: '#22c55e' },
  seo: { title: '', description: '', ogImage: '' },
  profileShape: 'circle',
  backgroundOverlay: { enabled: false, color: '#000000', opacity: 30 },
  clickEffect: 'none',
  typingBio: false,
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

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('bio_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setProfileId(data.id);
          setIsPublished(data.is_published);
          // Merge saved config with defaults to handle new fields
          setConfig({ ...defaultConfig, ...(data.config as BioConfig) });
        } else {
          setConfig((prev: BioConfig) => ({
            ...prev,
            username: user.email?.split('@')[0] || '',
            displayName: user.email?.split('@')[0] || '',
          }));
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
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Editor Panel */}
      <div className="w-[420px] shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-base)]">
        <BioEditor config={config} onChange={setConfig} />
      </div>
      
      {/* Preview Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-0.5">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold transition-all ${
                  previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                Desktop
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold transition-all ${
                  previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                Mobile
              </button>
            </div>

            {config.username && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-[var(--text-secondary)] hover:text-white hover:border-white/15 transition-all"
                >
                  {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                  <span className="font-mono">{publicUrl}</span>
                </button>
                {isPublished && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-green-400/70 hover:text-green-400 transition-all"
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePublish}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all border ${
                isPublished
                  ? 'bg-green-500/10 border-green-400/20 text-green-400'
                  : 'bg-white/[0.02] border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Globe size={12} />
              {isPublished ? 'Online' : 'Offline'}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all border ${
                saved
                  ? 'bg-green-500/15 border-green-400/25 text-green-400'
                  : 'bg-white/10 border-white/15 text-white hover:bg-white/15'
              } disabled:opacity-50`}
            >
              {saving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : saved ? (
                <Check size={12} />
              ) : (
                <Save size={12} />
              )}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
        
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-6 bg-[#050505] overflow-auto">
          <div className={`transition-all duration-500 ${
            previewMode === 'mobile' ? 'w-[390px] h-[844px] rounded-[2.5rem] border-4 border-white/10 shadow-2xl overflow-hidden' : 'w-full h-full rounded-xl overflow-hidden border border-white/[0.06]'
          }`}>
            <BioPreview config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}
