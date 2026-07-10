'use client';

import { useState, useEffect, useRef, useCallback, type ReactElement } from 'react';
import type { FreedomConfig, ImageLayer } from './FreedomCanvas';

export default function FreedomViewer({ config, initialViews = 0 }: { config: FreedomConfig; initialViews?: number }) {
  const cfg = config;
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    objectFit: cfg.videoFit,
    objectPosition: cfg.videoPosition === 'center' ? 'center' : cfg.videoPosition === 'top' ? 'top' : 'bottom',
  };

  useEffect(() => {
    if (!audioRef.current || !cfg.audioUrl) return;
    audioRef.current.volume = cfg.audioVolume / 100;
    if (audioStarted) audioRef.current.play().catch(() => {});
  }, [cfg.audioUrl, cfg.audioVolume, audioStarted]);

  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (v) { v.muted = false; v.play(); }
    if (a && cfg.audioUrl) { a.volume = cfg.audioVolume / 100; a.play().catch(() => {}); }
    setAudioStarted(true);
  }, [cfg.audioUrl, cfg.audioVolume]);

  useEffect(() => {
    if (!cfg.audioUrl && !cfg.videoUrl) return;
    document.addEventListener('click', tryPlay);
    document.addEventListener('touchstart', tryPlay);
    return () => {
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
  }, [tryPlay, cfg.audioUrl, cfg.videoUrl]);

  return (
    <>
      <style>{`
        @keyframes float-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulse-glow { 0%,100% { text-shadow: 0 0 20px ${cfg.primaryColor}44; } 50% { text-shadow: 0 0 40px ${cfg.primaryColor}88; } }
        @keyframes sound-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.08); } 50% { box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
        @keyframes reveal-fade { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes reveal-glow { 0%,100% { text-shadow: 0 0 20px ${cfg.revealAccentColor}44; } 50% { text-shadow: 0 0 40px ${cfg.revealAccentColor}88, 0 0 80px ${cfg.revealAccentColor}44; } }
        @keyframes reveal-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes reveal-rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .reveal-anim-rainbow {
          background: linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0000);
          background-size: 400% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: reveal-rainbow 6s ease infinite;
        }
        @keyframes reveal-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes reveal-slide-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        .reveal-anim-fade { animation: reveal-fade 1.2s ease-out both; }
        .reveal-anim-pulse { animation: sound-pulse 2s ease-in-out infinite; }
        .reveal-anim-glow { animation: reveal-glow 2s ease-in-out infinite; }
        .reveal-anim-shimmer {
          background: linear-gradient(90deg, transparent 0%, ${cfg.revealAccentColor} 50%, transparent 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: reveal-shimmer 2s linear infinite;
        }
        .reveal-anim-bounce { animation: reveal-bounce 1.5s ease-in-out infinite; }
        .reveal-anim-slide-up { animation: reveal-slide-up 0.8s ease-out both; }
        .sound-btn { animation: sound-pulse 2s ease-in-out infinite; }
        .lyrics-fade { animation: reveal-fade 0.4s ease-out both; }
        .lyrics-slide { animation: reveal-slide-up 0.4s ease-out both; }
        .lyrics-rainbow {
          background: linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0000);
          background-size: 400% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: reveal-rainbow 6s ease infinite;
        }
        @keyframes img-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes img-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
        @keyframes img-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes img-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes img-rainbow { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .img-anim-spin { animation: img-spin var(--speed) linear infinite; }
        .img-anim-pulse { animation: img-pulse var(--speed) ease-in-out infinite; }
        .img-anim-float { animation: img-float var(--speed) ease-in-out infinite; }
        .img-anim-bounce { animation: img-bounce var(--speed) ease-in-out infinite; }
        .img-anim-rainbow { animation: img-rainbow var(--speed) linear infinite; }
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
        .freedom-delay-1 { animation-delay: 0.15s; }
        .freedom-delay-2 { animation-delay: 0.3s; }
        .freedom-delay-3 { animation-delay: 0.45s; }
        .freedom-delay-4 { animation-delay: 0.6s; }
        .freedom-delay-5 { animation-delay: 0.75s; }
      `}</style>

      <div className="relative w-full h-screen overflow-hidden bg-black">
        {cfg.videoUrl && (
          <video
            ref={videoRef}
            src={cfg.videoUrl}
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full"
            style={videoStyle}
          />
        )}
        {!cfg.videoUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
        )}

        {cfg.blurBg < 1 && (
          <div className="absolute inset-0 bg-black/20 z-[1]" />
        )}

        {/* Background effect */}
        {cfg.bgEffect !== 'none' && (
          <BgEffectView effect={cfg.bgEffect} color={cfg.bgEffectColor} intensity={cfg.bgEffectIntensity} />
        )}

        {/* Overlay effect */}
        {cfg.overlay !== 'none' && (
          <div className={`absolute inset-0 z-10 pointer-events-none overlay-${cfg.overlay}`} />
        )}

        {/* Reveal screen */}
        {cfg.revealEnabled && !audioStarted && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
            onClick={tryPlay}
            style={{
              backgroundColor: cfg.revealBgColor + 'd9',
              backdropFilter: `blur(${cfg.revealBgBlur}px)`,
              WebkitBackdropFilter: `blur(${cfg.revealBgBlur}px)`,
            }}
          >
            {cfg.badgeEnabled && (
              <div className="reveal-anim-slide-up flex items-center gap-2 px-4 py-2 rounded-xl mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily: cfg.badgeFont, fontSize: `${cfg.badgeSize + 4}px`, color: cfg.primaryColor, fontWeight: 600 }}>
                  {cfg.badgeText || 'user'}
                </span>
                <span style={{ fontFamily: cfg.badgeFont, fontSize: `${cfg.badgeSize * 0.7}px`, color: cfg.primaryColor + '66' }}>#1</span>
              </div>
            )}
            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl ${cfg.revealAnimation !== 'shimmer' ? 'reveal-anim-' + cfg.revealAnimation : ''}`} style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              {cfg.revealAnimation !== 'shimmer' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={cfg.revealAnimation === 'rainbow' ? '#fff' : cfg.primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
              <span
                className={`text-base font-medium ${cfg.revealAnimation === 'shimmer' ? 'reveal-anim-shimmer' : ''} ${cfg.revealAnimation === 'rainbow' ? 'reveal-anim-rainbow' : ''}`}
                style={{ fontFamily: cfg.revealFont, fontSize: `${cfg.revealTextSize}px`, color: cfg.primaryColor + 'dd' }}
              >
                {cfg.revealText || 'Tap anywhere to enter'}
              </span>
            </div>
          </div>
        )}

        {/* Badge */}
        {cfg.badgeEnabled && audioStarted && (
          <div className="fixed top-4 left-4 z-30" style={{ fontFamily: cfg.badgeFont }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <span style={{ fontSize: `${cfg.badgeSize}px`, color: cfg.primaryColor, fontWeight: 600 }}>{cfg.badgeText || 'user'}</span>
              <span style={{ fontSize: `${cfg.badgeSize * 0.7}px`, color: cfg.primaryColor + '66' }}>#1</span>
            </div>
          </div>
        )}

        {/* Content card */}
        {audioStarted && cfg.showContent && (
          <div
            className={`absolute z-20 w-full px-6 pointer-events-none ${cfg.layout === 'left' ? 'left-0 text-left' : cfg.layout === 'right' ? 'right-0 text-left' : 'left-1/2 -translate-x-1/2 text-center'} ${cfg.verticalPos === 'top' ? 'top-12' : cfg.verticalPos === 'bottom' ? 'bottom-12' : 'top-1/2 -translate-y-1/2'}`}
          >
            <div className={`max-w-md w-full mx-auto p-8 rounded-2xl ${cfg.showCardBg ? '' : 'bg-transparent'}`}
              style={cfg.showCardBg ? { backgroundColor: `rgba(0,0,0,${cfg.cardOpacity / 100})`, backdropFilter: `blur(${cfg.cardBlur}px)`, WebkitBackdropFilter: `blur(${cfg.cardBlur}px)` } : {}}
            >
              {cfg.showAvatar && cfg.avatarUrl && (
                <div className={`freedom-enter ${cfg.layout !== 'centered' ? 'freedom-delay-1' : ''}`}>
                  <img src={cfg.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2" style={{ borderColor: cfg.primaryColor + '33' }} />
                </div>
              )}
              {cfg.displayName && (
                <h1 className={`freedom-enter ${cfg.showAvatar ? 'freedom-delay-1' : ''} ${cfg.nameAnimation === 'glow' ? 'name-anim-glow' : cfg.nameAnimation === 'shimmer' ? 'name-anim-shimmer' : ''}`}
                  style={{ fontFamily: cfg.fontFamily, fontSize: `${cfg.nameSize}px`, fontWeight: cfg.nameWeight, letterSpacing: `${cfg.nameSpacing}px`, color: cfg.primaryColor, textShadow: cfg.nameShadow ? `0 0 30px ${cfg.nameShadowColor}66` : 'none' }}>
                  {cfg.displayName}
                </h1>
              )}
              {cfg.bioText && (
                <p className={`freedom-enter ${cfg.displayName ? 'freedom-delay-2' : ''} mt-3 text-sm leading-relaxed`} style={{ fontFamily: cfg.fontFamily, color: cfg.primaryColor + 'aa' }}>
                  {cfg.bioText}
                </p>
              )}
              {cfg.customLinks.length > 0 && (
                <div className={`freedom-enter ${cfg.displayName || cfg.bioText ? 'freedom-delay-3' : ''} mt-5 space-y-2 pointer-events-auto`}>
                  {cfg.customLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: cfg.accentColor + '15', color: cfg.primaryColor, border: `1px solid ${cfg.accentColor}25` }}>
                      <span className="flex-1">{link.label}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
              {cfg.socialLinks.filter(s => s.url).length > 0 && (
                <div className={`freedom-enter ${cfg.customLinks.length > 0 ? 'freedom-delay-4' : 'freedom-delay-3'} mt-5 flex flex-wrap justify-center gap-2 pointer-events-auto`}>
                  {cfg.socialLinks.filter(s => s.url).map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                      style={{ backgroundColor: cfg.accentColor + '15', color: cfg.primaryColor, border: `1px solid ${cfg.accentColor}20` }}>
                      <SocialIcon platform={s.platform} size={16} />
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

        {/* Lyrics */}
        {cfg.lyricsEnabled && audioStarted && (
          <LyricsDisplayView config={cfg} audioRef={audioRef} />
        )}

        {/* Image Layers */}
        {cfg.imageLayers.filter(l => l.enabled && l.url).map(layer => (
          <ImageLayerDisplayView key={layer.id} layer={layer} />
        ))}

        {/* View count top-right */}
        <div className="fixed top-4 right-4 z-30 flex items-center gap-1.5 px-3 h-10 rounded-xl text-[11px] font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: cfg.primaryColor + 'aa' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{initialViews}</span>
        </div>
      </div>

      {cfg.customCss && <style>{cfg.customCss}</style>}
    </>
  );
}

// ====== SUB-COMPONENTS ======

function BgEffectView({ effect, color, intensity }: { effect: string; color: string; intensity: number }) {
  if (effect === 'particles') {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      c.width = window.innerWidth; c.height = window.innerHeight;
      const pts: { x: number; y: number; vx: number; vy: number }[] = [];
      const count = Math.round(intensity * 0.5);
      for (let i = 0; i < count; i++) pts.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 });
      let anim: number;
      const draw = () => {
        ctx.clearRect(0, 0, c.width, c.height);
        pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > c.width) p.vx *= -1; if (p.y < 0 || p.y > c.height) p.vy *= -1; ctx.fillStyle = color + '66'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill(); });
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 120) { ctx.strokeStyle = color + Math.round((1 - d / 120) * 20).toString(16).padStart(2, '0'); ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); } }
        anim = requestAnimationFrame(draw);
      };
      draw();
      return () => cancelAnimationFrame(anim);
    }, [effect, color, intensity]);
    return <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />;
  }
  if (effect === 'stars') {
    const count = Math.round(intensity * 0.6);
    return <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">{Array.from({ length: count }).map((_, i) => (
      <div key={i} className="absolute w-0.5 h-0.5 rounded-full animate-ping" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, backgroundColor: color, animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 3}s`, opacity: 0.3 + Math.random() * 0.7 }} />
    ))}</div>;
  }
  if (effect === 'snow') {
    const count = Math.round(intensity * 0.8);
    return <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">{Array.from({ length: count }).map((_, i) => (
      <div key={i} className="absolute rounded-full" style={{ left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}%`, width: `${2 + Math.random() * 4}px`, height: `${2 + Math.random() * 4}px`, backgroundColor: '#ffffff66', animation: `snow-fall ${5 + Math.random() * 10}s linear infinite`, animationDelay: `${Math.random() * 5}s`, opacity: 0.3 + Math.random() * 0.7 }} />
    ))}</div>;
  }
  if (effect === 'rain') {
    const count = Math.round(intensity * 1.5);
    return <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">{Array.from({ length: count }).map((_, i) => (
      <div key={i} className="absolute" style={{ left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}%`, width: '1px', height: `${10 + Math.random() * 20}px`, backgroundColor: color + '44', animation: `rain-fall ${0.3 + Math.random() * 0.5}s linear infinite`, animationDelay: `${Math.random() * 0.5}s` }} />
    ))}</div>;
  }
  return null;
}

