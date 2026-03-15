import { Check } from 'lucide-react';
import type { BioConfig } from '@/types/bio';

export interface ThemePalette {
  name: string;
  category: string;
  colors: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    bgColor1: string;
    bgColor2: string;
  };
}

export const PRESET_PALETTES: ThemePalette[] = [
  // Dark & Cyberpunk
  { name: 'Neon Genesis', category: 'Cyberpunk', colors: { primaryColor: '#00ff9d', secondaryColor: '#ff00ff', accentColor: '#00b8ff', bgColor1: '#0a0a0a', bgColor2: '#1a0b2e' } },
  { name: 'Night City', category: 'Cyberpunk', colors: { primaryColor: '#f3e600', secondaryColor: '#ff003c', accentColor: '#00f0ff', bgColor1: '#090a0f', bgColor2: '#20050f' } },
  { name: 'Matrix', category: 'Cyberpunk', colors: { primaryColor: '#00ff41', secondaryColor: '#008f11', accentColor: '#ffffff', bgColor1: '#000000', bgColor2: '#001a00' } },
  { name: 'Dracula', category: 'Dark', colors: { primaryColor: '#ff79c6', secondaryColor: '#bd93f9', accentColor: '#50fa7b', bgColor1: '#282a36', bgColor2: '#44475a' } },
  { name: 'Vampire', category: 'Dark', colors: { primaryColor: '#ff0000', secondaryColor: '#8a0303', accentColor: '#ffb3b3', bgColor1: '#0a0000', bgColor2: '#1f0000' } },
  { name: 'Abyss', category: 'Dark', colors: { primaryColor: '#0066ff', secondaryColor: '#003399', accentColor: '#66b3ff', bgColor1: '#000511', bgColor2: '#001133' } },
  // Pastel & Soft
  { name: 'Cotton Candy', category: 'Pastel', colors: { primaryColor: '#ffb3ba', secondaryColor: '#ffdfba', accentColor: '#ffffba', bgColor1: '#fafafa', bgColor2: '#ffe6f0' } },
  { name: 'Mint Breeze', category: 'Pastel', colors: { primaryColor: '#baffc9', secondaryColor: '#bae1ff', accentColor: '#ffffff', bgColor1: '#f0fff5', bgColor2: '#e6f7ff' } },
  { name: 'Lavender', category: 'Pastel', colors: { primaryColor: '#dcd0ff', secondaryColor: '#c8b6ff', accentColor: '#e7c6ff', bgColor1: '#f8f4ff', bgColor2: '#f0e6ff' } },
  { name: 'Peachy', category: 'Pastel', colors: { primaryColor: '#ffdab9', secondaryColor: '#ffb6c1', accentColor: '#ffe4e1', bgColor1: '#fff5ec', bgColor2: '#fff0f5' } },
  // Vibrant & Pop
  { name: 'Vaporwave', category: 'Pop', colors: { primaryColor: '#ff71ce', secondaryColor: '#01cdfe', accentColor: '#05ffa1', bgColor1: '#2b213a', bgColor2: '#110c1f' } },
  { name: 'Sunset', category: 'Pop', colors: { primaryColor: '#ff7b54', secondaryColor: '#ffd56b', accentColor: '#939b62', bgColor1: '#2d1b19', bgColor2: '#4a2c2a' } },
  { name: 'Synthwave', category: 'Pop', colors: { primaryColor: '#f9ac53', secondaryColor: '#d73a31', accentColor: '#03c4a1', bgColor1: '#1c0c28', bgColor2: '#2a1b38' } },
  { name: 'Bubblegum', category: 'Pop', colors: { primaryColor: '#ff1493', secondaryColor: '#00ced1', accentColor: '#ffb6c1', bgColor1: '#1a0011', bgColor2: '#2a001c' } },
  // Ocean & Nature
  { name: 'Deep Sea', category: 'Nature', colors: { primaryColor: '#00ffd5', secondaryColor: '#00b8ff', accentColor: '#ffffff', bgColor1: '#001220', bgColor2: '#002845' } },
  { name: 'Forest', category: 'Nature', colors: { primaryColor: '#4ade80', secondaryColor: '#22c55e', accentColor: '#bbf7d0', bgColor1: '#052e16', bgColor2: '#14532d' } },
  { name: 'Aurora', category: 'Nature', colors: { primaryColor: '#34d399', secondaryColor: '#3b82f6', accentColor: '#a78bfa', bgColor1: '#0f172a', bgColor2: '#1e293b' } },
  { name: 'Volcano', category: 'Nature', colors: { primaryColor: '#ef4444', secondaryColor: '#f97316', accentColor: '#fca5a5', bgColor1: '#2c0b0e', bgColor2: '#4a151b' } },
  // Elegant & Minimal
  { name: 'Monochrome', category: 'Minimal', colors: { primaryColor: '#ffffff', secondaryColor: '#a3a3a3', accentColor: '#525252', bgColor1: '#000000', bgColor2: '#171717' } },
  { name: 'Ivory', category: 'Minimal', colors: { primaryColor: '#171717', secondaryColor: '#404040', accentColor: '#737373', bgColor1: '#fffff0', bgColor2: '#f5f5dc' } },
  { name: 'Slate', category: 'Minimal', colors: { primaryColor: '#94a3b8', secondaryColor: '#64748b', accentColor: '#cbd5e1', bgColor1: '#0f172a', bgColor2: '#1e293b' } },
  { name: 'Gold', category: 'Minimal', colors: { primaryColor: '#fbbf24', secondaryColor: '#f59e0b', accentColor: '#fcd34d', bgColor1: '#1a1710', bgColor2: '#2e281c' } },
  // Fakecrime / OG styles
  { name: 'Blood', category: 'OG', colors: { primaryColor: '#ff0000', secondaryColor: '#ffffff', accentColor: '#880000', bgColor1: '#050000', bgColor2: '#1a0000' } },
  { name: 'Ghost', category: 'OG', colors: { primaryColor: '#ffffff', secondaryColor: '#aaaaaa', accentColor: '#555555', bgColor1: '#000000', bgColor2: '#0a0a0a' } },
  { name: 'Poison', category: 'OG', colors: { primaryColor: '#8a2be2', secondaryColor: '#9400d3', accentColor: '#da70d6', bgColor1: '#090014', bgColor2: '#15002b' } },
  { name: 'Biohazard', category: 'OG', colors: { primaryColor: '#adff2f', secondaryColor: '#7fff00', accentColor: '#32cd32', bgColor1: '#051400', bgColor2: '#0b2b00' } },
];

