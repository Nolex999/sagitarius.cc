'use client';

import { useEffect, useRef, memo, useMemo } from 'react';
import {
  ExternalLink, Eye, Calendar, MessageCircle,
  Send, Github, Youtube, Twitch, Music, Gamepad2, Camera,
  Video, Mail, Globe, Link2, Hash, Clock, Image as ImageIcon,
} from 'lucide-react';
import type { BioConfig } from '@/types/bio';

// Platform icon mapping
function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  const icons: Record<string, React.ElementType> = {
    discord: MessageCircle,
    telegram: Send,
    twitter: Hash,
    github: Github,
    youtube: Youtube,
    twitch: Twitch,
    spotify: Music,
    steam: Gamepad2,
    instagram: Camera,
    tiktok: Video,
    snapchat: GhostIcon,
    reddit: Globe,
    soundcloud: Music,
    kick: Video,
    email: Mail,
  };
  const Icon = icons[platform] || Globe;
  return <Icon size={size} />;
}

function GhostIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} width={props.size} height={props.size}>
      <path d="M9 10h.01M15 10h.01M12 2a7 7 0 0 0-7 7v3c0 1.1-.9 2-2 2h0a1 1 0 0 0 0 2c1.5 0 2.5.8 3 1.5.5.8 1.5 1.5 3 1.5s2-.5 3-1.5c.5-.7 1.5-1.5 3-1.5a1 1 0 0 0 0-2h0a2 2 0 0 1-2-2V9a7 7 0 0 0-7-7z"/>
    </svg>
  );
}

// =================== OPTIMIZED BACKGROUND EFFECTS ===================

const ParticlesEffect = memo(function ParticlesEffect({ color, intensity }: { color: string; intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;
    const FPS = 30;
    const frameInterval = 1000 / FPS;
    const count = Math.min(Math.floor((intensity / 100) * 40) + 8, 40); // Capped at 40
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const animate = (timestamp: number) => {
      const delta = timestamp - lastTime;
      if (delta < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Reduced connection distance
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy; // Skip sqrt for perf
          if (dist < 6400) { // 80^2
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color + Math.floor((1 - Math.sqrt(dist) / 80) * 30).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [color, intensity]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ contain: 'strict' }} />;
});

const StarsEffect = memo(function StarsEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 40) + 8;
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 3 + 2}s`,
    delay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.7 + 0.1,
  })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: s.left, top: s.top, width: s.width, height: s.height,
            backgroundColor: color, opacity: s.opacity,
            animation: `bio-twinkle ${s.duration} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
});

const MatrixEffect = memo(function MatrixEffect({ color, intensity }: { color: string; intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = 0;
    const FPS = 20; // Lower FPS for matrix
    const frameInterval = 1000 / FPS;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';

    const draw = (timestamp: number) => {
      const delta = timestamp - lastTime;
      if (delta < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;
      ctx.globalAlpha = (intensity / 100) * 0.5;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationId);
  }, [color, intensity]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ contain: 'strict' }} />;
});

const SnowEffect = memo(function SnowEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 30) + 8;
  const flakes = useMemo(() => Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    opacity: Math.random() * 0.6 + 0.2,
    duration: `${Math.random() * 5 + 5}s`,
    delay: `${Math.random() * 10}s`,
  })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
      {flakes.map((f, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: f.left, top: '-5%', width: f.size, height: f.size,
          backgroundColor: color, opacity: f.opacity,
          animation: `bio-snowfall ${f.duration} linear infinite`,
          animationDelay: f.delay,
        }} />
      ))}
    </div>
  );
});

const RainEffect = memo(function RainEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 40) + 10;
  const drops = useMemo(() => Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    height: `${Math.random() * 20 + 10}px`,
    opacity: Math.random() * 0.4 + 0.1,
    duration: `${Math.random() * 1 + 0.5}s`,
    delay: `${Math.random() * 3}s`,
  })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
      {drops.map((d, i) => (
        <div key={i} className="absolute" style={{
          left: d.left, top: '-5%', width: '1px', height: d.height,
          backgroundColor: color, opacity: d.opacity,
          animation: `bio-rainfall ${d.duration} linear infinite`,
          animationDelay: d.delay,
        }} />
      ))}
    </div>
  );
});

