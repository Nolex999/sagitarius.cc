'use client';

import { useState } from 'react';
import {
  User, Palette, Sparkles, Link2, Music, BarChart3, Code2,
  Plus, Trash2, GripVertical,
} from 'lucide-react';
import type { BioConfig } from '@/types/bio';

type TabId = 'profile' | 'theme' | 'effects' | 'links' | 'music' | 'stats' | 'advanced';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'theme', label: 'Thème', icon: Palette },
  { id: 'effects', label: 'Effets', icon: Sparkles },
  { id: 'links', label: 'Liens', icon: Link2 },
  { id: 'music', label: 'Musique', icon: Music },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'advanced', label: 'CSS', icon: Code2 },
];

const fontOptions = [
  'Inter', 'Outfit', 'Space Grotesk', 'JetBrains Mono', 'Fira Code',
  'Poppins', 'Rajdhani', 'Orbitron', 'Audiowide', 'Syncopate',
  'Press Start 2P', 'Silkscreen', 'IBM Plex Mono',
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
];

const presetColors = [
  '#a855f7', '#6366f1', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#f43f5e', '#14b8a6', '#ffffff', '#64748b',
];

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

function ColorPicker({ value, onChange, presets = presetColors }: { value: string; onChange: (v: string) => void; presets?: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 h-8 px-2 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-[var(--text-secondary)] focus:outline-none focus:border-white/15 transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {presets.map(color => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-5 h-5 rounded-md border transition-all hover:scale-110 ${
              value === color ? 'border-white/50 scale-110 shadow-lg' : 'border-white/10'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

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

function OptionGrid({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string; icon?: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
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

// ====== MAIN COMPONENT ======

export default function BioEditor({ config, onChange }: EditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

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


  // ====== TAB CONTENT ======

  const renderProfile = () => (
    <div className="space-y-4">
      <SectionTitle>Identité</SectionTitle>
      
      <div>
        <FieldLabel>Nom d&apos;affichage</FieldLabel>
        <TextInput value={config.displayName} onChange={v => update('displayName', v)} placeholder="Ton nom" />
      </div>
      
      <div>
        <FieldLabel>Username</FieldLabel>
        <TextInput value={config.username} onChange={v => update('username', v)} placeholder="@username" />
      </div>

      <div>
        <FieldLabel>Pronoms</FieldLabel>
        <TextInput value={config.pronouns} onChange={v => update('pronouns', v)} placeholder="he/him, she/her..." />
      </div>

      <div>
        <FieldLabel>Bio</FieldLabel>
        <TextArea value={config.bio} onChange={v => update('bio', v)} placeholder="Décris-toi en quelques mots..." />
      </div>

      <div>
        <FieldLabel>Avatar URL</FieldLabel>
        <TextInput value={config.avatarUrl} onChange={v => update('avatarUrl', v)} placeholder="https://..." />
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
        <FieldLabel>Badge custom</FieldLabel>
        <div className="flex gap-2">
          <TextInput value="" onChange={() => {}} placeholder="Nom du badge" />
          <button
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('#custom-badge-input');
              if (input?.value) {
                update('badges', [...config.badges, input.value]);
                input.value = '';
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

  const renderTheme = () => (
    <div className="space-y-4">
      <SectionTitle>Couleurs</SectionTitle>
      
      <div>
        <FieldLabel>Couleur principale</FieldLabel>
        <ColorPicker value={config.theme.primaryColor} onChange={v => updateTheme('primaryColor', v)} />
      </div>

      <div>
        <FieldLabel>Couleur secondaire</FieldLabel>
        <ColorPicker value={config.theme.secondaryColor} onChange={v => updateTheme('secondaryColor', v)} />
      </div>

      <div>
        <FieldLabel>Couleur accent</FieldLabel>
        <ColorPicker value={config.theme.accentColor} onChange={v => updateTheme('accentColor', v)} />
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
          ]}
        />
      </div>

      <div>
        <FieldLabel>Couleur BG 1</FieldLabel>
        <ColorPicker value={config.theme.bgColor1} onChange={v => updateTheme('bgColor1', v)} presets={['#0a0a0a', '#0d1117', '#1a0a2e', '#0a1628', '#0e0e0e', '#120015', '#001a1a', '#1a0000']} />
      </div>

      {config.theme.bgType === 'gradient' && (
        <div>
          <FieldLabel>Couleur BG 2</FieldLabel>
          <ColorPicker value={config.theme.bgColor2} onChange={v => updateTheme('bgColor2', v)} presets={['#1a0a2e', '#0d2847', '#2e0a1a', '#0a2e1a', '#2e2e0a', '#001a33', '#330a1a', '#0a330a']} />
        </div>
      )}

      {config.theme.bgType === 'image' && (
        <div>
          <FieldLabel>URL de l&apos;image</FieldLabel>
          <TextInput value={config.theme.bgImageUrl} onChange={v => updateTheme('bgImageUrl', v)} placeholder="https://..." />
        </div>
      )}

      <SectionTitle>Style</SectionTitle>

      <div>
        <FieldLabel>Police</FieldLabel>
        <SelectInput
          value={config.theme.fontFamily}
          onChange={v => updateTheme('fontFamily', v)}
          options={fontOptions.map(f => ({ value: f, label: f }))}
        />
      </div>

      <div>
        <FieldLabel>Style des cartes</FieldLabel>
        <OptionGrid
          value={config.theme.cardStyle}
          onChange={v => updateTheme('cardStyle', v as any)}
          options={[
            { value: 'glass', label: 'Glass' },
            { value: 'solid', label: 'Solid' },
            { value: 'outline', label: 'Outline' },
            { value: 'neon', label: 'Néon' },
          ]}
        />
      </div>

      <div>
        <FieldLabel>Border Radius — {config.theme.borderRadius}px</FieldLabel>
        <SliderInput value={config.theme.borderRadius} onChange={v => updateTheme('borderRadius', v)} min={0} max={32} label="px" />
      </div>

      <SectionTitle>Glow</SectionTitle>
      
      <div className="flex items-center justify-between">
        <FieldLabel>Activer le glow</FieldLabel>
        <ToggleSwitch value={config.theme.glowEnabled} onChange={v => updateTheme('glowEnabled', v)} />
      </div>

      {config.theme.glowEnabled && (
        <>
          <div>
            <FieldLabel>Couleur du glow</FieldLabel>
            <ColorPicker value={config.theme.glowColor} onChange={v => updateTheme('glowColor', v)} />
          </div>
          <div>
            <FieldLabel>Intensité — {config.theme.glowIntensity}%</FieldLabel>
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
            { value: 'none', label: 'Aucun' },
            { value: 'particles', label: 'Particles' },
            { value: 'matrix', label: 'Matrix' },
            { value: 'stars', label: 'Étoiles' },
            { value: 'rain', label: 'Pluie' },
            { value: 'snow', label: 'Neige' },
            { value: 'fireflies', label: 'Lucioles' },
          ]}
        />
      </div>

      {config.effects.bgEffect !== 'none' && (
        <>
          <div>
            <FieldLabel>Intensité — {config.effects.bgEffectIntensity}%</FieldLabel>
            <SliderInput value={config.effects.bgEffectIntensity} onChange={v => updateEffects('bgEffectIntensity', v)} label="%" />
          </div>
          <div>
            <FieldLabel>Couleur de l&apos;effet</FieldLabel>
            <ColorPicker value={config.effects.bgEffectColor} onChange={v => updateEffects('bgEffectColor', v)} />
          </div>
        </>
      )}

      <SectionTitle>Cursor Trail</SectionTitle>
      
      <div>
        <FieldLabel>Type de trail</FieldLabel>
        <OptionGrid
          value={config.effects.cursorTrail}
          onChange={v => updateEffects('cursorTrail', v as any)}
          options={[
            { value: 'none', label: 'Aucun' },
            { value: 'glow', label: 'Glow' },
            { value: 'sparkle', label: 'Sparkle' },
            { value: 'trail', label: 'Trail' },
            { value: 'fire', label: 'Fire' },
          ]}
        />
      </div>

      {config.effects.cursorTrail !== 'none' && (
        <div>
          <FieldLabel>Couleur du trail</FieldLabel>
          <ColorPicker value={config.effects.cursorTrailColor} onChange={v => updateEffects('cursorTrailColor', v)} />
        </div>
      )}

      <SectionTitle>Avatar Effect</SectionTitle>
      
      <div>
        <FieldLabel>Type d&apos;effet</FieldLabel>
        <OptionGrid
          value={config.effects.avatarEffect}
          onChange={v => updateEffects('avatarEffect', v as any)}
          options={[
            { value: 'none', label: 'Aucun' },
            { value: 'glow-pulse', label: 'Glow Pulse' },
            { value: 'rotate-border', label: 'Rotate' },
            { value: 'glitch', label: 'Glitch' },
            { value: 'breathe', label: 'Breathe' },
          ]}
        />
      </div>

      <SectionTitle>Text Effect</SectionTitle>
      
      <div>
        <FieldLabel>Type d&apos;effet</FieldLabel>
        <OptionGrid
          value={config.effects.textEffect}
          onChange={v => updateEffects('textEffect', v as any)}
          options={[
            { value: 'none', label: 'Aucun' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'glitch', label: 'Glitch' },
            { value: 'typewriter', label: 'Typewriter' },
            { value: 'neon-flicker', label: 'Néon' },
          ]}
        />
      </div>

      <SectionTitle>Entrance Animation</SectionTitle>
      
      <div>
        <FieldLabel>Animation d&apos;entrée</FieldLabel>
        <OptionGrid
          value={config.effects.entranceAnimation}
          onChange={v => updateEffects('entranceAnimation', v as any)}
          options={[
            { value: 'none', label: 'Aucun' },
            { value: 'fade-up', label: 'Fade Up' },
            { value: 'scale', label: 'Scale' },
            { value: 'slide-left', label: 'Slide' },
            { value: 'glitch-in', label: 'Glitch' },
          ]}
        />
      </div>
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-4">
      <SectionTitle>Réseaux Sociaux</SectionTitle>

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
        <Plus size={12} /> Ajouter un réseau
      </button>

      <SectionTitle>Liens Custom</SectionTitle>

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
              placeholder="Titre du lien"
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
        <Plus size={12} /> Ajouter un lien
      </button>
    </div>
  );

  const renderMusic = () => (
    <div className="space-y-4">
      <SectionTitle>Lecteur de musique</SectionTitle>

      <div className="flex items-center justify-between">
        <FieldLabel>Activer la musique</FieldLabel>
        <ToggleSwitch value={config.music.enabled} onChange={v => updateMusic('enabled', v)} />
      </div>

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
          </div>

          <div className="flex items-center justify-between">
            <FieldLabel>Autoplay</FieldLabel>
            <ToggleSwitch value={config.music.autoplay} onChange={v => updateMusic('autoplay', v)} />
          </div>
        </>
      )}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-4">
      <SectionTitle>Affichage</SectionTitle>

      <div className="flex items-center justify-between">
        <FieldLabel>Afficher les vues</FieldLabel>
        <ToggleSwitch value={config.stats.showViews} onChange={v => updateStats('showViews', v)} />
      </div>

      <div className="flex items-center justify-between">
        <FieldLabel>Afficher la date d&apos;inscription</FieldLabel>
        <ToggleSwitch value={config.stats.showJoinDate} onChange={v => updateStats('showJoinDate', v)} />
      </div>

      <SectionTitle>Stats Custom</SectionTitle>

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
            placeholder="Valeur"
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
        <Plus size={12} /> Ajouter une stat
      </button>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-4">
      <SectionTitle>CSS Custom</SectionTitle>
      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
        Ajoute du CSS custom pour personnaliser ta page encore plus. Utilise <code className="text-purple-400/80">.bio-page</code> comme sélecteur racine.
      </p>
      <TextArea
        value={config.customCss}
        onChange={v => update('customCss', v)}
        placeholder={`.bio-page {\n  /* Ton CSS ici */\n}`}
        rows={12}
      />
    </div>
  );

  const tabContent: Record<TabId, () => React.ReactNode> = {
    profile: renderProfile,
    theme: renderTheme,
    effects: renderEffects,
    links: renderLinks,
    music: renderMusic,
    stats: renderStats,
    advanced: renderAdvanced,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-xs font-bold text-white tracking-tight">Bio Builder</h2>
        <p className="text-[9px] text-[var(--text-muted)] mt-0.5 uppercase tracking-widest">Customise ta page</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0.5 px-4 pb-3 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-400/20'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/[0.02]'
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {tabContent[activeTab]()}
      </div>
    </div>
  );
}
