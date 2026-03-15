'use client';

import { useState } from 'react';
import {
  User, Palette, Sparkles, Link2, Music, BarChart3, Code2,
  Plus, Trash2, GripVertical, Layout, Puzzle, Search,
  Image, Video, MessageCircle, Flag, Globe, ExternalLink,
} from 'lucide-react';
import type { BioConfig } from '@/types/bio';
import MediaUploader from './MediaUploader';
import AdvancedColorPicker from './AdvancedColorPicker';
import PaletteSelector from './PaletteSelector';

type TabId = 'profile' | 'layout' | 'theme' | 'effects' | 'links' | 'music' | 'stats' | 'widgets' | 'seo' | 'advanced';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'layout', label: 'Layout', icon: Layout },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'links', label: 'Links', icon: Link2 },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'widgets', label: 'Widgets', icon: Puzzle },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'advanced', label: 'CSS', icon: Code2 },
];

const fontOptions = [
  'Inter', 'Outfit', 'Space Grotesk', 'JetBrains Mono', 'Fira Code',
  'Poppins', 'Rajdhani', 'Orbitron', 'Audiowide', 'Syncopate',
  'Press Start 2P', 'Silkscreen', 'IBM Plex Mono', 'Montserrat',
  'Lexend', 'Satisfy', 'Bebas Neue', 'Righteous', 'Permanent Marker',
];

const socialPlatforms = [
  'discord', 'telegram', 'twitter', 'github', 'youtube', 'twitch',
  'spotify', 'steam', 'instagram', 'tiktok', 'snapchat', 'reddit',
  'soundcloud', 'kick', 'email',
];

const badgePresets = [
  'Developer', 'Designer', 'Creator', 'Hacker',
  'Gamer', 'Producer', 'Artist', 'Streamer',
  'Elite', 'OG', 'Legend', 'Alpha', 'Goat',
  'Phantom', 'Ghost', 'Demon', 'Dark',
  'VIP', 'Founder', 'Beta', 'Verified',
];

const presetColors = [
  '#a855f7', '#6366f1', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#f43f5e', '#14b8a6', '#ffffff', '#64748b',
];

const emojiPresets = ['🟢', '🔴', '🟡', '🔵', '⚡', '🎮', '💀', '👑', '🔥', '💤', '🎵', '📍', '💻', '🌙'];

interface EditorProps {
  config: BioConfig;
  onChange: (config: BioConfig) => void;
}

// ====== HELPER COMPONENTS ======

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[9px] uppercase tracking-[0.25em] font-bold text-[var(--text-muted)] mb-3 mt-5 first:mt-0">
      {children}
    </h3>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] uppercase tracking-[0.15em] font-semibold text-[var(--text-secondary)] mb-1.5">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-white/20 transition-colors"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-white/20 transition-colors resize-none font-mono"
    />
  );
}

// Removed basic ColorPicker since we use AdvancedColorPicker

function SliderInput({ value, onChange, min = 0, max = 100, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1 appearance-none rounded-full bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
      />
      <span className="text-[10px] font-mono text-[var(--text-muted)] w-8 text-right">{value}{label}</span>
    </div>
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-9 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23555' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-[#111] text-white">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
        value ? 'bg-purple-500/50 border-purple-400/30' : 'bg-white/[0.06] border-white/[0.08]'
      } border`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${
        value ? 'left-[calc(100%-18px)] bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'left-0.5 bg-white/30'
      }`} />
    </button>
  );
}

function OptionGrid({ value, onChange, options, cols = 2 }: { value: string; onChange: (v: string) => void; options: { value: string; label: string; icon?: React.ReactNode }[]; cols?: number }) {
  return (
    <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-2 h-9 px-3 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
            value === opt.value
              ? 'bg-purple-500/15 border border-purple-400/30 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.1)]'
              : 'bg-white/[0.02] border border-white/[0.06] text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-white'
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <FieldLabel>{label}</FieldLabel>
      <ToggleSwitch value={value} onChange={onChange} />
    </div>
  );
}

// ====== MAIN COMPONENT ======