const FirefliesEffect = memo(function FirefliesEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 15) + 4;
  const flies = useMemo(() => Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 5 + 3}px`,
    shadow1: `${Math.random() * 10 + 5}px`,
    shadow2: `${Math.random() * 20 + 10}px`,
    duration: `${Math.random() * 4 + 3}s`,
    delay: `${Math.random() * 5}s`,
  })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: 'transform', contain: 'strict' }}>
      {flies.map((f, i) => (
        <div key={i} className="absolute rounded-full" style={{
          left: f.left, top: f.top, width: f.size, height: f.size,
          backgroundColor: color,
          boxShadow: `0 0 ${f.shadow1} ${color}, 0 0 ${f.shadow2} ${color}`,
          opacity: 0,
          animation: `bio-firefly ${f.duration} ease-in-out infinite`,
          animationDelay: f.delay,
        }} />
      ))}
    </div>
  );
});

function BgEffectRenderer({ effect, color, intensity }: { effect: string; color: string; intensity: number }) {
  switch (effect) {
    case 'particles': return <ParticlesEffect color={color} intensity={intensity} />;
    case 'stars': return <StarsEffect color={color} intensity={intensity} />;
    case 'matrix': return <MatrixEffect color={color} intensity={intensity} />;
    case 'snow': return <SnowEffect color={color} intensity={intensity} />;
    case 'rain': return <RainEffect color={color} intensity={intensity} />;
    case 'fireflies': return <FirefliesEffect color={color} intensity={intensity} />;
    default: return null;
  }
}

// =================== AVATAR EFFECTS ===================

function getAvatarStyle(effect: string): string {
  switch (effect) {
    case 'glow-pulse': return 'bio-avatar-glow-pulse';
    case 'rotate-border': return 'bio-avatar-rotate-border';
    case 'glitch': return 'bio-avatar-glitch';
    case 'breathe': return 'bio-avatar-breathe';
    default: return '';
  }
}

// =================== TEXT EFFECTS ===================

function getTextClass(effect: string): string {
  switch (effect) {
    case 'gradient': return 'bio-text-gradient';
    case 'glitch': return 'bio-text-glitch';
    case 'typewriter': return 'bio-text-typewriter';
    case 'neon-flicker': return 'bio-text-neon';
    default: return '';
  }
}

// =================== PROFILE SHAPE ===================

function getProfileShapeStyle(shape: string): React.CSSProperties {
  switch (shape) {
    case 'rounded-square': return { borderRadius: '20%' };
    case 'hexagon': return { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' };
    default: return { borderRadius: '50%' };
  }
}

// =================== BORDER STYLE ===================

function getBorderProps(style: string, primaryColor: string): React.CSSProperties {
  switch (style) {
    case 'solid': return { border: `2px solid ${primaryColor}40` };
    case 'gradient': return { border: 'none', outline: `2px solid transparent`, backgroundClip: 'padding-box' };
    case 'animated': return { border: `2px solid ${primaryColor}40`, animation: 'bio-border-pulse 2s ease-in-out infinite' };
    case 'dashed': return { border: `2px dashed ${primaryColor}30` };
    default: return {};
  }
}

// =================== MAIN PREVIEW ===================

export default function BioPreview({ config, realViews }: { config: BioConfig; realViews?: number }) {
  const { theme, effects, socials, customLinks, music, stats } = config;

  // Font import
  const fontUrl = `https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700;900&display=swap`;

  // Background style
  const bgStyle: React.CSSProperties = {};
  if (theme.bgType === 'solid') {
    bgStyle.backgroundColor = theme.bgColor1;
  } else if (theme.bgType === 'gradient') {
    bgStyle.background = `linear-gradient(135deg, ${theme.bgColor1} 0%, ${theme.bgColor2} 100%)`;
  } else if (theme.bgType === 'image') {
    bgStyle.backgroundImage = `url(${theme.bgImageUrl})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  // Entrance animation
  const getEntranceClass = () => {
    const anim = effects.entranceAnimation;
    if (anim === 'none') return '';
    return `bio-entrance-${anim}`;
  };

  const getEntranceDelay = (index: number) => ({
    animationDelay: `${index * 0.1}s`,
    animationFillMode: 'both' as const,
  });

  // Glow shadow
  const glowShadow = theme.glowEnabled
    ? `0 0 ${theme.glowIntensity}px ${theme.glowColor}44, 0 0 ${theme.glowIntensity * 2}px ${theme.glowColor}22`
    : 'none';

  // Layout-specific classes
  const getLayoutClasses = () => {
    switch (config.layoutPreset) {
      case 'left-aligned': return 'items-start text-left';
      case 'card': return 'items-center';
      case 'minimal': return 'items-center';
      case 'hero': return 'items-center';
      default: return 'items-center';
    }
  };

  // Glassmorphism card style
  const glassCardStyle: React.CSSProperties = config.glassmorphism?.enabled ? {
    backdropFilter: `blur(${config.glassmorphism.blur}px)`,
    WebkitBackdropFilter: `blur(${config.glassmorphism.blur}px)`,
    backgroundColor: `rgba(255,255,255,${config.glassmorphism.opacity / 100})`,
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: `${theme.borderRadius}px`,
    padding: config.layoutPreset === 'card' ? '2rem' : undefined,
  } : {};

  // Cursor style
  const cursorStyle = effects.customCursor !== 'default' ? { cursor: effects.customCursor } : {};

  return (
    <>
      {/* Font & Keyframes */}
      <style>{`
        @import url('${fontUrl}');
        
        @keyframes bio-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes bio-snowfall {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(calc(100vh + 10px)) rotate(360deg); }
        }
        
        @keyframes bio-rainfall {
          0% { transform: translateY(-20px); }
          100% { transform: translateY(calc(100vh + 20px)); }
        }
        
        @keyframes bio-firefly {
          0%, 100% { opacity: 0; transform: translate(0, 0); }
          25% { opacity: 0.8; transform: translate(15px, -10px); }
          50% { opacity: 0.3; transform: translate(-10px, 15px); }
          75% { opacity: 0.9; transform: translate(10px, -5px); }
        }
        
        @keyframes bio-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px ${theme.primaryColor}44, 0 0 40px ${theme.primaryColor}22; }
          50% { box-shadow: 0 0 30px ${theme.primaryColor}66, 0 0 60px ${theme.primaryColor}33; }
        }
        
        @keyframes bio-rotate-border {
          0% { --angle: 0deg; }
          100% { --angle: 360deg; }
        }
        
        @keyframes bio-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bio-glitch {
          0%, 100% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(20% 0 30% 0); transform: translateX(-2px); }
          40% { clip-path: inset(50% 0 10% 0); transform: translateX(2px); }
          60% { clip-path: inset(10% 0 60% 0); transform: translateX(-1px); }
          80% { clip-path: inset(40% 0 20% 0); transform: translateX(1px); }
        }
        
        @keyframes bio-text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bio-neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 0 0 7px ${theme.primaryColor}, 0 0 10px ${theme.primaryColor}, 0 0 21px ${theme.primaryColor};
            opacity: 1;
          }
          20%, 24%, 55% { text-shadow: none; opacity: 0.8; }
        }
        
        @keyframes bio-typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes bio-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bio-scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bio-slide-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes bio-glitch-in {
          0% { opacity: 0; transform: translateX(-5px); filter: blur(4px); }
          20% { opacity: 0.5; transform: translateX(3px); filter: blur(2px); }
          40% { opacity: 0.7; transform: translateX(-2px); filter: blur(1px); }
          60% { opacity: 0.9; transform: translateX(1px); filter: blur(0); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }

        @keyframes bio-border-pulse {
          0%, 100% { border-color: ${theme.primaryColor}40; }
          50% { border-color: ${theme.primaryColor}80; }
        }
        
        .bio-avatar-glow-pulse { animation: bio-glow-pulse 3s ease-in-out infinite; }
        
        .bio-avatar-rotate-border {
          background: conic-gradient(from var(--angle, 0deg), ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor}, ${theme.primaryColor});
          padding: 3px;
          animation: bio-rotate-border 3s linear infinite;
        }
        
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        
        .bio-avatar-glitch { animation: bio-glitch 3s ease-in-out infinite; }
        .bio-avatar-breathe { animation: bio-breathe 4s ease-in-out infinite; }
        
        .bio-text-gradient {
          background: linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor}, ${theme.primaryColor});
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bio-text-gradient 4s ease infinite;
        }
        
        .bio-text-glitch { animation: bio-glitch 2s ease-in-out infinite; }
        .bio-text-neon { animation: bio-neon-flicker 3s ease-in-out infinite; color: ${theme.primaryColor}; }
        
        .bio-text-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: bio-typewriter 2s steps(30) forwards;
          border-right: 2px solid ${theme.primaryColor};
        }
        
        .bio-entrance-fade-up { animation: bio-fade-up 0.6s ease-out; }
        .bio-entrance-scale { animation: bio-scale-in 0.6s ease-out; }
        .bio-entrance-slide-left { animation: bio-slide-left 0.6s ease-out; }
        .bio-entrance-glitch-in { animation: bio-glitch-in 0.8s ease-out; }
        
        .bio-link-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3), ${glowShadow !== 'none' ? `0 0 20px ${theme.primaryColor}33` : '0 0 0 transparent'};
        }
        
        ${config.customCss}
      `}</style>

      <div
        className="bio-page relative w-full h-full overflow-y-auto overflow-x-hidden"
        style={{
          ...bgStyle,
          ...cursorStyle,
          fontFamily: `'${theme.fontFamily}', system-ui, sans-serif`,
        }}
      >
        {/* Background Overlay */}
        {config.backgroundOverlay?.enabled && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{ backgroundColor: config.backgroundOverlay.color, opacity: config.backgroundOverlay.opacity / 100 }}
          />
        )}

        {/* Background Effect */}
        {effects.bgEffect !== 'none' && (
          <BgEffectRenderer
            effect={effects.bgEffect}
            color={effects.bgEffectColor}
            intensity={effects.bgEffectIntensity}
          />
        )}

        {/* Banner */}
        {config.bannerUrl && (
          <div
            className={`w-full relative ${getEntranceClass()}`}
            style={{
              ...getEntranceDelay(0),
              height: `${config.bannerHeight || 200}px`,
              zIndex: 5,
            }}
          >
            <img
              src={config.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
              style={{ borderRadius: config.layoutPreset === 'card' ? `${theme.borderRadius}px ${theme.borderRadius}px 0 0` : 0 }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
          </div>
        )}

        {/* Content */}
        <div
          className={`relative z-10 flex flex-col ${getLayoutClasses()} px-6 py-12 max-w-md mx-auto min-h-full`}
          style={config.layoutPreset === 'card' ? glassCardStyle : {}}
        >
          {/* Status Indicator */}
          {config.statusIndicator?.enabled && (
            <div
              className={`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full ${getEntranceClass()}`}
              style={{
                ...getEntranceDelay(0),
                backgroundColor: `${config.statusIndicator.color}15`,
                border: `1px solid ${config.statusIndicator.color}30`,
              }}
            >
              <span className="text-sm">{config.statusIndicator.emoji}</span>
              <span className="text-[11px] font-medium" style={{ color: config.statusIndicator.color }}>{config.statusIndicator.text}</span>
            </div>
          )}

          {/* Language Tag */}
          {config.languageTag && (
            <div
              className={`mb-3 px-2 py-0.5 rounded text-[8px] uppercase tracking-[0.3em] font-bold ${getEntranceClass()}`}
              style={{
                ...getEntranceDelay(0),
                backgroundColor: `${theme.primaryColor}10`,
                border: `1px solid ${theme.primaryColor}20`,
                color: theme.primaryColor,
              }}
            >
              {config.languageTag}
            </div>
          )}

          {/* Avatar */}
          <div
            className={`${getEntranceClass()} ${getAvatarStyle(effects.avatarEffect)} mb-5`}
            style={{ ...getEntranceDelay(1), ...getBorderProps(config.borderStyle, theme.primaryColor) }}
          >
            <div
              className="w-24 h-24 overflow-hidden flex items-center justify-center text-3xl font-bold"
              style={{
                ...getProfileShapeStyle(config.profileShape),
                borderColor: theme.primaryColor + '60',
                border: config.borderStyle === 'none' ? `2px solid ${theme.primaryColor}60` : undefined,
                boxShadow: theme.glowEnabled ? `0 0 25px ${theme.glowColor}44` : 'none',
                backgroundColor: `${theme.primaryColor}15`,
                color: theme.primaryColor,
              }}
            >
              {config.avatarUrl ? (
                <img src={config.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                config.displayName?.[0]?.toUpperCase() || '?'
              )}
            </div>
          </div>

          {/* Display Name */}
          <h1
            className={`text-2xl font-bold mb-1 ${getEntranceClass()} ${getTextClass(effects.textEffect)}`}
            style={{
              ...getEntranceDelay(2),
              color: effects.textEffect === 'gradient' || effects.textEffect === 'neon-flicker' ? undefined : 'white',
            }}
          >
            {config.displayName || 'Username'}
          </h1>

          {/* Username & Pronouns */}
          <p
            className={`text-sm mb-2 ${getEntranceClass()}`}
            style={{
              ...getEntranceDelay(3),
              color: `${theme.primaryColor}aa`,
            }}
          >
            @{config.username || 'username'}
            {config.pronouns && (
              <span className="ml-2 opacity-50">• {config.pronouns}</span>
            )}
          </p>

          {/* Badges */}
          {config.badges.length > 0 && (
            <div
              className={`flex flex-wrap ${config.layoutPreset === 'left-aligned' ? 'justify-start' : 'justify-center'} gap-1.5 mb-4 ${getEntranceClass()}`}
              style={getEntranceDelay(4)}
            >
              {config.badges.map((badge, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold"
                  style={{
                    borderRadius: `${theme.borderRadius / 2}px`,
                    backgroundColor: `${theme.primaryColor}15`,
                    border: `1px solid ${theme.primaryColor}30`,
                    color: theme.primaryColor,
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          <p
            className={`${config.layoutPreset === 'left-aligned' ? 'text-left' : 'text-center'} text-sm mb-6 max-w-[280px] ${getEntranceClass()} ${config.typingBio ? 'bio-text-typewriter' : ''}`}
            style={{
              ...getEntranceDelay(5),
              color: 'rgba(255,255,255,0.5)',
              lineHeight: '1.6',
            }}
          >
            {config.bio || 'Your bio goes here...'}
          </p>

          {/* Stats */}
          {(stats.showViews || stats.showJoinDate || stats.customStats.length > 0) && (
            <div
              className={`flex flex-wrap ${config.layoutPreset === 'left-aligned' ? 'justify-start' : 'justify-center'} gap-6 mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(6)}
            >
              {stats.showViews && (
                <div className="flex items-center gap-1.5">
                  <Eye size={13} style={{ color: theme.primaryColor }} />
                  <span className="text-xs font-semibold text-white/70">{realViews !== undefined ? realViews.toLocaleString() : '1,337'}</span>
                  <span className="text-[9px] uppercase tracking-wider text-white/30">views</span>
                </div>
              )}
              {stats.showJoinDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} style={{ color: theme.primaryColor }} />
                  <span className="text-xs font-semibold text-white/70">Mar 2026</span>
                </div>
              )}
              {stats.customStats.filter(s => s.label && s.value).map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-sm font-bold text-white/80">{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-wider text-white/30">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Social Icons */}
          {socials.filter(s => s.url).length > 0 && (
            <div
              className={`flex flex-wrap ${config.layoutPreset === 'left-aligned' ? 'justify-start' : 'justify-center'} gap-3 mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(7)}
            >
              {socials.filter(s => s.url).map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: `${theme.primaryColor}10`,
                    border: `1px solid ${theme.primaryColor}25`,
                    color: theme.primaryColor,
                  }}
                >
                  <PlatformIcon platform={social.platform} size={16} />
                </a>
              ))}
            </div>
          )}

          {/* Custom Links */}
          {customLinks.filter(l => l.enabled && l.title).length > 0 && (
            <div
              className={`w-full space-y-3 mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(8)}
            >
              {customLinks.filter(l => l.enabled && l.title).map((link, i) => (
                <a
                  key={i}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bio-link-hover flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer group"
                  style={{
                    borderRadius: `${theme.borderRadius}px`,
                    backgroundColor: theme.cardStyle === 'glass' ? 'rgba(255,255,255,0.04)' :
                                     theme.cardStyle === 'solid' ? 'rgba(255,255,255,0.06)' :
                                     'transparent',
                    border: theme.cardStyle === 'neon'
                      ? `1px solid ${theme.primaryColor}40`
                      : theme.cardStyle === 'outline'
                        ? '2px solid rgba(255,255,255,0.12)'
                        : '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: theme.cardStyle === 'glass' ? 'blur(12px)' : 'none',
                    boxShadow: theme.cardStyle === 'neon' ? `0 0 15px ${theme.primaryColor}15` : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
                    >
                      <Link2 size={14} />
                    </div>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                      {link.title}
                    </span>
                  </div>
                  <ExternalLink size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                </a>
              ))}
            </div>
          )}

          {/* Timeline */}
          {config.timeline?.enabled && (config.timeline.items || []).filter(t => t.title).length > 0 && (
            <div
              className={`w-full mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(9)}
            >
              <h3 className="text-[9px] uppercase tracking-[0.25em] font-bold mb-4" style={{ color: `${theme.primaryColor}80` }}>
                Timeline
              </h3>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px" style={{ backgroundColor: `${theme.primaryColor}20` }} />
                {(config.timeline.items || []).filter(t => t.title).map((item, i) => (
                  <div key={i} className="relative mb-6 last:mb-0">
                    <div
                      className="absolute left-[-18px] top-1 w-3 h-3 rounded-full border-2"
                      style={{ borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}30` }}
                    />
                    {item.date && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={10} style={{ color: `${theme.primaryColor}60` }} />
                        <span className="text-[10px] font-mono" style={{ color: `${theme.primaryColor}60` }}>{item.date}</span>
                      </div>
                    )}
                    <h4 className="text-sm font-semibold text-white/80">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-white/40 mt-0.5">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {config.imageGallery?.enabled && (config.imageGallery.images || []).filter(img => img.url).length > 0 && (
            <div
              className={`w-full mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(10)}
            >
              <h3 className="text-[9px] uppercase tracking-[0.25em] font-bold mb-4" style={{ color: `${theme.primaryColor}80` }}>
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(config.imageGallery.images || []).filter(img => img.url).map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                    <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white/80">{img.caption}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Embed */}
          {config.embedVideo?.enabled && config.embedVideo.url && (
            <div
              className={`w-full mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(11)}
            >
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/[0.06]">
                <iframe
                  src={config.embedVideo.url.replace('watch?v=', 'embed/').split('&')[0]}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Music Player */}
          {music.enabled && music.url && (
            <div
              className={`w-full mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(12)}
            >
              {music.type === 'spotify' && music.url.includes('spotify.com') && (
                <iframe
                  src={music.url.replace('spotify.com/track/', 'spotify.com/embed/track/').split('?')[0]}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl opacity-80"
                />
              )}
              {music.type === 'custom' && (
                <div
                  className="flex items-center gap-3 p-4"
                  style={{
                    borderRadius: `${theme.borderRadius}px`,
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
                  >
                    <Music size={16} />
                  </div>
                  <audio controls className="flex-1 h-8 opacity-70" style={{ filter: 'invert(1)' }}>
                    <source src={music.url} />
                  </audio>
                </div>
              )}
            </div>
          )}

          {/* Discord Widget */}
          {config.discordWidget?.enabled && config.discordWidget.userId && (
            <div
              className={`w-full mb-8 flex items-center gap-3 p-4 rounded-xl ${getEntranceClass()}`}
              style={{
                ...getEntranceDelay(13),
                backgroundColor: 'rgba(88, 101, 242, 0.08)',
                border: '1px solid rgba(88, 101, 242, 0.15)',
              }}
            >
              <MessageCircle size={16} style={{ color: '#5865F2' }} />
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#5865F2]/80">Discord</div>
                <div className="text-xs text-white/60 font-mono">{config.discordWidget.userId}</div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            className={`mt-auto pt-8 text-center ${getEntranceClass()}`}
            style={getEntranceDelay(14)}
          >
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/15 font-bold">
              Powered by Sagitarius.cc
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
