'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

type OverlayEffect = 'none' | 'vhs' | 'scanlines' | 'noise' | 'glitch' | 'crt';
type BgEffect = 'none' | 'particles' | 'stars' | 'snow' | 'rain';

interface FreedomConfig {
  videoUrl: string;
  audioUrl: string;
  audioVolume: number;
  displayName: string;
  bioText: string;
  avatarUrl: string;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  brightness: number;
  contrast: number;
  saturation: number;
  hueRotate: number;
  blurBg: number;
  sepia: number;
  grayscale: number;
  overlay: OverlayEffect;
  bgEffect: BgEffect;
  bgEffectColor: string;
  bgEffectIntensity: number;
  socialLinks: { platform: string; url: string }[];
  customLinks: { label: string; url: string }[];
  customCss: string;
  cardOpacity: number;
  cardBlur: number;
  showAvatar: boolean;
  showContent: boolean;
  layout: 'centered' | 'left' | 'right';
  verticalPos: 'center' | 'top' | 'bottom';
  nameSize: number;
  nameWeight: number;
  nameSpacing: number;
  nameShadow: boolean;
  nameShadowColor: string;
  nameAnimation: string;
  showCardBg: boolean;
  badgeEnabled: boolean;
  badgeText: string;
  badgeSize: number;
  badgeFont: string;
}

const STORAGE_KEY = 'freedom-config';
const DEFAULT_CONFIG: FreedomConfig = {
  videoUrl: '',
  audioUrl: '',
  audioVolume: 25,
  displayName: 'Freedom',
  bioText: 'Customize this page',
  avatarUrl: '',
  fontFamily: 'Inter, system-ui, sans-serif',
  primaryColor: '#ffffff',
  accentColor: '#f97316',
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotate: 0,
  blurBg: 0,
  sepia: 0,
  grayscale: 0,
  overlay: 'none',
  bgEffect: 'none',
  bgEffectColor: '#f97316',
  bgEffectIntensity: 50,
  socialLinks: [],
  customLinks: [],
  customCss: '',
  cardOpacity: 30,
  cardBlur: 16,
  showAvatar: true,
  showContent: true,
  layout: 'centered',
  verticalPos: 'center',
  nameSize: 56,
  nameWeight: 700,
  nameSpacing: 0,
  nameShadow: false,
  nameShadowColor: '#000000',
  nameAnimation: 'fade-up',
  showCardBg: true,
  badgeEnabled: false,
  badgeText: 'chris',
  badgeSize: 14,
  badgeFont: 'Inter, system-ui, sans-serif',
};

function loadConfig(): FreedomConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_CONFIG;
}

function saveConfig(config: FreedomConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

const PLATFORMS = [
  'discord', 'telegram', 'twitter', 'github', 'youtube', 'twitch',
  'spotify', 'instagram', 'tiktok', 'snapchat', 'reddit', 'soundcloud',
];

const OVERLAY_OPTIONS: { value: OverlayEffect; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'vhs', label: 'VHS' },
  { value: 'scanlines', label: 'Scanlines' },
  { value: 'noise', label: 'Noise' },
  { value: 'glitch', label: 'Glitch' },
  { value: 'crt', label: 'CRT' },
];

const FONTS = [
  'Inter, system-ui, sans-serif',
  'Outfit, system-ui, sans-serif',
  'Space Grotesk, system-ui, sans-serif',
  'JetBrains Mono, monospace',
  'Fira Code, monospace',
  'Poppins, system-ui, sans-serif',
  'Orbitron, system-ui, sans-serif',
  'Audiowide, system-ui, sans-serif',
  'Montserrat, system-ui, sans-serif',
  'Playfair Display, serif',
  'Bebas Neue, system-ui, sans-serif',
  'Righteous, system-ui, sans-serif',
  'Permanent Marker, cursive',
];

// ====== SUBCOMPONENTS ======

