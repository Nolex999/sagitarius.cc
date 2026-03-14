'use client';

import { useEffect, useRef } from 'react';
import {
  ExternalLink, Eye, Calendar, MessageCircle,
  Send, Github, Youtube, Twitch, Music, Gamepad2, Camera,
  Video, Mail, Globe, Link2, Hash
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

// Ghost icon for snapchat
function GhostIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} width={props.size} height={props.size}>
      <path d="M9 10h.01M15 10h.01M12 2a7 7 0 0 0-7 7v3c0 1.1-.9 2-2 2h0a1 1 0 0 0 0 2c1.5 0 2.5.8 3 1.5.5.8 1.5 1.5 3 1.5s2-.5 3-1.5c.5-.7 1.5-1.5 3-1.5a1 1 0 0 0 0-2h0a2 2 0 0 1-2-2V9a7 7 0 0 0-7-7z"/>
    </svg>
  );
}

// =================== BACKGROUND EFFECTS ===================

function ParticlesEffect({ color, intensity }: { color: string; intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const count = Math.floor((intensity / 100) * 80) + 10;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const animate = () => {
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

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color + Math.floor((1 - dist / 100) * 40).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [color, intensity]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function StarsEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 60) + 10;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: color,
            opacity: Math.random() * 0.7 + 0.1,
            animation: `bio-twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

function MatrixEffect({ color, intensity }: { color: string; intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = (intensity / 100) * 0.5;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
    };
  }, [color, intensity]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function SnowEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 50) + 10;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            backgroundColor: color,
            opacity: Math.random() * 0.6 + 0.2,
            animation: `bio-snowfall ${Math.random() * 5 + 5}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

function RainEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 60) + 15;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            width: `1px`,
            height: `${Math.random() * 20 + 10}px`,
            backgroundColor: color,
            opacity: Math.random() * 0.4 + 0.1,
            animation: `bio-rainfall ${Math.random() * 1 + 0.5}s linear infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

function FirefliesEffect({ color, intensity }: { color: string; intensity: number }) {
  const count = Math.floor((intensity / 100) * 25) + 5;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 5 + 3}px`,
            height: `${Math.random() * 5 + 3}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${Math.random() * 10 + 5}px ${color}, 0 0 ${Math.random() * 20 + 10}px ${color}`,
            opacity: 0,
            animation: `bio-firefly ${Math.random() * 4 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

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

function getAvatarStyle(effect: string, glowColor: string): string {
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



// =================== MAIN PREVIEW ===================

export default function BioPreview({ config }: { config: BioConfig }) {
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

  // Entrance animation classes
  const getEntranceClass = (delay: number = 0) => {
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
          25% { opacity: 0.8; transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px); }
          50% { opacity: 0.3; transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px); }
          75% { opacity: 0.9; transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px); }
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
        
        .bio-avatar-glow-pulse {
          animation: bio-glow-pulse 3s ease-in-out infinite;
        }
        
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
        
        .bio-avatar-glitch {
          animation: bio-glitch 3s ease-in-out infinite;
        }
        
        .bio-avatar-breathe {
          animation: bio-breathe 4s ease-in-out infinite;
        }
        
        .bio-text-gradient {
          background: linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor}, ${theme.primaryColor});
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bio-text-gradient 4s ease infinite;
        }
        
        .bio-text-glitch {
          animation: bio-glitch 2s ease-in-out infinite;
        }
        
        .bio-text-neon {
          animation: bio-neon-flicker 3s ease-in-out infinite;
          color: ${theme.primaryColor};
        }
        
        .bio-text-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: bio-typewriter 2s steps(30) forwards;
          border-right: 2px solid ${theme.primaryColor};
        }
        
        .bio-entrance-fade-up {
          animation: bio-fade-up 0.6s ease-out;
        }
        
        .bio-entrance-scale {
          animation: bio-scale-in 0.6s ease-out;
        }
        
        .bio-entrance-slide-left {
          animation: bio-slide-left 0.6s ease-out;
        }
        
        .bio-entrance-glitch-in {
          animation: bio-glitch-in 0.8s ease-out;
        }
        
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
          fontFamily: `'${theme.fontFamily}', system-ui, sans-serif`,
        }}
      >
        {/* Background Effect */}
        {effects.bgEffect !== 'none' && (
          <BgEffectRenderer
            effect={effects.bgEffect}
            color={effects.bgEffectColor}
            intensity={effects.bgEffectIntensity}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 py-12 max-w-md mx-auto min-h-full">
          
          {/* Avatar */}
          <div
            className={`${getEntranceClass()} ${getAvatarStyle(effects.avatarEffect, theme.primaryColor)} mb-5`}
            style={getEntranceDelay(0)}
          >
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center text-3xl font-bold"
              style={{
                borderColor: theme.primaryColor + '60',
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
              ...getEntranceDelay(1),
              color: effects.textEffect === 'gradient' || effects.textEffect === 'neon-flicker' ? undefined : 'white',
            }}
          >
            {config.displayName || 'Username'}
          </h1>

          {/* Username & Pronouns */}
          <p
            className={`text-sm mb-2 ${getEntranceClass()}`}
            style={{
              ...getEntranceDelay(2),
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
              className={`flex flex-wrap justify-center gap-1.5 mb-4 ${getEntranceClass()}`}
              style={getEntranceDelay(3)}
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
            className={`text-center text-sm mb-6 max-w-[280px] ${getEntranceClass()}`}
            style={{
              ...getEntranceDelay(4),
              color: 'rgba(255,255,255,0.5)',
              lineHeight: '1.6',
            }}
          >
            {config.bio || 'Your bio goes here...'}
          </p>

          {/* Stats */}
          {(stats.showViews || stats.showJoinDate || stats.customStats.length > 0) && (
            <div
              className={`flex flex-wrap justify-center gap-6 mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(5)}
            >
              {stats.showViews && (
                <div className="flex items-center gap-1.5">
                  <Eye size={13} style={{ color: theme.primaryColor }} />
                  <span className="text-xs font-semibold text-white/70">1,337</span>
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
              className={`flex flex-wrap justify-center gap-3 mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(6)}
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
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = `${theme.primaryColor}25`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${theme.primaryColor}33`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = `${theme.primaryColor}10`;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
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
              style={getEntranceDelay(7)}
            >
              {customLinks.filter(l => l.enabled && l.title).map((link, i) => (
                <a
                  key={i}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bio-link-hover flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer group`}
                  style={{
                    borderRadius: `${theme.borderRadius}px`,
                    backgroundColor: theme.cardStyle === 'glass' ? 'rgba(255,255,255,0.04)' :
                                     theme.cardStyle === 'solid' ? 'rgba(255,255,255,0.06)' :
                                     'transparent',
                    border: theme.cardStyle === 'neon'
                      ? `1px solid ${theme.primaryColor}40`
                      : theme.cardStyle === 'outline'
                        ? `2px solid rgba(255,255,255,0.12)`
                        : `1px solid rgba(255,255,255,0.08)`,
                    backdropFilter: theme.cardStyle === 'glass' ? 'blur(12px)' : 'none',
                    boxShadow: theme.cardStyle === 'neon' ? `0 0 15px ${theme.primaryColor}15` : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${theme.primaryColor}15`,
                        color: theme.primaryColor,
                      }}
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

          {/* Music Player */}
          {music.enabled && music.url && (
            <div
              className={`w-full mb-8 ${getEntranceClass()}`}
              style={getEntranceDelay(8)}
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

          {/* Footer */}
          <div
            className={`mt-auto pt-8 text-center ${getEntranceClass()}`}
            style={getEntranceDelay(9)}
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
