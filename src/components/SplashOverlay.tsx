'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SplashOverlay() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');
  const pathname = usePathname();

  // Skip splash entirely on bio pages
  const isBioPage = pathname?.startsWith('/bio/');

  useEffect(() => {
    if (isBioPage) {
      setPhase('gone');
      return;
    }

    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 520);

    const removeTimer = setTimeout(() => {
      setPhase('gone');
    }, 920);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [isBioPage]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`splash-overlay ${phase === 'fading' ? 'splash-fade-out' : 'splash-fade-in'}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030607',
        pointerEvents: phase === 'fading' ? 'none' : 'all',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(94,234,212,0.08) 0%, rgba(56,189,248,0.03) 36%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle animated particles */}
      <div className="splash-particles" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              borderRadius: '50%',
              backgroundColor: 'rgba(94,234,212,0.24)',
              boxShadow: '0 0 8px rgba(94,234,212,0.18)',
              left: `${15 + i * 14}%`,
              top: `${30 + (i % 3) * 15}%`,
              animation: `splashParticleFloat ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Text */}
      <div className="splash-text-container" style={{ position: 'relative' }}>
        <h1
          className="splash-title"
          style={{
            fontFamily: "'Geist', 'IBM Plex Sans', system-ui, sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'transparent',
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(94,234,212,0.18) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            userSelect: 'none',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          SAGITARIUS.CC
        </h1>

        {/* Subtle accent line below title */}
        <div
          className="splash-title"
          style={{
            width: '60%',
            height: '1px',
            margin: '1.5rem auto 0',
            background: 'linear-gradient(90deg, transparent, rgba(94,234,212,0.42), rgba(56,189,248,0.36), transparent)',
            opacity: 0,
            animation: 'splashTitleReveal 0.42s cubic-bezier(0.16, 1, 0.3, 1) 0.16s forwards',
          }}
        />
      </div>
    </div>
  );
}