function Icon({ platform, size = 18 }: { platform: string; size?: number }) {
  const svgPaths: Record<string, string> = {
    discord: 'M22 24l-5.25-5.25M22 24l-3-9-9 9M22 24h-9',
    telegram: 'M21 3L2 11l7 3 3 7 9-18z',
    twitter: 'M22 4s-2 1-3 1c-1-1-3-2-5-2-4 0-7 3-7 7v1c-4 1-7-2-7-2s-1 4 2 7c-1 1-3 2-3 2s2 3 6 3c-2 2 0 4 0 4s-2 4 8 6c10 2 15-8 15-14 0-1 1-2 1-4l-3 1z',
    github: 'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z',
    youtube: 'M19.6 4.2C20 4.6 20 5.3 20 6.6v10.8c0 1.3 0 2-.4 2.4-.4.4-1.1.4-2.4.4H6.8c-1.3 0-2 0-2.4-.4-.4-.4-.4-1.1-.4-2.4V6.6c0-1.3 0-2 .4-2.4.4-.4 1.1-.4 2.4-.4h10.4c1.3 0 2 0 2.4.4zM9.5 8.5v7l6-3.5z',
    twitch: 'M11.6 4.4h-3v7.2h3v-7.2zm5.4 0h-3v7.2h3v-7.2zM21 2L5 2 2 5v14h5v3l3-3h4l8-8V2z',
    spotify: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.2.33-.64.44-.97.24-2.66-1.63-6.02-2-9.97-1.09-.39.08-.74-.17-.82-.56-.08-.39.17-.74.56-.82 4.25-.98 7.88-.56 10.82 1.24.33.2.44.64.24.97zm1.23-2.73c-.25.41-.78.56-1.19.31-3.04-1.87-7.67-2.41-11.27-1.32-.46.14-.95-.12-1.09-.58-.14-.46.12-.95.58-1.09 4.11-1.24 9.2-.64 12.67 1.51.41.25.56.78.3 1.17zm.11-2.84c-3.64-2.16-9.65-2.36-13.13-1.3-.56.17-1.15-.14-1.32-.7-.17-.56.14-1.15.7-1.32 4.05-1.24 10.76-.99 14.94 1.53.5.3.67 1.01.37 1.52-.3.5-1.01.67-1.56.27z',
    instagram: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z',
    tiktok: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.57 2.89 2.89 0 01-2.89-2.89c0-1.6 1.29-2.89 2.89-2.89.3 0 .59.05.87.14v-3.5a6.37 6.37 0 00-.87-.06A6.34 6.34 0 003.27 15.3a6.34 6.34 0 006.34 6.34c3.5 0 6.34-2.84 6.34-6.34V8.85a8.24 8.24 0 004.77 1.49v-3.5a4.82 4.82 0 01-3.13-1.15z',
    snapchat: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 16.5c-1.5 0-2.5-.5-3-1l-.5.2c-.2.1-.4.2-.6.2-.3 0-.5-.1-.7-.3l-.1-.1c-.1-.1-.2-.2-.3-.3l-.1-.1c-.1-.1-.2-.2-.2-.4l-.1-.2c-.1-.1-.1-.3-.1-.4 0-.2.1-.4.2-.5l.1-.1c.1-.1.2-.2.3-.3 0-.1.1-.1.1-.2.1-.1.1-.2.1-.3-.3-.1-.6-.2-.8-.4-.5-.3-.9-.7-1.2-1.2-.1-.2-.2-.5-.3-.8 0-.1 0-.2-.1-.3-.1-.1-.1-.2-.1-.3 0-.1 0-.3.1-.4.1-.2.2-.3.4-.4.2-.1.4-.2.6-.1.1 0 .2 0 .3.1.1 0 .2.1.3.1.3.2.6.3.9.3.4 0 .7-.1 1-.3.1-.1.2-.1.3-.1.1 0 .2-.1.3-.1.2-.1.4-.1.6-.1s.4 0 .6.1c.2.1.4.1.6.2.1 0 .2.1.3.1.1 0 .2 0 .3.1.3.2.6.3 1 .3.3 0 .6-.1.9-.3.1-.1.2-.1.3-.1.1 0 .2-.1.3-.1.2-.1.4-.1.6-.1.2 0 .4 0 .6.1.1 0 .2.1.3.1.1 0 .2.1.3.1.3.2.6.3 1 .3.3 0 .6-.1.9-.3.1-.1.2-.1.3-.1.1 0 .2-.1.3-.1.2-.1.4-.1.6-.1s.4 0 .6.1c.2 0 .3.1.4.2.1.1.3.1.4.2.1.1.2.2.2.4 0 .1.1.3 0 .4 0 .1-.1.2-.1.3-.1.2-.2.4-.4.6-.1.1-.2.2-.3.3-.1.1-.2.1-.3.2-.2.1-.5.2-.8.2 0 .1 0 .2.1.3 0 .1.1.2.1.3.1.1.2.2.3.3l.1.1c.1.1.1.2.2.4 0 .1.1.2.1.4 0 .1-.1.3-.1.4-.1.1-.1.2-.2.3l-.1.1c-.1.1-.2.2-.3.3-.1.1-.2.2-.3.3-.2.1-.4.2-.7.2-.2 0-.4-.1-.6-.2l-.5-.2c-.5.5-1.5 1-3 1zM12 4c3.9 0 7 3.1 7 7v.5c0 .3.2.5.5.5h.5c.6 0 1 .4 1 1s-.4 1-1 1h-.5c-.3 0-.5.2-.5.5V14c0 3.9-3.1 7-7 7s-7-3.1-7-7v-.5c0-.3-.2-.5-.5-.5H4c-.6 0-1-.4-1-1s.4-1 1-1h.5c.3 0 .5-.2.5-.5V11c0-3.9 3.1-7 7-7z',
    reddit: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 7.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-11 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S5.5 11.83 5.5 11s.67-1.5 1.5-1.5zm8.88 5.78c.1-.1.26-.1.36 0 .1.1.1.26 0 .36-1.17 1.17-3.08 1.17-4.24 0-.1-.1-.1-.26 0-.36.1-.1.26-.1.36 0 .98.98 2.56.98 3.52 0zm-1.38-1.78c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-5 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
    soundcloud: 'M11.56 8.87V17h9.6c.84 0 1.52-.68 1.52-1.52v-1.5c0-.84-.68-1.52-1.52-1.52h-.9c-.26-2.1-2.04-3.7-4.2-3.7-1.07 0-2.04.4-2.8 1.05v-.94h-1.7zm-2.2 8.13h-1.7V9.38h1.7v7.62zM6.4 17H4.7v-5.66h1.7V17zm-2.83 0H1.87v-4.24h1.7V17z',
  };
  const path = svgPaths[platform];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

function ParticlesCanvas({ color, intensity }: { color: string; intensity: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let id: number;
    const count = Math.floor((intensity / 100) * 30) + 5;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      s: Math.random() * 2 + 1, o: Math.random() * 0.4 + 0.1,
    }));
    const anim = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(p.o * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          if (dx * dx + dy * dy < 10000) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = color + '15';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      id = requestAnimationFrame(anim);
    };
    id = requestAnimationFrame(anim);
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, [color, intensity]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none z-[2]" />;
}