export default function BioEditor({ config, onChange }: EditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [customBadge, setCustomBadge] = useState('');
  
  // Custom CSS State
  const [cssInput, setCssInput] = useState(config.customCss);
  const [cssStatus, setCssStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cssMessage, setCssMessage] = useState('');

  const update = <K extends keyof BioConfig>(key: K, value: BioConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const updateTheme = <K extends keyof BioConfig['theme']>(key: K, value: BioConfig['theme'][K]) => {
    onChange({ ...config, theme: { ...config.theme, [key]: value } });
  };

  const updateEffects = <K extends keyof BioConfig['effects']>(key: K, value: BioConfig['effects'][K]) => {
    onChange({ ...config, effects: { ...config.effects, [key]: value } });
  };

  const updateMusic = <K extends keyof BioConfig['music']>(key: K, value: BioConfig['music'][K]) => {
    onChange({ ...config, music: { ...config.music, [key]: value } });
  };

  const updateStats = <K extends keyof BioConfig['stats']>(key: K, value: BioConfig['stats'][K]) => {
    onChange({ ...config, stats: { ...config.stats, [key]: value } });
  };

  const updateStatus = <K extends keyof BioConfig['statusIndicator']>(key: K, value: BioConfig['statusIndicator'][K]) => {
    onChange({ ...config, statusIndicator: { ...config.statusIndicator, [key]: value } });
  };

  const updateGlassmorphism = <K extends keyof BioConfig['glassmorphism']>(key: K, value: BioConfig['glassmorphism'][K]) => {
    onChange({ ...config, glassmorphism: { ...config.glassmorphism, [key]: value } });
  };

  const updateBgOverlay = <K extends keyof BioConfig['backgroundOverlay']>(key: K, value: BioConfig['backgroundOverlay'][K]) => {
    onChange({ ...config, backgroundOverlay: { ...config.backgroundOverlay, [key]: value } });
  };

  const updateSeo = <K extends keyof BioConfig['seo']>(key: K, value: BioConfig['seo'][K]) => {
    onChange({ ...config, seo: { ...config.seo, [key]: value } });
  };

  const updateTimeline = <K extends keyof BioConfig['timeline']>(key: K, value: BioConfig['timeline'][K]) => {
    onChange({ ...config, timeline: { ...config.timeline, [key]: value } });
  };

  const updateGallery = <K extends keyof BioConfig['imageGallery']>(key: K, value: BioConfig['imageGallery'][K]) => {
    onChange({ ...config, imageGallery: { ...config.imageGallery, [key]: value } });
  };

  const updateVideo = <K extends keyof BioConfig['embedVideo']>(key: K, value: BioConfig['embedVideo'][K]) => {
    onChange({ ...config, embedVideo: { ...config.embedVideo, [key]: value } });
  };

  const updateDiscord = <K extends keyof BioConfig['discordWidget']>(key: K, value: BioConfig['discordWidget'][K]) => {
    onChange({ ...config, discordWidget: { ...config.discordWidget, [key]: value } });
  };


  // ====== TAB CONTENT ======

  const renderProfile = () => (
    <div className="space-y-4">
      <SectionTitle>Identity</SectionTitle>
      
      <div>
        <FieldLabel>Display Name <span className="text-white/20 font-normal">{config.displayName.length}/25</span></FieldLabel>
        <TextInput value={config.displayName} onChange={v => update('displayName', v)} placeholder="Your name" />
      </div>
      
      <div>
        <FieldLabel>Username</FieldLabel>
        <TextInput value={config.username} onChange={v => update('username', v)} placeholder="@username" />
      </div>

      <div>
        <FieldLabel>Pronouns</FieldLabel>
        <TextInput value={config.pronouns} onChange={v => update('pronouns', v)} placeholder="he/him, she/her..." />
      </div>

      <div>
        <FieldLabel>Location <span className="text-white/20 font-normal">{(config.location || '').length}/50</span></FieldLabel>
        <TextInput value={config.location || ''} onChange={v => update('location', v)} placeholder="City, Country..." />
      </div>

      <div>
        <FieldLabel>Bio</FieldLabel>
        <TextArea value={config.bio} onChange={v => update('bio', v)} placeholder="Describe yourself in a few words..." />
      </div>

      <div>
        <FieldLabel>Avatar URL</FieldLabel>
        <MediaUploader value={config.avatarUrl} onChange={v => update('avatarUrl', v)} type="image" />
      </div>

      <div>
        <FieldLabel>Avatar Shape</FieldLabel>
        <OptionGrid
          value={config.profileShape}
          onChange={v => update('profileShape', v as any)}
          options={[
            { value: 'circle', label: 'Circle' },
            { value: 'rounded-square', label: 'Square' },
            { value: 'hexagon', label: 'Hexagon' },
          ]}
          cols={3}
        />
      </div>

      <div>
        <FieldLabel>Avatar Radius — {config.avatarRadius ?? 50}px</FieldLabel>
        <SliderInput value={config.avatarRadius ?? 50} onChange={v => update('avatarRadius', v)} min={0} max={50} label="px" />
      </div>

      <SectionTitle>Banner</SectionTitle>
      
      <div>
        <FieldLabel>Banner image URL</FieldLabel>
        <MediaUploader value={config.bannerUrl} onChange={v => update('bannerUrl', v)} type="image" />
      </div>

      <div>
        <FieldLabel>Banner Height — {config.bannerHeight}px</FieldLabel>
        <SliderInput value={config.bannerHeight} onChange={v => update('bannerHeight', v)} min={100} max={400} label="px" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Banner Opacity — {config.bannerOpacity ?? 100}%</FieldLabel>
          <SliderInput value={config.bannerOpacity ?? 100} onChange={v => update('bannerOpacity', v)} label="%" />
        </div>
        <div>
          <FieldLabel>Banner Blur — {config.bannerBlur ?? 0}px</FieldLabel>
          <SliderInput value={config.bannerBlur ?? 0} onChange={v => update('bannerBlur', v)} label="px" />
        </div>
      </div>

      <SectionTitle>Status</SectionTitle>

      <ToggleRow label="Show status" value={config.statusIndicator?.enabled ?? false} onChange={v => updateStatus('enabled', v)} />

      {config.statusIndicator?.enabled && (
        <>
          <div>
            <FieldLabel>Status text</FieldLabel>
            <TextInput value={config.statusIndicator.text} onChange={v => updateStatus('text', v)} placeholder="Online, AFK, Gaming..." />
          </div>
          <div>
            <FieldLabel>Emoji</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {emojiPresets.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => updateStatus('emoji', emoji)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                    config.statusIndicator.emoji === emoji ? 'bg-purple-500/20 border border-purple-400/30 scale-110' : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>Status color</FieldLabel>
            <AdvancedColorPicker value={config.statusIndicator.color} onChange={v => updateStatus('color', v)} />
          </div>
        </>
      )}

      <SectionTitle>Language</SectionTitle>
      <div>
        <FieldLabel>Language tag</FieldLabel>
        <TextInput value={config.languageTag} onChange={v => update('languageTag', v)} placeholder="FR, EN, DE..." />
      </div>

      <SectionTitle>Badges</SectionTitle>
      <div className="flex flex-wrap gap-1.5">
        {badgePresets.map(badge => {
          const isActive = config.badges.includes(badge);
          return (
            <button
              key={badge}
              onClick={() => {
                if (isActive) {
                  update('badges', config.badges.filter(b => b !== badge));
                } else {
                  update('badges', [...config.badges, badge]);
                }
              }}
              className={`px-2.5 py-1 rounded-md text-[9px] uppercase tracking-wider font-bold transition-all ${
                isActive
                  ? 'bg-purple-500/20 border border-purple-400/30 text-purple-300'
                  : 'bg-white/[0.02] border border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {badge}
            </button>
          );
        })}
      </div>
      
      <div>
        <FieldLabel>Custom badge</FieldLabel>
        <div className="flex gap-2">
          <TextInput 
            value={customBadge} 
            onChange={setCustomBadge} 
            placeholder="Badge name" 
          />
          <button
            onClick={() => {
              if (customBadge.trim()) {
                update('badges', [...config.badges, customBadge.trim()]);
                setCustomBadge('');
              }
            }}
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-purple-500/15 border border-purple-400/20 text-purple-400 hover:bg-purple-500/25 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderLayout = () => (
    <div className="space-y-4">
      <SectionTitle>Layout preset</SectionTitle>
      
      <div>
        <FieldLabel>Page style</FieldLabel>
        <OptionGrid
          value={config.layoutPreset}
          onChange={v => update('layoutPreset', v as any)}
          options={[
            { value: 'centered', label: 'Centered' },
            { value: 'left-aligned', label: 'Left-aligned' },
            { value: 'card', label: 'Card' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'hero', label: 'Hero' },
          ]}
        />
      </div>

      <SectionTitle>Animations</SectionTitle>

      <ToggleRow label="Scroll animations" value={config.scrollAnimation} onChange={v => update('scrollAnimation', v)} />
      <ToggleRow label="Typewriter bio" value={config.typingBio} onChange={v => update('typingBio', v)} />

      <SectionTitle>Glassmorphism</SectionTitle>

      <ToggleRow label="Enable glassmorphism" value={config.glassmorphism?.enabled ?? false} onChange={v => updateGlassmorphism('enabled', v)} />

      {config.glassmorphism?.enabled && (
        <>
          <div>
            <FieldLabel>Blur — {config.glassmorphism.blur}px</FieldLabel>
            <SliderInput value={config.glassmorphism.blur} onChange={v => updateGlassmorphism('blur', v)} min={0} max={40} label="px" />
          </div>
          <div>
            <FieldLabel>Opacity — {config.glassmorphism.opacity}%</FieldLabel>
            <SliderInput value={config.glassmorphism.opacity} onChange={v => updateGlassmorphism('opacity', v)} label="%" />
          </div>
        </>
      )}

      <SectionTitle>Profile Border</SectionTitle>

      <div>
        <FieldLabel>Border Style</FieldLabel>
        <OptionGrid
          value={config.borderStyle}
          onChange={v => update('borderStyle', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'animated', label: 'Animated' },
            { value: 'dashed', label: 'Dashed' },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Border Width — {config.borderWidth ?? 1}px</FieldLabel>
          <SliderInput value={config.borderWidth ?? 1} onChange={v => update('borderWidth', v)} min={0} max={5} label="px" />
        </div>
        <div>
          <FieldLabel>Border Opacity — {config.borderOpacity ?? 10}%</FieldLabel>
          <SliderInput value={config.borderOpacity ?? 10} onChange={v => update('borderOpacity', v)} label="%" />
        </div>
      </div>

      <div className="z-10 relative">
        <AdvancedColorPicker label="Border Color" value={config.borderColor || '#ffffff'} onChange={v => update('borderColor', v)} />
      </div>

      <SectionTitle>Box (Card Container)</SectionTitle>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Box Width — {config.boxWidth ?? 500}px</FieldLabel>
          <SliderInput value={config.boxWidth ?? 500} onChange={v => update('boxWidth', v)} min={300} max={800} label="px" />
        </div>
        <div>
          <FieldLabel>Box Spacing — {config.boxSpacing ?? 40}px</FieldLabel>
          <SliderInput value={config.boxSpacing ?? 40} onChange={v => update('boxSpacing', v)} min={0} max={100} label="px" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Box Opacity — {config.boxOpacity ?? 30}%</FieldLabel>
          <SliderInput value={config.boxOpacity ?? 30} onChange={v => update('boxOpacity', v)} label="%" />
        </div>
        <div>
          <FieldLabel>Box Blur — {config.boxBlur ?? 12}px</FieldLabel>
          <SliderInput value={config.boxBlur ?? 12} onChange={v => update('boxBlur', v)} min={0} max={50} label="px" />
        </div>
      </div>

      <div className="z-10 relative">
        <AdvancedColorPicker label="Box Color" value={config.boxColor || '#000000'} onChange={v => update('boxColor', v)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="z-10 relative">
          <AdvancedColorPicker label="Shadow Color" value={config.boxShadowColor || '#000000'} onChange={v => update('boxShadowColor', v)} />
        </div>
        <div>
          <FieldLabel>Shadow Opacity — {config.boxShadowOpacity ?? 50}%</FieldLabel>
          <SliderInput value={config.boxShadowOpacity ?? 50} onChange={v => update('boxShadowOpacity', v)} label="%" />
        </div>
      </div>

      <div>
        <FieldLabel>Box Tilt (3D Hover)</FieldLabel>
        <OptionGrid
          value={config.boxTilt || 'none'}
          onChange={v => update('boxTilt', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'scale', label: 'Scale' },
            { value: 'reverse-scale', label: 'Rev Scale' },
            { value: 'tilt-x', label: 'Tilt X' },
            { value: 'tilt-y', label: 'Tilt Y' },
          ]}
          cols={3}
        />
      </div>

      <SectionTitle>Background</SectionTitle>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>BG Blur — {config.bgBlur ?? 0}px</FieldLabel>
          <SliderInput value={config.bgBlur ?? 0} onChange={v => update('bgBlur', v)} min={0} max={30} label="px" />
        </div>
        <div>
          <FieldLabel>BG Opacity — {config.bgOpacity ?? 100}%</FieldLabel>
          <SliderInput value={config.bgOpacity ?? 100} onChange={v => update('bgOpacity', v)} label="%" />
        </div>
      </div>

      <SectionTitle>Background overlay</SectionTitle>

      <ToggleRow label="Enable overlay" value={config.backgroundOverlay?.enabled ?? false} onChange={v => updateBgOverlay('enabled', v)} />

      {config.backgroundOverlay?.enabled && (
        <>
          <div className="z-10 relative">
            <AdvancedColorPicker label="Overlay color" value={config.backgroundOverlay.color} onChange={v => updateBgOverlay('color', v)} />
          </div>
          <div>
            <FieldLabel>Opacity — {config.backgroundOverlay.opacity}%</FieldLabel>
            <SliderInput value={config.backgroundOverlay.opacity} onChange={v => updateBgOverlay('opacity', v)} label="%" />
          </div>
        </>
      )}
    </div>
  );

  const renderTheme = () => (
    <div className="space-y-4">
      <SectionTitle>Theme Palettes</SectionTitle>
      <PaletteSelector 
        currentTheme={config.theme} 
        onChange={(colors) => {
          onChange({
            ...config,
            theme: {
              ...config.theme,
              primaryColor: colors.primaryColor,
              secondaryColor: colors.secondaryColor,
              accentColor: colors.accentColor,
              bgColor1: colors.bgColor1,
              bgColor2: colors.bgColor2,
            }
          });
        }} 
      />

      <div className="h-px bg-white/10 my-6" />

      <SectionTitle>Custom Colors</SectionTitle>
      
      <div className="grid grid-cols-2 gap-4">
        <AdvancedColorPicker label="Primary" value={config.theme.primaryColor} onChange={v => updateTheme('primaryColor', v)} />
        <AdvancedColorPicker label="Secondary" value={config.theme.secondaryColor} onChange={v => updateTheme('secondaryColor', v)} />
        <AdvancedColorPicker label="Accent" value={config.theme.accentColor} onChange={v => updateTheme('accentColor', v)} />
      </div>

      <SectionTitle>Background</SectionTitle>
      
      <div>
        <FieldLabel>Type</FieldLabel>
        <OptionGrid
          value={config.theme.bgType}
          onChange={v => updateTheme('bgType', v as any)}
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'image', label: 'Image' },
            { value: 'video', label: 'Video' },
            { value: 'pattern', label: 'Pattern' },
          ]}
          cols={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AdvancedColorPicker label="BG Color 1" value={config.theme.bgColor1} onChange={v => updateTheme('bgColor1', v)} />

        {config.theme.bgType === 'gradient' && (
          <AdvancedColorPicker label="BG Color 2" value={config.theme.bgColor2} onChange={v => updateTheme('bgColor2', v)} />
        )}
      </div>

      {config.theme.bgType === 'image' && (
        <div className="space-y-1">
          <FieldLabel>URL de l&apos;image ou vidéo local</FieldLabel>
          <MediaUploader value={config.theme.bgImageUrl} onChange={v => updateTheme('bgImageUrl', v)} type="any" />
        </div>
      )}

      {config.theme.bgType === 'video' && (
        <div className="space-y-4">
          <div>
            <FieldLabel>Local Video or External URL (MP4/WebM)</FieldLabel>
            <MediaUploader value={config.theme.bgVideoUrl || ''} onChange={v => updateTheme('bgVideoUrl', v)} type="video" />
          </div>
          <div>
            <FieldLabel>Video Library (Quick Presets)</FieldLabel>
            <OptionGrid
              value={config.theme.bgVideoUrl || ''}
              onChange={v => updateTheme('bgVideoUrl', v)}
              options={[
                { value: 'https://cdn.pixabay.com/video/2016/09/21/5361-182959196_tiny.mp4', label: 'Nebula' },
                { value: 'https://cdn.pixabay.com/video/2020/07/11/44474-439561073_tiny.mp4', label: 'Cyber City' },
                { value: 'https://cdn.pixabay.com/video/2021/08/17/85382-589945415_tiny.mp4', label: 'Matrix' },
                { value: 'https://cdn.pixabay.com/video/2020/05/18/39474-421711202_tiny.mp4', label: 'Anime Clouds' },
              ]}
              cols={2}
            />
          </div>
        </div>
      )}

      {config.theme.bgType === 'pattern' && (
        <div>
          <FieldLabel>Pattern Type</FieldLabel>
          <OptionGrid
            value={config.theme.bgPattern || 'dots'}
            onChange={v => updateTheme('bgPattern', v as any)}
            options={[
              { value: 'dots', label: 'Polka Dots' },
              { value: 'grid', label: 'Grid' },
              { value: 'waves', label: 'Waves' },
              { value: 'diagonal', label: 'Diagonal Lines' },
            ]}
            cols={2}
          />
        </div>
      )}

      <SectionTitle>Style</SectionTitle>

      <div>
        <FieldLabel>Font</FieldLabel>
        <SelectInput
          value={config.theme.fontFamily}
          onChange={v => updateTheme('fontFamily', v)}
          options={fontOptions.map(f => ({ value: f, label: f }))}
        />
      </div>

      <div>
        <FieldLabel>Card style</FieldLabel>
        <OptionGrid
          value={config.theme.cardStyle}
          onChange={v => updateTheme('cardStyle', v as any)}
          options={[
            { value: 'glass', label: 'Glass' },
            { value: 'solid', label: 'Solid' },
            { value: 'outline', label: 'Outline' },
            { value: 'neon', label: 'Neon' },
          ]}
        />
      </div>

      <div>
        <FieldLabel>Border Radius — {config.theme.borderRadius}px</FieldLabel>
        <SliderInput value={config.theme.borderRadius} onChange={v => updateTheme('borderRadius', v)} min={0} max={32} label="px" />
      </div>

      <SectionTitle>Glow</SectionTitle>
      
      <ToggleRow label="Enable glow" value={config.theme.glowEnabled} onChange={v => updateTheme('glowEnabled', v)} />

      {config.theme.glowEnabled && (
        <>
          <div className="z-10 relative">
            <AdvancedColorPicker label="Glow color" value={config.theme.glowColor} onChange={v => updateTheme('glowColor', v)} />
          </div>
          <div>
            <FieldLabel>Intensity — {config.theme.glowIntensity}%</FieldLabel>
            <SliderInput value={config.theme.glowIntensity} onChange={v => updateTheme('glowIntensity', v)} label="%" />
          </div>
        </>
      )}
    </div>
  );

  const renderEffects = () => (
    <div className="space-y-4">
      <SectionTitle>Background Effect</SectionTitle>
      
      <div>
        <FieldLabel>Effect type</FieldLabel>
        <OptionGrid
          value={config.effects.bgEffect}
          onChange={v => updateEffects('bgEffect', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'particles', label: 'Particles' },
            { value: 'matrix', label: 'Matrix' },
            { value: 'stars', label: 'Stars' },
            { value: 'rain', label: 'Rain' },
            { value: 'snow', label: 'Snow' },
            { value: 'fireflies', label: 'Fireflies' },
          ]}
        />
      </div>

      {config.effects.bgEffect !== 'none' && (
        <>
          <div>
            <FieldLabel>Intensity — {config.effects.bgEffectIntensity}%</FieldLabel>
            <SliderInput value={config.effects.bgEffectIntensity} onChange={v => updateEffects('bgEffectIntensity', v)} label="%" />
          </div>
          <div className="z-10 relative">
            <AdvancedColorPicker label="Effect color" value={config.effects.bgEffectColor} onChange={v => updateEffects('bgEffectColor', v)} />
          </div>
        </>
      )}

      <SectionTitle>Foreground Overlay</SectionTitle>
      
      <div>
        <FieldLabel>Overlay type</FieldLabel>
        <OptionGrid
          value={config.effects.overlayEffect || 'none'}
          onChange={v => updateEffects('overlayEffect', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'vhs', label: 'VHS' },
            { value: 'scanlines', label: 'Scanline' },
            { value: 'noise', label: 'Noise' },
            { value: 'cyberpunk-glitch', label: 'Cyber' },
          ]}
          cols={3}
        />
      </div>

      <SectionTitle>Cursor Trail</SectionTitle>
      
      <div>
        <FieldLabel>Trail type</FieldLabel>
        <OptionGrid
          value={config.effects.cursorTrail}
          onChange={v => updateEffects('cursorTrail', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'glow', label: 'Glow' },
            { value: 'sparkle', label: 'Sparkle' },
            { value: 'trail', label: 'Trail' },
            { value: 'fire', label: 'Fire' },
          ]}
        />
      </div>

        <div className="z-10 relative mt-4">
          <AdvancedColorPicker label="Trail color" value={config.effects.cursorTrailColor} onChange={v => updateEffects('cursorTrailColor', v)} />
        </div>

      <SectionTitle>Avatar Effect</SectionTitle>
      
      <div>
        <FieldLabel>Effect type</FieldLabel>
        <OptionGrid
          value={config.effects.avatarEffect}
          onChange={v => updateEffects('avatarEffect', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'glow-pulse', label: 'Glow Pulse' },
            { value: 'rotate-border', label: 'Rotate' },
            { value: 'glitch', label: 'Glitch' },
            { value: 'breathe', label: 'Breathe' },
            { value: 'float', label: 'Float' },
            { value: 'spin-slow', label: 'Spin Slow' },
            { value: 'pulse-ring', label: 'Pulse Ring' },
            { value: 'shadow-dance', label: 'Shadow' },
          ]}
          cols={3}
        />
      </div>

      <SectionTitle>Text Effect</SectionTitle>
      
      <div>
        <FieldLabel>Effect type</FieldLabel>
        <OptionGrid
          value={config.effects.textEffect}
          onChange={v => updateEffects('textEffect', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'glitch', label: 'Glitch' },
            { value: 'typewriter', label: 'Typewriter' },
            { value: 'neon-flicker', label: 'Neon' },
          ]}
        />
      </div>

      <SectionTitle>Entrance Animation</SectionTitle>
      
      <div>
        <FieldLabel>Entrance style</FieldLabel>
        <OptionGrid
          value={config.effects.entranceAnimation}
          onChange={v => updateEffects('entranceAnimation', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'fade-up', label: 'Fade Up' },
            { value: 'scale', label: 'Scale' },
            { value: 'slide-left', label: 'Slide L' },
            { value: 'slide-right', label: 'Slide R' },
            { value: 'slide-down', label: 'Slide Dn' },
            { value: 'spin-in', label: 'Spin' },
            { value: 'flip-x', label: 'Flip X' },
            { value: 'bounce-in', label: 'Bounce' },
            { value: 'glitch-in', label: 'Glitch' },
            { value: 'zoom-rotate', label: 'Zoom Rot' },
            { value: 'elastic', label: 'Elastic' },
            { value: 'blur-in', label: 'Blur In' },
            { value: 'drop-in', label: 'Drop In' },
          ]}
          cols={3}
        />
      </div>

      <SectionTitle>Link Hover Effect</SectionTitle>
      
      <div>
        <FieldLabel>Hover Animation</FieldLabel>
        <OptionGrid
          value={config.effects.hoverEffect || 'none'}
          onChange={v => updateEffects('hoverEffect', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'lift', label: 'Lift' },
            { value: 'glow', label: 'Glow' },
            { value: 'scale', label: 'Scale' },
            { value: 'neon', label: 'Neon' },
            { value: 'shake', label: 'Shake' },
            { value: 'underline-slide', label: 'Underline' },
            { value: 'border-glow', label: 'Brd Glow' },
            { value: 'tilt-3d', label: 'Tilt 3D' },
          ]}
          cols={3}
        />
      </div>

      <SectionTitle>Click Effect</SectionTitle>
      
      <div>
        <FieldLabel>Click effect</FieldLabel>
        <OptionGrid
          value={config.effects.clickEffect}
          onChange={v => updateEffects('clickEffect', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'ripple', label: 'Ripple' },
            { value: 'confetti', label: 'Confetti' },
            { value: 'sparkle', label: 'Sparkle' },
          ]}
        />
      </div>
      <SectionTitle>Username Sparkles</SectionTitle>

      <div>
        <FieldLabel>Sparkle type</FieldLabel>
        <OptionGrid
          value={config.usernameSparkles || 'none'}
          onChange={v => update('usernameSparkles', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'rainbow', label: '🌈 Rainbow' },
            { value: 'gold', label: '✨ Gold' },
            { value: 'silver', label: '🤍 Silver' },
            { value: 'fire', label: '🔥 Fire' },
            { value: 'ice', label: '❄️ Ice' },
          ]}
          cols={3}
        />
      </div>

      <SectionTitle>Avatar Decoration</SectionTitle>

      <div>
        <FieldLabel>Decoration</FieldLabel>
        <OptionGrid
          value={config.avatarDecoration || 'none'}
          onChange={v => update('avatarDecoration', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'cat-ears', label: '🐱 Cat Ears' },
            { value: 'crown', label: '👑 Crown' },
            { value: 'horns', label: '😈 Horns' },
            { value: 'halo', label: '😇 Halo' },
            { value: 'fire-ring', label: '🔥 Fire' },
          ]}
          cols={3}
        />
      </div>

      <SectionTitle>Animation Speed</SectionTitle>

      <div>
        <FieldLabel>Entrance Speed — {config.entranceSpeed ?? 200}ms</FieldLabel>
        <SliderInput value={config.entranceSpeed ?? 200} onChange={v => update('entranceSpeed', v)} min={50} max={500} label="ms" />
      </div>

      <SectionTitle>Click Sound</SectionTitle>

      <div>
        <FieldLabel>Sound on click</FieldLabel>
        <OptionGrid
          value={config.clickSound || 'none'}
          onChange={v => update('clickSound', v as any)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'click', label: 'Click' },
            { value: 'pop', label: 'Pop' },
            { value: 'blip', label: 'Blip' },
          ]}
        />
      </div>

      <SectionTitle>Reveal Screen</SectionTitle>

      <ToggleRow label="Show reveal screen" value={config.revealScreen?.enabled ?? false} onChange={v => update('revealScreen', { ...(config.revealScreen || { enabled: false, text: 'Click to enter', blur: 15 }), enabled: v })} />

      {config.revealScreen?.enabled && (
        <>
          <div>
            <FieldLabel>Reveal text</FieldLabel>
            <TextInput value={config.revealScreen.text} onChange={v => update('revealScreen', { ...config.revealScreen, text: v })} placeholder="Click to enter..." />
          </div>
          <div>
            <FieldLabel>Blur — {config.revealScreen.blur}px</FieldLabel>
            <SliderInput value={config.revealScreen.blur} onChange={v => update('revealScreen', { ...config.revealScreen, blur: v })} min={0} max={50} label="px" />
          </div>
        </>
      )}

      <SectionTitle>Cursor</SectionTitle>
      
      <div>
        <FieldLabel>Cursor style</FieldLabel>
        <OptionGrid
          value={config.effects.customCursor}
          onChange={v => updateEffects('customCursor', v as any)}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'crosshair', label: 'Crosshair' },
            { value: 'pointer', label: 'Pointer' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
      </div>

      <SectionTitle>Audio</SectionTitle>
      <ToggleRow label="Audio visualizer" value={config.effects.audioVisualizer} onChange={v => updateEffects('audioVisualizer', v)} />
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-4">
      <SectionTitle>Social Networks</SectionTitle>

      {config.socials.map((social, i) => (
        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <GripVertical size={12} className="text-[var(--text-muted)] shrink-0 cursor-grab" />
          <SelectInput
            value={social.platform}
            onChange={v => {
              const newSocials = [...config.socials];
              newSocials[i] = { ...social, platform: v, label: v.charAt(0).toUpperCase() + v.slice(1) };
              update('socials', newSocials);
            }}
            options={socialPlatforms.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))}
          />
          <TextInput
            value={social.url}
            onChange={v => {
              const newSocials = [...config.socials];
              newSocials[i] = { ...social, url: v };
              update('socials', newSocials);
            }}
            placeholder="URL ou username"
          />
          <button
            onClick={() => update('socials', config.socials.filter((_, j) => j !== i))}
            className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <button
        onClick={() => update('socials', [...config.socials, { platform: 'discord', url: '', label: 'Discord' }])}
        className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-white/20 transition-all"
      >
        <Plus size={12} /> Add a social link
      </button>

      <SectionTitle>Custom Links</SectionTitle>

      {config.customLinks.map((link, i) => (
        <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2">
            <GripVertical size={12} className="text-[var(--text-muted)] shrink-0 cursor-grab" />
            <TextInput
              value={link.title}
              onChange={v => {
                const newLinks = [...config.customLinks];
                newLinks[i] = { ...link, title: v };
                update('customLinks', newLinks);
              }}
              placeholder="Title du lien"
            />
            <ToggleSwitch
              value={link.enabled}
              onChange={v => {
                const newLinks = [...config.customLinks];
                newLinks[i] = { ...link, enabled: v };
                update('customLinks', newLinks);
              }}
            />
            <button
              onClick={() => update('customLinks', config.customLinks.filter((_, j) => j !== i))}
              className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <TextInput
            value={link.url}
            onChange={v => {
              const newLinks = [...config.customLinks];
              newLinks[i] = { ...link, url: v };
              update('customLinks', newLinks);
            }}
            placeholder="https://..."
          />
        </div>
      ))}

      <button
        onClick={() => update('customLinks', [...config.customLinks, { title: '', url: '', icon: 'link', enabled: true }])}
        className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-white/20 transition-all"
      >
        <Plus size={12} /> Add link
      </button>
    </div>
  );

  const renderMusic = () => (
    <div className="space-y-4">
      <SectionTitle>Music Player</SectionTitle>

      <ToggleRow label="Enable music" value={config.music.enabled} onChange={v => updateMusic('enabled', v)} />

      {config.music.enabled && (
        <>
          <div>
            <FieldLabel>Source</FieldLabel>
            <OptionGrid
              value={config.music.type}
              onChange={v => updateMusic('type', v as any)}
              options={[
                { value: 'spotify', label: 'Spotify' },
                { value: 'soundcloud', label: 'SoundCloud' },
                { value: 'custom', label: 'URL Custom' },
              ]}
              cols={3}
            />
          </div>

          <div>
            <FieldLabel>
              {config.music.type === 'spotify' ? 'Spotify Embed URL' :
               config.music.type === 'soundcloud' ? 'SoundCloud URL' :
               'URL Audio (mp3, wav...)'}
            </FieldLabel>
            <TextInput
              value={config.music.url}
              onChange={v => updateMusic('url', v)}
              placeholder={
                config.music.type === 'spotify' ? 'https://open.spotify.com/track/...' :
                config.music.type === 'soundcloud' ? 'https://soundcloud.com/...' :
                'https://example.com/song.mp3'
              }
            />
            {config.music.type === 'spotify' && config.music.url && (
              <div className="mt-2 text-[10px] text-[var(--text-muted)] flex items-center justify-between px-1">
                <span>Auto-magical embed ✨</span>
                <a 
                  href={config.music.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline transition-colors flex items-center gap-1"
                >
                  Tester le lien <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>

          <ToggleRow label="Autoplay" value={config.music.autoplay} onChange={v => updateMusic('autoplay', v)} />
        </>
      )}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-4">
      <SectionTitle>Display</SectionTitle>

      <ToggleRow label="Show views" value={config.stats.showViews} onChange={v => updateStats('showViews', v)} />
      <ToggleRow label="Show join date" value={config.stats.showJoinDate} onChange={v => updateStats('showJoinDate', v)} />

      <SectionTitle>Custom Stats</SectionTitle>

      {config.stats.customStats.map((stat, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={stat.label}
            onChange={v => {
              const newStats = [...config.stats.customStats];
              newStats[i] = { ...stat, label: v };
              updateStats('customStats', newStats);
            }}
            placeholder="Label"
          />
          <TextInput
            value={stat.value}
            onChange={v => {
              const newStats = [...config.stats.customStats];
              newStats[i] = { ...stat, value: v };
              updateStats('customStats', newStats);
            }}
            placeholder="Value"
          />
          <button
            onClick={() => updateStats('customStats', config.stats.customStats.filter((_, j) => j !== i))}
            className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <button
        onClick={() => updateStats('customStats', [...config.stats.customStats, { label: '', value: '' }])}
        className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-white/20 transition-all"
      >
        <Plus size={12} /> Add stat
      </button>
    </div>
  );

  const renderWidgets = () => (
    <div className="space-y-4">
      <SectionTitle>Timeline / Achievements</SectionTitle>

      <ToggleRow label="Enable timeline" value={config.timeline?.enabled ?? false} onChange={v => updateTimeline('enabled', v)} />

      {config.timeline?.enabled && (
        <>
          {(config.timeline.items || []).map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2">
                <TextInput
                  value={item.date}
                  onChange={v => {
                    const newItems = [...(config.timeline.items || [])];
                    newItems[i] = { ...item, date: v };
                    updateTimeline('items', newItems);
                  }}
                  placeholder="Date (ex: Mars 2026)"
                />
                <button
                  onClick={() => updateTimeline('items', (config.timeline.items || []).filter((_, j) => j !== i))}
                  className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <TextInput
                value={item.title}
                onChange={v => {
                  const newItems = [...(config.timeline.items || [])];
                  newItems[i] = { ...item, title: v };
                  updateTimeline('items', newItems);
                }}
                placeholder="Title"
              />
              <TextInput
                value={item.description}
                onChange={v => {
                  const newItems = [...(config.timeline.items || [])];
                  newItems[i] = { ...item, description: v };
                  updateTimeline('items', newItems);
                }}
                placeholder="Description"
              />
            </div>
          ))}
          <button
            onClick={() => updateTimeline('items', [...(config.timeline.items || []), { date: '', title: '', description: '' }])}
            className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-white/20 transition-all"
          >
            <Plus size={12} /> Add event
          </button>
        </>
      )}

      <SectionTitle>Galerie d&apos;images</SectionTitle>

      <ToggleRow label="Enable gallery" value={config.imageGallery?.enabled ?? false} onChange={v => updateGallery('enabled', v)} />

      {config.imageGallery?.enabled && (
        <>
          {(config.imageGallery.images || []).map((img, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Image {i + 1}</span>
                <button
                  onClick={() => updateGallery('images', (config.imageGallery.images || []).filter((_, j) => j !== i))}
                  className="shrink-0 h-6 w-6 flex items-center justify-center rounded-md text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <MediaUploader
                value={img.url}
                onChange={v => {
                  const newImages = [...(config.imageGallery.images || [])];
                  newImages[i] = { ...img, url: v };
                  updateGallery('images', newImages);
                }}
                type="image"
              />
              <TextInput
                value={img.caption}
                onChange={v => {
                  const newImages = [...(config.imageGallery.images || [])];
                  newImages[i] = { ...img, caption: v };
                  updateGallery('images', newImages);
                }}
                placeholder="Caption"
              />
            </div>
          ))}
          <button
            onClick={() => updateGallery('images', [...(config.imageGallery.images || []), { url: '', caption: '' }])}
            className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-white/20 transition-all"
          >
            <Plus size={12} /> Add image
          </button>
        </>
      )}

      <SectionTitle>Embed Video</SectionTitle>

      <ToggleRow label="Embed a video" value={config.embedVideo?.enabled ?? false} onChange={v => updateVideo('enabled', v)} />

      {config.embedVideo?.enabled && (
        <div>
          <FieldLabel>Local Video or YouTube/other URL</FieldLabel>
          <MediaUploader value={config.embedVideo.url} onChange={v => updateVideo('url', v)} type="video" />
        </div>
      )}

      <SectionTitle>Discord Widget</SectionTitle>

      <ToggleRow label="Widget Discord" value={config.discordWidget?.enabled ?? false} onChange={v => updateDiscord('enabled', v)} />

      {config.discordWidget?.enabled && (
        <div>
          <FieldLabel>Discord User ID</FieldLabel>
          <TextInput value={config.discordWidget.userId} onChange={v => updateDiscord('userId', v)} placeholder="123456789012345678" />
        </div>
      )}
    </div>
  );

  const renderSeo = () => (
    <div className="space-y-4">
      <SectionTitle>Meta Tags</SectionTitle>
      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
        Customize how your page appears on Google, Discord, Twitter, and other platforms.
      </p>

      <div>
        <FieldLabel>Title personnalisé</FieldLabel>
        <TextInput value={config.seo?.title ?? ''} onChange={v => updateSeo('title', v)} placeholder="My profile — Sagitarius.cc" />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <TextArea value={config.seo?.description ?? ''} onChange={v => updateSeo('description', v)} placeholder="My custom bio page..." rows={3} />
      </div>

      <div>
        <FieldLabel>OG Image URL</FieldLabel>
        <TextInput value={config.seo?.ogImage ?? ''} onChange={v => updateSeo('ogImage', v)} placeholder="https://... (image d'aperçu)" />
      </div>
    </div>
  );

  const renderAdvanced = () => {
    const handleApplyCss = () => {
      try {
        // Basic syntax check: matching braces
        if ((cssInput.match(/\{/g) || []).length !== (cssInput.match(/\}/g) || []).length) {
          throw new Error('Unbalanced braces {} detected.');
        }
        
        // Auto-scope to .bio-page if the user wrote raw rules 
        // This regex wraps any rule blocks that don't start with .bio-page, but it's basic.
        // We'll trust the user but advise them to use .bio-page
        let processedCss = cssInput;
        
        update('customCss', processedCss);
        setCssStatus('success');
        setCssMessage('CSS applied successfully! ✨');
        setTimeout(() => {
          setCssStatus('idle');
          setCssMessage('');
        }, 3000);
      } catch (err: any) {
        setCssStatus('error');
        setCssMessage(err.message || 'Syntax error in CSS');
      }
    };

    return (
      <div className="space-y-4">
        <SectionTitle>CSS Custom</SectionTitle>
        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Add custom CSS to customize your page even more. All your CSS will be injected dynamically.
          <br/>
          <span className="text-purple-400">Important:</span> Prefix your selectors with <code className="text-white bg-white/10 px-1 py-0.5 rounded">.bio-page</code> to avoid global conflicts.
        </p>
        
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] mb-4">
          <p className="text-[9px] text-white/50 font-mono mb-2">Example:</p>
          <pre className="text-[10px] text-purple-300/70 font-mono leading-relaxed">
{`.bio-page .username { 
  color: #ff00ff; 
  text-shadow: 0 0 10px #ff00ff;
}
.bio-page { animation: fadeIn 1s ease; }`}
          </pre>
        </div>

        <TextArea
          value={cssInput}
          onChange={setCssInput}
          placeholder={`.bio-page {\n  /* Your CSS here */\n}`}
          rows={12}
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex-1">
            {cssStatus === 'success' && (
              <p className="text-[10px] text-green-400 font-medium animate-pulse">{cssMessage}</p>
            )}
            {cssStatus === 'error' && (
              <p className="text-[10px] text-red-400 font-medium">{cssMessage}</p>
            )}
          </div>
          <button
            onClick={handleApplyCss}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              cssStatus === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              cssStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              'bg-purple-600 text-white hover:bg-purple-500'
            }`}
          >
            Apply CSS
          </button>
        </div>
      </div>
    );
  };

  const tabContent: Record<TabId, () => React.ReactNode> = {
    profile: renderProfile,
    layout: renderLayout,
    theme: renderTheme,
    effects: renderEffects,
    links: renderLinks,
    music: renderMusic,
    stats: renderStats,
    widgets: renderWidgets,
    seo: renderSeo,
    advanced: renderAdvanced,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="px-5 pt-5 pb-2 border-b border-white/[0.04]">
        <h2 className="text-sm font-bold text-white tracking-tight">Bio Builder</h2>
        <p className="text-[9px] text-[var(--text-muted)] mt-0.5 uppercase tracking-widest">Customize everything</p>
      </div>

      {/* Tab Navigation — Compact Icon Bar */}
      <div className="flex items-center justify-center gap-0.5 px-3 py-2.5 border-b border-white/[0.04] bg-white/[0.01]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icon size={15} strokeWidth={isActive ? 2.5 : 1.5} />
              {/* Tooltip */}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-white/10 text-[8px] font-bold uppercase tracking-wider text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
        {tabContent[activeTab]()}
      </div>
    </div>
  );
}
