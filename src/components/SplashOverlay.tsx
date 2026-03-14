'use client';

import { useState, useEffect } from 'react';

export default function SplashOverlay() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');

  useEffect(() => {
    // Start fading after a short display
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 1200);

    // Fully remove after fade animation
    const removeTimer = setTimeout(() => {
      setPhase('gone');
    }, 2400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

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
        backgroundColor: '#020202',
        pointerEvents: phase === 'fading' ? 'none' : 'all',
      }}
    >
      {/* Subtle background grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Text */}
      <div className="splash-text-container" style={{ position: 'relative' }}>
        <h1
          className="splash-title"
          style={{
            fontFamily: "'Geist', 'IBM Plex Sans', system-ui, sans-serif",
            fontSize: 'clamp(3.5rem, 12vw, 10rem)',
            fontWeight: 900,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'transparent',
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            userSelect: 'none',
            margin: 0,
            lineHeight: 1,
          }}
        >
          SAGITARIUS.CC
        </h1>
      </div>
    </div>
  );
}