function StarsField({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 30) + 5;
  const stars = Array.from({ length: count }, (_, i) => ({
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    dur: `${Math.random() * 3 + 2}s`, del: `${Math.random() * 5}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: s.left, top: s.top, width: s.size, height: s.size,
          backgroundColor: color, opacity: 0.3,
          animation: `fade-pulse ${s.dur} ease-in-out infinite`,
          animationDelay: s.del,
        }} />
      ))}
    </div>
  );
}

function SnowField({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 25) + 5;
  const flakes = Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`, size: `${Math.random() * 4 + 2}px`,
    dur: `${Math.random() * 5 + 5}s`, del: `${Math.random() * 10}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {flakes.map((f, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: f.left, top: '-5%', width: f.size, height: f.size,
          backgroundColor: color, opacity: 0.4,
          animation: `snow-fall ${f.dur} linear infinite`,
          animationDelay: f.del,
        }} />
      ))}
    </div>
  );
}

function RainField({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 35) + 5;
  const drops = Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`, height: `${Math.random() * 20 + 10}px`,
    dur: `${Math.random() * 1 + 0.5}s`, del: `${Math.random() * 3}s`,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {drops.map((d, i) => (
        <div key={i} className="absolute" style={{
          left: d.left, top: '-5%', width: '1px', height: d.height,
          backgroundColor: color, opacity: 0.2,
          animation: `rain-fall ${d.dur} linear infinite`,
          animationDelay: d.del,
        }} />
      ))}
    </div>
  );
}

function BgEffect({ effect, color, intensity }: { effect: string; color: string; intensity: number }) {
  switch (effect) {
    case 'particles': return <ParticlesCanvas color={color} intensity={intensity} />;
    case 'stars': return <StarsField color={color} intensity={intensity} />;
    case 'snow': return <SnowField color={color} intensity={intensity} />;
    case 'rain': return <RainField color={color} intensity={intensity} />;
    default: return null;
  }
}

function isValidUrl(s: string) {
  if (!s) return true;
  try { new URL(s); return true; }
  catch { return false; }
}

// ====== MAIN COMPONENT ======

export default function FreedomCanvas() {
  const [edit, setEdit] = useState(false);
  const [cfg, setCfg] = useState<FreedomConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [uploading, setUploading] = useState<'video' | 'audio' | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<'video' | 'audio'>('video');
  const supabase = createClient();
  const [draftLink, setDraftLink] = useState('');
  const [draftLabel, setDraftLabel] = useState('');
  const [draftPlatform, setDraftPlatform] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [viewCount, setViewCount] = useState(0);

  // Load config from Supabase + localStorage
  useEffect(() => {
    (async () => {
      // Start with defaults
      let merged = { ...DEFAULT_CONFIG };

      // Load Supabase published config (for everyone)
      try {
        const { data } = await supabase
          .from('freedom_config')
          .select('config, views')
          .eq('id', 1)
          .maybeSingle();
        if (data?.config) {
          const raw = data.config;
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          merged = { ...merged, ...parsed as unknown as Partial<FreedomConfig> };
          setViewCount(Number(data.views));
        }
      } catch {}

      // Load localStorage draft only if it has actual custom data (not defaults)
      const rawLocal = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      const hasCustomLocal = rawLocal !== null && rawLocal !== JSON.stringify(DEFAULT_CONFIG);
      if (hasCustomLocal) {
        merged = { ...merged, ...loadConfig() };
      }

      setCfg(merged);
      setLoaded(true);
    })();
  }, []);

  // Auth check
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          if (data && (data.role === 'owner' || data.role === 'admin')) {
            setIsOwner(true);
          }
        }
      } catch {}
      setAuthChecked(true);
    })();
  }, []);

  // Save to localStorage on change
  // Increment view counter once per session
  useEffect(() => {
    if (!loaded || edit) return;
    if (sessionStorage.getItem('freedom_viewed')) return;
    sessionStorage.setItem('freedom_viewed', '1');
    supabase.rpc('increment_freedom_views').then(() => {});
  }, [loaded, edit]);

  // Refresh view count periodically
  useEffect(() => {
    if (!loaded) return;
    const iv = setInterval(async () => {
      try {
        const { data } = await supabase.from('freedom_config').select('views').eq('id', 1).single();
        if (data) setViewCount(Number(data.views));
      } catch {}
    }, 30000);
    return () => clearInterval(iv);
  }, [loaded]);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) saveConfig(cfg);
  }, [cfg, loaded]);

  useEffect(() => {
    if (!edit && audioRef.current && cfg.audioUrl) {
      audioRef.current.volume = cfg.audioVolume / 100;
      if (audioStarted) audioRef.current.play().catch(() => {});
    }
  }, [edit, cfg.audioUrl, cfg.audioVolume, audioStarted]);

  const update = useCallback(<K extends keyof FreedomConfig>(key: K, value: FreedomConfig[K]) => {
    setCfg(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleFileUpload = async (file: File, target: 'video' | 'audio') => {
    setUploading(target);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Login required');
      const ext = file.name.split('.').pop();
      const path = `freedom/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('bio-media').upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('bio-media').getPublicUrl(path);
      if (target === 'video') update('videoUrl', publicUrl);
      else update('audioUrl', publicUrl);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const addSocial = () => {
    if (!draftPlatform || !draftLink) return;
    if (!isValidUrl(draftLink)) return;
    setCfg(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: draftPlatform, url: draftLink }],
    }));
    setDraftPlatform('');
    setDraftLink('');
  };

  const removeSocial = (i: number) => {
    setCfg(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, idx) => idx !== i) }));
  };

  const addCustomLink = () => {
    if (!draftLabel || !draftLink) return;
    if (!isValidUrl(draftLink)) return;
    setCfg(prev => ({
      ...prev,
      customLinks: [...prev.customLinks, { label: draftLabel, url: draftLink }],
    }));
    setDraftLabel('');
    setDraftLink('');
  };

  const removeCustomLink = (i: number) => {
    setCfg(prev => ({ ...prev, customLinks: prev.customLinks.filter((_, idx) => idx !== i) }));
  };

  const publishConfig = async () => {
    try {
      const payload = JSON.parse(JSON.stringify(cfg));
      const { error } = await supabase
        .from('freedom_config')
        .upsert(
          { id: 1, config: payload, updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        );
      if (error) throw error;
      // Refresh view count
      const { data } = await supabase.from('freedom_config').select('views').eq('id', 1).maybeSingle();
      if (data) setViewCount(Number(data.views));
      alert('Published! Config is now live for all visitors.');
    } catch (e) {
      alert('Failed to publish. Are you logged in as owner/admin?');
    }
  };

  const resetConfig = () => {
    if (confirm('Reset all settings?')) {
      setCfg(DEFAULT_CONFIG);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const videoStyle: React.CSSProperties = {
    filter: [
      `brightness(${cfg.brightness / 100})`,
      `contrast(${cfg.contrast / 100})`,
      `saturate(${cfg.saturation / 100})`,
      `hue-rotate(${cfg.hueRotate}deg)`,
      cfg.blurBg > 0 ? `blur(${cfg.blurBg}px)` : '',
      cfg.sepia > 0 ? `sepia(${cfg.sepia / 100})` : '',
      cfg.grayscale > 0 ? `grayscale(${cfg.grayscale / 100})` : '',
    ].filter(Boolean).join(' '),
  };

  useEffect(() => {
    if (edit) return;
    const v = videoRef.current;
    const a = audioRef.current;

    const playAudio = () => {
      if (a && cfg.audioUrl) {
        a.volume = cfg.audioVolume / 100;
        a.play().catch(() => {});
      }
    };

    // Try video unmute
    const tryVideoUnmute = (): Promise<boolean> => {
      if (!v) return Promise.resolve(false);
      v.muted = false;
      v.volume = cfg.audioVolume / 100;
      return v.play().then(() => {
        setAudioStarted(true);
        playAudio();
        return true;
      }).catch(() => false);
    };

    // Try AudioContext silence buffer to unlock audio
    const tryAudioCtx = (): Promise<boolean> => {
      return new Promise(resolve => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (ctx.state === 'suspended') {
            ctx.resume().then(() => {
              const buf = ctx.createBuffer(1, 22050, 22050);
              const src = ctx.createBufferSource();
              src.buffer = buf;
              src.connect(ctx.destination);
              src.start();
              if (v) { v.muted = false; v.play(); }
              playAudio();
              setAudioStarted(true);
              ctx.close();
              resolve(true);
            }).catch(() => resolve(false));
          } else {
            ctx.close();
            resolve(false);
          }
        } catch { resolve(false); }
      });
    };

    // Try audio element independently
    const tryAudioElem = (): Promise<boolean> => {
      if (!a || !cfg.audioUrl) return Promise.resolve(false);
      a.muted = false;
      a.volume = cfg.audioVolume / 100;
      return a.play().then(() => { setAudioStarted(true); return true; }).catch(() => false);
    };

    (async () => {
      const ok = await tryVideoUnmute() || await tryAudioCtx() || await tryAudioElem();
      if (!ok) {
        const onInteraction = () => {
          if (v) { v.muted = false; v.play(); }
          playAudio();
          setAudioStarted(true);
          document.removeEventListener('click', onInteraction);
          document.removeEventListener('touchstart', onInteraction);
        };
        document.addEventListener('click', onInteraction, { once: true });
        document.addEventListener('touchstart', onInteraction, { once: true });
      }
    })();
  }, [edit, cfg.videoUrl, cfg.audioUrl, cfg.audioVolume]);

  const layoutClass = cfg.layout === 'left' ? 'items-start text-left px-12' :
    cfg.layout === 'right' ? 'items-end text-right px-12' :
    'items-center text-center';

  const hasContent = cfg.showContent && (
    cfg.displayName.trim() || cfg.bioText.trim() || cfg.avatarUrl.trim() ||
    cfg.customLinks.length > 0 || cfg.socialLinks.length > 0
  );

  if (!loaded) return null;

  return (
    <>
      <style>{`
        @keyframes fade-pulse { 0%,100% { opacity: 0.1; } 50% { opacity: 0.6; } }
        @keyframes snow-fall { 0% { transform: translateY(-10px) rotate(0deg); } 100% { transform: translateY(calc(100vh + 10px)) rotate(360deg); } }
        @keyframes rain-fall { 0% { transform: translateY(-20px); } 100% { transform: translateY(calc(100vh + 20px)); } }
        @keyframes glitch-overlay {
          0% { opacity: 0; }
          1% { opacity: 0.8; background: ${cfg.accentColor}15; mix-blend-mode: overlay; }
          2% { opacity: 0; }
          10% { opacity: 0; }
          11% { opacity: 0.6; background: ${cfg.accentColor}10; transform: translateX(2px); }
          12% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px ${cfg.accentColor}33, 0 0 40px ${cfg.accentColor}11; }
          50% { box-shadow: 0 0 30px ${cfg.accentColor}55, 0 0 60px ${cfg.accentColor}22; }
        }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slide-in-top { 0% { opacity: 0; transform: translateY(-40px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .name-anim-fade-up { animation: float-up 1s ease-out both; }
        .name-anim-fade-in { animation: fade-in 1s ease-out both; }
        .name-anim-slide-top { animation: slide-in-top 1s ease-out both; }
        .name-anim-scale { animation: scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .name-anim-bounce { animation: bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) both; }
        .name-anim-float { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .name-anim-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .name-anim-shimmer {
          background: linear-gradient(90deg, transparent, ${cfg.primaryColor}88, transparent);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2s linear infinite;
        }
        .freedom-enter { animation: float-up 0.8s ease-out both; }
        .freedom-enter-d1 { animation-delay: 0.1s; }
        .freedom-enter-d2 { animation-delay: 0.2s; }
        .freedom-enter-d3 { animation-delay: 0.3s; }
        .freedom-enter-d4 { animation-delay: 0.4s; }
        .freedom-enter-d5 { animation-delay: 0.5s; }
        .freedom-enter-d6 { animation-delay: 0.6s; }
        .freedom-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .overlay-vhs {
          background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
          background-size: 100% 2px, 3px 100%;
          mix-blend-mode: overlay;
        }
        .overlay-scanlines {
          background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.08));
          background-size: 100% 4px;
        }
        .overlay-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.12; mix-blend-mode: overlay;
        }
        .overlay-crt::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 10;
          background: radial-gradient(circle, transparent 65%, rgba(0,0,0,0.45) 100%), linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.3) 50%), linear-gradient(90deg, rgba(255,0,0,0.05), rgba(0,255,0,0.02), rgba(0,0,255,0.05));
          background-size: 100% 100%, 100% 4px, 6px 100%;
        }
        .overlay-glitch {
          animation: glitch-overlay 3s infinite;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px);
        }
        ${cfg.customCss}
      `}</style>

      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Video Background */}
        {cfg.videoUrl && (
          <video
            ref={videoRef}
            src={cfg.videoUrl}
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={videoStyle}
          />
        )}
        {!cfg.videoUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
        )}

        {/* Background overlay */}
        {cfg.blurBg < 1 && (
          <div className="absolute inset-0 bg-black/20 z-[1]" />
        )}

        {/* Background Effect */}
        <BgEffect effect={cfg.bgEffect} color={cfg.bgEffectColor} intensity={cfg.bgEffectIntensity} />

        {/* Overlay Effect */}
        {cfg.overlay !== 'none' && (
          <div className={`absolute inset-0 pointer-events-none z-10 ${cfg.overlay === 'crt' ? 'overlay-crt' : ''}`}>
            <div className={`w-full h-full ${cfg.overlay !== 'crt' ? `overlay-${cfg.overlay}` : ''}`} />
          </div>
        )}

        {/* Unmute button */}
        {!audioStarted && !edit && (
          <button
            onClick={() => {
              const v = videoRef.current;
              const a = audioRef.current;
              if (v) { v.muted = false; v.play(); }
              if (a && cfg.audioUrl) { a.volume = cfg.audioVolume / 100; a.play().catch(() => {}); }
              setAudioStarted(true);
            }}
            className="absolute bottom-6 right-6 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            style={{ backgroundColor: `rgba(0,0,0,${cfg.cardOpacity / 100})`, backdropFilter: `blur(${cfg.cardBlur}px)` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
        )}

        {/* Badge */}
        {cfg.badgeEnabled && (
          <div
            className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{
              backgroundColor: `rgba(0,0,0,${cfg.cardOpacity / 100})`,
              backdropFilter: `blur(${cfg.cardBlur}px)`,
              WebkitBackdropFilter: `blur(${cfg.cardBlur}px)`,
            }}
          >
            <span
              className="leading-none"
              style={{
                fontFamily: cfg.badgeFont,
                fontSize: `${cfg.badgeSize}px`,
                color: cfg.primaryColor,
                fontWeight: 500,
              }}
            >
              {cfg.badgeText || 'user'}
            </span>
            <span
              className="leading-none opacity-50"
              style={{
                fontFamily: cfg.badgeFont,
                fontSize: `${cfg.badgeSize * 0.7}px`,
                color: cfg.primaryColor,
              }}
            >
              #1
            </span>
          </div>
        )}

        {/* Content */}
        {hasContent && (
        <div className={`absolute inset-0 z-20 flex flex-col ${layoutClass} ${
          cfg.verticalPos === 'top' ? 'justify-start pt-16' :
          cfg.verticalPos === 'bottom' ? 'justify-end pb-16' :
          'justify-center'
        }`}>
          <div
            className={`max-w-md w-full mx-auto p-8 rounded-2xl ${cfg.showCardBg ? 'backdrop-blur-sm freedom-glow' : ''}`}
            style={{
              backgroundColor: cfg.showCardBg ? `rgba(0,0,0,${cfg.cardOpacity / 100})` : 'transparent',
              backdropFilter: cfg.showCardBg ? `blur(${cfg.cardBlur}px)` : 'none',
              WebkitBackdropFilter: cfg.showCardBg ? `blur(${cfg.cardBlur}px)` : 'none',
            }}
          >
            {cfg.showAvatar && cfg.avatarUrl && (
              <div className={`freedom-enter freedom-enter-d1 ${cfg.layout === 'centered' ? 'flex justify-center' : ''}`}>
                <img src={cfg.avatarUrl} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-white/10 mb-4 shadow-xl" />
              </div>
            )}

            {cfg.displayName && (
              <h1
                className={`mb-2 leading-tight ${cfg.nameAnimation !== 'none' ? `name-anim-${cfg.nameAnimation}` : ''}`}
                style={{
                  color: cfg.primaryColor,
                  fontFamily: cfg.fontFamily,
                  fontSize: `${cfg.nameSize}px`,
                  fontWeight: cfg.nameWeight,
                  letterSpacing: `${cfg.nameSpacing}px`,
                  textShadow: cfg.nameShadow ? `0 2px 20px ${cfg.nameShadowColor}66` : 'none',
                }}
              >
                {cfg.displayName}
              </h1>
            )}

            {cfg.bioText && (
              <p
                className={`freedom-enter freedom-enter-d3 text-sm leading-relaxed mb-6`}
                style={{ color: cfg.primaryColor + 'cc', fontFamily: cfg.fontFamily }}
              >
                {cfg.bioText}
              </p>
            )}

            {cfg.customLinks.length > 0 && (
              <div className={`freedom-enter freedom-enter-d4 space-y-2 mb-6`}>
                {cfg.customLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: cfg.accentColor + '15',
                      color: cfg.primaryColor,
                      border: `1px solid ${cfg.accentColor}25`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = cfg.accentColor + '25')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = cfg.accentColor + '15')}
                  >
                    <span className="flex-1">{link.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9-9M7 8h9v9"/></svg>
                  </a>
                ))}
              </div>
            )}

            {cfg.socialLinks.length > 0 && (
              <div className={`freedom-enter freedom-enter-d5 flex flex-wrap gap-2 ${cfg.layout === 'centered' ? 'justify-center' : ''}`}>
                {cfg.socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: cfg.accentColor + '15',
                      color: cfg.primaryColor,
                      border: `1px solid ${cfg.accentColor}20`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = cfg.accentColor + '30';
                      e.currentTarget.style.borderColor = cfg.accentColor + '50';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = cfg.accentColor + '15';
                      e.currentTarget.style.borderColor = cfg.accentColor + '20';
                    }}
                    title={s.platform}
                  >
                    <Icon platform={s.platform} size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Audio */}
        <audio ref={audioRef} loop preload="auto">
          <source src={cfg.audioUrl} type="audio/mpeg" />
        </audio>

        {/* Top right: views + edit */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {/* View count */}
          <div
            className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-[11px] font-medium"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              color: cfg.primaryColor + 'cc',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{viewCount}</span>
          </div>

          {/* Edit Toggle Button */}
          {isOwner && (
          <button
            onClick={() => setEdit(!edit)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor: edit ? cfg.accentColor + '30' : 'rgba(0,0,0,0.4)',
              color: edit ? cfg.accentColor : '#fff',
              backdropFilter: edit ? 'none' : 'blur(8px)',
              border: `1px solid ${edit ? cfg.accentColor + '50' : 'rgba(255,255,255,0.08)'}`,
            }}
            title={edit ? 'Close editor' : 'Open editor'}
          >
            {edit ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            )}
          </button>
          )}
        </div>

        {/* Edit Panel */}
        {edit && (
          <div className="fixed top-0 right-0 z-40 w-[420px] h-full overflow-y-auto bg-zinc-950/90 backdrop-blur-xl border-l border-white/[0.06] shadow-2xl">
            <div className="p-5 pt-16 space-y-5 text-sm">
              <h2 className="text-xs font-black uppercase tracking-widest text-white/40">Freedom Studio</h2>

              {/* VIDEO */}
              <Section title="Video">
                <div className="space-y-2">
                  <input type="text" value={cfg.videoUrl} onChange={e => update('videoUrl', e.target.value)}
                    placeholder="MP4 URL or paste from Supabase"
                    className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                  <div className="flex gap-2">
                    <button onClick={() => { setUploadTarget('video'); fileInputRef.current?.click(); }}
                      disabled={uploading === 'video'}
                      className="flex-1 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-50">
                      {uploading === 'video' ? 'Uploading...' : 'Upload Video'}
                    </button>
                    {cfg.videoUrl && (
                      <button onClick={() => update('videoUrl', '')}
                        className="h-9 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all">
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </Section>

              {/* Filters */}
              <Section title="Video Filters">
                <Slider label="Brightness" value={cfg.brightness} onChange={v => update('brightness', v)} min={0} max={200} />
                <Slider label="Contrast" value={cfg.contrast} onChange={v => update('contrast', v)} min={0} max={200} />
                <Slider label="Saturation" value={cfg.saturation} onChange={v => update('saturation', v)} min={0} max={200} />
                <Slider label="Hue Rotate" value={cfg.hueRotate} onChange={v => update('hueRotate', v)} min={0} max={360} suffix="°" />
                <Slider label="Blur" value={cfg.blurBg} onChange={v => update('blurBg', v)} min={0} max={20} suffix="px" />
                <Slider label="Sepia" value={cfg.sepia} onChange={v => update('sepia', v)} min={0} max={100} suffix="%" />
                <Slider label="Grayscale" value={cfg.grayscale} onChange={v => update('grayscale', v)} min={0} max={100} suffix="%" />
              </Section>

              {/* AUDIO */}
              <Section title="Audio">
                <input type="text" value={cfg.audioUrl} onChange={e => update('audioUrl', e.target.value)}
                  placeholder="MP3 URL or paste from Supabase"
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                <div className="flex gap-2">
                  <button onClick={() => { setUploadTarget('audio'); fileInputRef.current?.click(); }}
                    disabled={uploading === 'audio'}
                    className="flex-1 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-50">
                    {uploading === 'audio' ? 'Uploading...' : 'Upload Audio'}
                  </button>
                  {cfg.audioUrl && (
                    <button onClick={() => update('audioUrl', '')}
                      className="h-9 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all">
                      Clear
                    </button>
                  )}
                </div>
                <Slider label="Volume" value={cfg.audioVolume} onChange={v => update('audioVolume', v)} min={0} max={100} suffix="%" />
              </Section>

              {/* OVERLAY EFFECTS */}
              <Section title="Overlay">
                <div className="flex flex-wrap gap-1.5">
                  {OVERLAY_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => update('overlay', opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        cfg.overlay === opt.value
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Section>

              {/* BG EFFECT */}
              <Section title="Background Effect">
                <div className="flex flex-wrap gap-1.5">
                  {(['none', 'particles', 'stars', 'snow', 'rain'] as BgEffect[]).map(opt => (
                    <button key={opt} onClick={() => update('bgEffect', opt)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        cfg.bgEffect === opt
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {cfg.bgEffect !== 'none' && (
                  <>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-[9px] uppercase tracking-wider text-white/30">Color</label>
                      <input type="color" value={cfg.bgEffectColor}
                        onChange={e => update('bgEffectColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                    </div>
                    <Slider label="Intensity" value={cfg.bgEffectIntensity} onChange={v => update('bgEffectIntensity', v)} suffix="%" />
                  </>
                )}
              </Section>

              {/* PROFILE */}
              <Section title="Profile">
                <input type="text" value={cfg.displayName} onChange={e => update('displayName', e.target.value)}
                  placeholder="Display name"
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                <textarea value={cfg.bioText} onChange={e => update('bioText', e.target.value)}
                  placeholder="Bio text" rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none" />
                <input type="text" value={cfg.avatarUrl} onChange={e => update('avatarUrl', e.target.value)}
                  placeholder="Avatar image URL"
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
              </Section>

              {/* LINKS */}
              <Section title="Custom Links">
                {cfg.customLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="text-xs text-white/60 flex-1 truncate">{link.label}</span>
                    <button onClick={() => removeCustomLink(i)}
                      className="text-red-400/60 hover:text-red-400 text-[10px] uppercase font-bold">Remove</button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input type="text" value={draftLabel} onChange={e => setDraftLabel(e.target.value)}
                    placeholder="Label" className="flex-1 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                  <input type="text" value={draftLink} onChange={e => setDraftLink(e.target.value)}
                    placeholder="URL" className="flex-1 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                  <button onClick={addCustomLink}
                    className="h-9 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all">Add</button>
                </div>
              </Section>

              {/* SOCIALS */}
              <Section title="Social Links">
                {cfg.socialLinks.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <Icon platform={s.platform} size={14} />
                    <span className="text-xs text-white/60 flex-1 truncate">{s.platform}</span>
                    <button onClick={() => removeSocial(i)}
                      className="text-red-400/60 hover:text-red-400 text-[10px] uppercase font-bold">Remove</button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select value={draftPlatform} onChange={e => setDraftPlatform(e.target.value)}
                    className="h-9 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/20">
                    <option value="">Platform</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input type="text" value={draftLink} onChange={e => setDraftLink(e.target.value)}
                    placeholder="URL" className="flex-1 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
                  <button onClick={addSocial}
                    className="h-9 px-3 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all">Add</button>
                </div>
              </Section>

              {/* STYLE */}
              <Section title="Style">
                <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Font</label>
                <select value={cfg.fontFamily} onChange={e => update('fontFamily', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                  {FONTS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                </select>
                <div className="flex gap-3 mt-2">
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Text</label>
                    <input type="color" value={cfg.primaryColor} onChange={e => update('primaryColor', e.target.value)}
                      className="w-full h-9 rounded-lg cursor-pointer bg-transparent border border-white/[0.08]" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Accent</label>
                    <input type="color" value={cfg.accentColor} onChange={e => update('accentColor', e.target.value)}
                      className="w-full h-9 rounded-lg cursor-pointer bg-transparent border border-white/[0.08]" />
                  </div>
                </div>
                <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1 mt-2">Layout</label>
                <div className="flex gap-1.5">
                  {(['centered', 'left', 'right'] as const).map(l => (
                    <button key={l} onClick={() => update('layout', l)}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        cfg.layout === l
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06]'
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Vertical</label>
                    <select value={cfg.verticalPos} onChange={e => update('verticalPos', e.target.value as typeof cfg.verticalPos)}
                      className="w-full h-9 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Anim</label>
                    <select value={cfg.nameAnimation} onChange={e => update('nameAnimation', e.target.value)}
                      className="w-full h-9 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                      <option value="fade-up">Fade Up</option>
                      <option value="fade-in">Fade In</option>
                      <option value="slide-top">Slide Top</option>
                      <option value="scale">Scale</option>
                      <option value="bounce">Bounce</option>
                      <option value="float">Float</option>
                      <option value="glow">Glow</option>
                      <option value="shimmer">Shimmer</option>
                      <option value="">None</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Size</label>
                    <input type="number" min={12} max={200} value={cfg.nameSize} onChange={e => update('nameSize', Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/20" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Weight</label>
                    <input type="number" min={100} max={900} step={100} value={cfg.nameWeight} onChange={e => update('nameWeight', Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/20" />
                  </div>
                </div>
                <Slider label="Letter Spacing" value={cfg.nameSpacing} onChange={v => update('nameSpacing', v)} min={-5} max={30} suffix="px" />
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/40 w-20 shrink-0">Text Shadow</span>
                  <input type="color" value={cfg.nameShadowColor} onChange={e => update('nameShadowColor', e.target.value)}
                    className="h-7 w-7 rounded cursor-pointer bg-transparent border border-white/[0.08]" />
                  <button onClick={() => update('nameShadow', !cfg.nameShadow)}
                    className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg transition-all ${
                      cfg.nameShadow
                        ? 'bg-white/20 text-white'
                        : 'bg-white/[0.03] text-white/40'
                    }`}>On</button>
                </div>
                <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1 mt-2">Card</label>
                <Slider label="Opacity" value={cfg.cardOpacity} onChange={v => update('cardOpacity', v)} suffix="%" />
                <Slider label="Blur" value={cfg.cardBlur} onChange={v => update('cardBlur', v)} min={0} max={40} suffix="px" />
                <Toggle label="Show Card Background" value={cfg.showCardBg} onChange={v => update('showCardBg', v)} />
                <Toggle label="Show Avatar" value={cfg.showAvatar} onChange={v => update('showAvatar', v)} />
                <Toggle label="Show Content Card" value={cfg.showContent} onChange={v => update('showContent', v)} />
              </Section>

              {/* BADGE */}
              <Section title="Badge">
                <Toggle label="Show Badge" value={cfg.badgeEnabled} onChange={v => update('badgeEnabled', v)} />
                {cfg.badgeEnabled && (
                  <>
                    <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Text</label>
                    <input type="text" value={cfg.badgeText} onChange={e => update('badgeText', e.target.value)}
                      placeholder="Username" maxLength={24}
                      className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/20 placeholder:text-white/20" />
                    <div className="flex gap-3 mt-2">
                      <div className="flex-1">
                        <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Font</label>
                        <select value={cfg.badgeFont} onChange={e => update('badgeFont', e.target.value)}
                          className="w-full h-9 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] text-white focus:outline-none focus:border-white/20 appearance-none cursor-pointer">
                          {FONTS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] uppercase tracking-wider text-white/30 block mb-1">Size</label>
                        <input type="number" min={10} max={60} value={cfg.badgeSize} onChange={e => update('badgeSize', Number(e.target.value))}
                          className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/20" />
                      </div>
                    </div>
                  </>
                )}
              </Section>

              {/* CUSTOM CSS */}
              <Section title="Custom CSS">
                <textarea value={cfg.customCss} onChange={e => update('customCss', e.target.value)}
                  placeholder="/* Custom CSS here */" rows={6}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-[11px] text-green-400/80 font-mono placeholder:text-white/10 focus:outline-none focus:border-white/20 resize-none" />
              </Section>

              {/* FOOTER */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                <div className="flex gap-3">
                  <input type="file" ref={fileInputRef} className="hidden"
                    accept={uploadTarget === 'video' ? 'video/*' : 'audio/*'}
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], uploadTarget)} />
                  <button onClick={publishConfig}
                    className="flex-1 h-9 rounded-lg bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-bold uppercase tracking-wider hover:bg-green-500/25 transition-all">
                    Publish
                  </button>
                  <button onClick={resetConfig}
                    className="flex-1 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all">
                    Reset All
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-white/30">
                  <span>{viewCount} views</span>
                  <span>Draft saved locally</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ====== HELPER COMPONENTS ======

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 pb-4 border-b border-white/[0.04]">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{title}</h3>
      {children}
    </div>
  );
}

function Slider({ label, value, onChange, min = 0, max = 100, suffix = '' }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-white/40 w-20 shrink-0">{label}</span>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-1 appearance-none rounded-full bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer" />
      <span className="text-[10px] font-mono text-white/40 w-10 text-right">{value}{suffix}</span>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-white/40">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-all ${value ? 'bg-white/30' : 'bg-white/[0.06]'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all bg-white ${value ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