function SocialIcon({ platform, size }: { platform: string; size: number }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const icons: Record<string, ReactElement> = {
    discord: <svg {...props}><path d="M18.58 5.45A13.87 13.87 0 0 0 12 3a13.87 13.87 0 0 0-6.58 2.45A1.14 1.14 0 0 0 5 6.2a13.42 13.42 0 0 0-.73 11.07.48.48 0 0 0 .17.22 13.72 13.72 0 0 0 4.17 2.1.53.53 0 0 0 .57-.2 9.84 9.84 0 0 0 .76-1.24.5.5 0 0 0-.27-.69A9.01 9.01 0 0 1 7.1 16a.51.51 0 0 1-.05-.86 8.76 8.76 0 0 0 .87-.63.5.5 0 0 1 .52-.08 10.3 10.3 0 0 0 6.7 0 .5.5 0 0 1 .52.08 8.76 8.76 0 0 0 .87.63.5.5 0 0 1-.04.86 9 9 0 0 1-2.57.78.5.5 0 0 0-.27.7 9.84 9.84 0 0 0 .76 1.24.53.53 0 0 0 .57.2 13.72 13.72 0 0 0 4.17-2.1.48.48 0 0 0 .17-.22 13.42 13.42 0 0 0-.73-11.07.92.92 0 0 0-.62-.7z"/><circle cx="8.5" cy="10.5" r="1"/><circle cx="15.5" cy="10.5" r="1"/></svg>,
    telegram: <svg {...props}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,
    twitter: <svg {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
    github: <svg {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
    youtube: <svg {...props}><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/><rect x="2" y="3" width="20" height="18" rx="2" ry="2"/></svg>,
    twitch: <svg {...props}><path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7"/></svg>,
    spotify: <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M8.56 16.3c.23-.34.57-.4.9-.23.67.28 1.44.45 2.54.45 1.1 0 1.87-.17 2.54-.45.33-.17.67-.11.9.23.24.35.17.7-.16.9-.78.4-1.79.62-3.28.62-1.49 0-2.5-.22-3.28-.62-.33-.2-.4-.55-.16-.9z"/><path d="M7.26 13.93c.27-.4.67-.5 1.07-.27.76.46 1.94.7 3.67.7 1.73 0 2.91-.24 3.67-.7.4-.23.8-.13 1.07.27.27.4.17.8-.23 1.07-1.02.6-2.5.86-4.5.86-2 0-3.48-.26-4.5-.86-.4-.27-.5-.67-.23-1.07z"/><path d="M5.98 11.46c.33-.47.82-.6 1.3-.34.87.53 2.35.8 4.02.8 1.67 0 3.15-.27 4.02-.8.48-.26.97-.13 1.3.34.33.47.2.97-.28 1.27C15.67 12.86 13.9 13.2 12 13.2c-1.9 0-3.67-.34-5.04-1.01-.48-.3-.6-.8-.28-1.27z"/></svg>,
    instagram: <svg {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r=".5"/></svg>,
    tiktok: <svg {...props}><path d="M9 12a4 4 0 1 0 4 4V4h5"/></svg>,
    snapchat: <svg {...props}><path d="M18 8.5A6 6 0 0 0 6 8.5c0 4.5-1 6-1 6l3 1.5"/><path d="M12 20c-1.5 0-3-.5-4.5-1.5"/><path d="M18 14.5s-1-1.5-1-6"/></svg>,
    reddit: <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="10.5" r="1.5"/><circle cx="15.5" cy="10.5" r="1.5"/><path d="M8.5 15.5c1.5 1.5 3.5 2 5.5 0"/></svg>,
    soundcloud: <svg {...props}><path d="M3 13.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h.5A.5.5 0 0 0 4 18v-4a.5.5 0 0 0-.5-.5H3zM6 12a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 6.5 12H6zM9 10.5a.5.5 0 0 0-.5.5v6.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5V11a.5.5 0 0 0-.5-.5H9z"/><path d="M12 9a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 12.5 9H12zM15 10a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H15zM18 11.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5H18z"/></svg>,
  };
  return icons[platform] || <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
}

function LyricsDisplayView({ config, audioRef }: { config: FreedomConfig; audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    if (!config.lyricsEnabled) return;
    if (config.lyricsSource === 'url' && config.lyricsUrl) {
      fetch(config.lyricsUrl).then(r => r.text()).then(t => setLyrics(parseLRC(t))).catch(() => {});
    } else if (config.lyricsSource === 'inline' && config.lyricsText) {
      setLyrics(parseLRC(config.lyricsText));
    }
  }, [config.lyricsEnabled, config.lyricsSource, config.lyricsUrl, config.lyricsText]);

  useEffect(() => {
    if (!lyrics.length || !audioRef.current) return;
    const audio = audioRef.current;
    let raf: number;
    const tick = () => {
      const ct = audio.currentTime;
      let idx = -1;
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (ct >= lyrics[i].time) { idx = i; break; }
      }
      setActiveIdx(idx);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lyrics, audioRef]);

  if (!lyrics.length) return null;

  const animClass = config.lyricsAnimation === 'fade' ? 'lyrics-fade' : config.lyricsAnimation === 'slide' ? 'lyrics-slide' : '';

  return (
    <div className="fixed pointer-events-none" style={{
      left: `${config.lyricsPosX}%`, top: `${config.lyricsPosY}%`,
      transform: 'translate(-50%, -50%)',
      maxWidth: config.lyricsMaxWidth, width: '100%',
      textAlign: config.lyricsAlign,
      fontFamily: config.lyricsFont, fontSize: `${config.lyricsSize}px`,
      fontWeight: config.lyricsWeight, zIndex: 25,
      padding: '12px 20px', borderRadius: '12px',
      backgroundColor: config.lyricsBgColor + Math.round(config.lyricsBgBlur * 0.3).toString(16).padStart(2, '0'),
      backdropFilter: `blur(${config.lyricsBgBlur}px)`,
      WebkitBackdropFilter: `blur(${config.lyricsBgBlur}px)`,
    }}>
      {lyrics.map((line, i) => (
        <div key={i} className={i === activeIdx ? animClass : ''} style={{
          color: i === activeIdx ? (config.lyricsAnimation === 'rainbow' ? 'transparent' : config.lyricsActiveColor) : config.lyricsColor + '88',
          fontWeight: i === activeIdx ? config.lyricsWeight + 200 : config.lyricsWeight,
          fontSize: i === activeIdx ? `${config.lyricsSize * 1.1}px` : `${config.lyricsSize}px`,
          transition: 'all 0.3s ease', marginBottom: '4px', whiteSpace: 'pre-wrap',
          ...(i === activeIdx && config.lyricsAnimation === 'rainbow' ? { background: 'linear-gradient(90deg,#ff0000,#ff8800,#ffff00,#00ff00,#0088ff,#8800ff,#ff0000)', backgroundSize: '400% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'reveal-rainbow 6s ease infinite' } : {}),
        }}>{line.text}</div>
      ))}
    </div>
  );
}

function parseLRC(text: string): { time: number; text: string }[] {
  const lines = text.split('\n');
  const result: { time: number; text: string }[] = [];
  const regex = /\[(\d+):(\d+(?:\.\d+)?)\]/;
  for (const line of lines) {
    const match = line.match(regex);
    if (!match) continue;
    const mins = parseInt(match[1]);
    const secs = parseFloat(match[2]);
    const time = mins * 60 + secs;
    const text = line.replace(regex, '').trim();
    if (text) result.push({ time, text });
  }
  result.sort((a, b) => a.time - b.time);
  return result;
}

function ImageLayerDisplayView({ layer }: { layer: ImageLayer }) {
  const animClass = layer.animation !== 'none' ? `img-anim-${layer.animation}` : '';
  return (
    <div className="fixed pointer-events-none" style={{
      left: `${layer.x}%`, top: `${layer.y}%`,
      transform: 'translate(-50%, -50%)',
      width: layer.width > 0 ? `${layer.width}px` : 'auto',
      opacity: layer.opacity / 100, zIndex: layer.zIndex,
      ['--speed' as any]: `${layer.animationSpeed}s`,
    }}>
      <img src={layer.url} alt="" className={animClass} style={{ width: '100%', height: 'auto', transform: `rotate(${layer.rotation}deg)`, borderRadius: '8px' }} draggable={false} />
    </div>
  );
}