interface PaletteSelectorProps {
  currentTheme: BioConfig['theme'];
  onChange: (colors: ThemePalette['colors']) => void;
}

export default function PaletteSelector({ currentTheme, onChange }: PaletteSelectorProps) {
  // Group palettes by category
  const categories = Array.from(new Set(PRESET_PALETTES.map(p => p.category)));

  const isCurrentPalette = (palette: ThemePalette) => {
    return (
      palette.colors.primaryColor === currentTheme.primaryColor &&
      palette.colors.secondaryColor === currentTheme.secondaryColor &&
      palette.colors.bgColor1 === currentTheme.bgColor1 &&
      palette.colors.bgColor2 === currentTheme.bgColor2
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
        Choose from 30+ curated color palettes. This will overwrite your current colors and background colors.
      </p>

      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_PALETTES.filter(p => p.category === category).map(palette => {
              const active = isCurrentPalette(palette);
              return (
                <button
                  key={palette.name}
                  onClick={() => onChange(palette.colors)}
                  className={`group relative flex flex-col gap-1.5 p-2 rounded-lg border transition-all text-left overflow-hidden ${
                    active 
                      ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-purple-300' : 'text-white/70'}`}>
                      {palette.name}
                    </span>
                    {active && <Check size={12} className="text-purple-400" />}
                  </div>
                  
                  <div className="flex w-full h-3 rounded-sm overflow-hidden z-10 shadow-sm border border-white/10">
                    <div className="h-full flex-1" style={{ backgroundColor: palette.colors.primaryColor }} />
                    <div className="h-full flex-1" style={{ backgroundColor: palette.colors.secondaryColor }} />
                    <div className="h-full flex-1" style={{ backgroundColor: palette.colors.accentColor }} />
                    <div className="h-full flex-1" style={{ backgroundColor: palette.colors.bgColor1 }} />
                    <div className="h-full flex-1" style={{ backgroundColor: palette.colors.bgColor2 }} />
                  </div>

                  {/* Subtle background gradient hint based on palette */}
                  <div 
                    className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${palette.colors.bgColor1}, ${palette.colors.bgColor2})` }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
