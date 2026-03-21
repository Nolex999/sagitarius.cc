import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { colord } from 'colord';
import { ChevronDown } from 'lucide-react';

interface AdvancedColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function AdvancedColorPicker({ value, onChange, label }: AdvancedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  // Internal inputs to avoid parsing errors while typing
  const c = colord(value);
  const [hexInput, setHexInput] = useState(value);
  const [rgbInput, setRgbInput] = useState(() => { const r = c.toRgb(); return `${r.r}, ${r.g}, ${r.b}`; });
  const [hslInput, setHslInput] = useState(() => { const h = c.toHsl(); return `${Math.round(h.h)}, ${Math.round(h.s)}%, ${Math.round(h.l)}%`; });

  useEffect(() => {
    const col = colord(value);
    setHexInput(col.toHex());
    setRgbInput(`${col.toRgb().r}, ${col.toRgb().g}, ${col.toRgb().b}`);
    setHslInput(`${Math.round(col.toHsl().h)}, ${Math.round(col.toHsl().s)}%, ${Math.round(col.toHsl().l)}%`);
  }, [value]);

  const handleInputChange = (val: string) => {
    let parsedString = val;
    if (mode === 'rgb' && !val.startsWith('rgb')) parsedString = `rgb(${val})`;
    if (mode === 'hsl' && !val.startsWith('hsl')) parsedString = `hsl(${val})`;
    
    const parsed = colord(parsedString);
    if (parsed.isValid()) {
      onChange(parsed.toHex());
    }
  };

  return (
    <div className="relative">
      {label && <label className="block text-[10px] uppercase tracking-[0.15em] font-semibold text-[var(--text-secondary)] mb-1.5">{label}</label>}
      <div 
        className="w-full h-9 flex items-center justify-between px-2 bg-white/[0.03] border border-white/[0.08] rounded-lg cursor-pointer hover:bg-white/[0.06] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded shadow-sm border border-white/20" style={{ backgroundColor: value }} />
          <span className="text-xs font-mono text-white/80">{value.toUpperCase()}</span>
        </div>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 p-3 bg-[#111] border border-white/10 rounded-xl shadow-2xl animate-fade-in w-56">
          <div className="mb-3">
            <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: '140px' }} />
          </div>

          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg mb-3">
            <button onClick={() => setMode('hex')} className={`flex-1 text-[9px] uppercase font-bold py-1 rounded ${mode === 'hex' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}>HEX</button>
            <button onClick={() => setMode('rgb')} className={`flex-1 text-[9px] uppercase font-bold py-1 rounded ${mode === 'rgb' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}>RGB</button>
            <button onClick={() => setMode('hsl')} className={`flex-1 text-[9px] uppercase font-bold py-1 rounded ${mode === 'hsl' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}>HSL</button>
          </div>

          <div className="flex bg-black/40 border border-white/10 rounded-lg overflow-hidden focus-within:border-[var(--accent)]/50 transition-colors">
            <div className="px-2 py-1.5 bg-white/5 flex items-center justify-center border-r border-white/5 text-[10px] text-white/40 font-bold">
              {mode.toUpperCase()}
            </div>
            <input
              type="text"
              value={mode === 'hex' ? hexInput : mode === 'rgb' ? rgbInput : hslInput}
              onChange={(e) => {
                const val = e.target.value;
                if (mode === 'hex') setHexInput(val);
                if (mode === 'rgb') setRgbInput(val);
                if (mode === 'hsl') setHslInput(val);
                handleInputChange(val);
              }}
              className="flex-1 bg-transparent px-2 text-xs text-white placeholder-white/20 focus:outline-none font-mono"
            />
          </div>
        </div>
      )}
      
      {/* Click outside backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
