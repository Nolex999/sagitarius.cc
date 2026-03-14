'use client';

import { useState } from 'react';
import BioEditor from '@/components/dashboard/bio/BioEditor';
import BioPreview from '@/components/dashboard/bio/BioPreview';
import type { BioConfig } from '@/types/bio';

const defaultConfig: BioConfig = {
  // Profile
  username: 'sagitarius',
  displayName: 'Sagitarius',
  bio: 'élite member • no limits',
  avatarUrl: '',
  pronouns: '',
  
  // Badges
  badges: ['Developer', 'Elite'],
  
  // Theme
  theme: {
    primaryColor: '#a855f7',
    secondaryColor: '#6366f1',
    accentColor: '#ec4899',
    bgType: 'gradient', // 'solid' | 'gradient' | 'image'
    bgColor1: '#0a0a0a',
    bgColor2: '#1a0a2e',
    bgImageUrl: '',
    fontFamily: 'Inter',
    cardStyle: 'glass', // 'glass' | 'solid' | 'outline' | 'neon'
    borderRadius: 16,
    glowEnabled: true,
    glowColor: '#a855f7',
    glowIntensity: 50,
  },
  
  // Effects
  effects: {
    bgEffect: 'particles', // 'none' | 'particles' | 'matrix' | 'stars' | 'rain' | 'snow' | 'fireflies'
    bgEffectIntensity: 50,
    bgEffectColor: '#a855f7',
    cursorTrail: 'none', // 'none' | 'glow' | 'sparkle' | 'trail' | 'fire'
    cursorTrailColor: '#a855f7',
    avatarEffect: 'glow-pulse', // 'none' | 'glow-pulse' | 'rotate-border' | 'glitch' | 'breathe'
    textEffect: 'none', // 'none' | 'gradient' | 'glitch' | 'typewriter' | 'neon-flicker'
    entranceAnimation: 'fade-up', // 'none' | 'fade-up' | 'scale' | 'slide-left' | 'glitch-in'
  },
  
  // Social Links
  socials: [
    { platform: 'discord', url: '', label: 'Discord' },
    { platform: 'telegram', url: '', label: 'Telegram' },
  ],
  
  // Custom Links
  customLinks: [
    { title: 'My Project', url: 'https://example.com', icon: 'link', enabled: true },
  ],
  
  // Music
  music: {
    enabled: false,
    type: 'spotify', // 'spotify' | 'soundcloud' | 'custom'
    url: '',
    autoplay: false,
  },
  
  // Stats
  stats: {
    showViews: true,
    showJoinDate: true,
    customStats: [
      { label: 'Projects', value: '12' },
      { label: 'Contributions', value: '1.2k' },
    ],
  },
  
  // Advanced
  customCss: '',
};

export default function S3Page() {
  const [config, setConfig] = useState<BioConfig>(defaultConfig);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

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
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">Preview</span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
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
