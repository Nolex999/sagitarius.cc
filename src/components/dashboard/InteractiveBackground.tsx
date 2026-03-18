'use client';

import { useEffect, useState } from 'react';

export default function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020202]">
      {/* Background Mesh Gradient with "Liquid" Distortion */}
      <div 
        className="absolute inset-x-0 top-0 h-full w-full opacity-60 mix-blend-screen"
        style={{
          background: `
            radial-gradient(circle at 20% 40%, rgba(249, 115, 22, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 80% 60%, rgba(251, 191, 36, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.2) 0%, transparent 60%)
          `,
          filter: 'url(#liquid-filter) blur(80px)',
          animation: 'meshMove 25s ease-in-out infinite alternate',
        }}
      />

      {/* Interactive Cursor Light (The Lens Flare) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(249, 115, 22, 0.15), transparent 80%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Floating Macro-Glares (High-End Pro look) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] w-[60%] bg-gradient-to-r from-transparent via-orange-400 to-transparent rotate-[15deg] blur-[2px]"
            style={{
              top: `${10 + i * 25}%`,
              left: `${(mousePos.x - 50) * (0.1 * i)}%`,
              animation: `float-line ${10 + i * 5}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Static Grain Texture (Ultra-Subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none noise-overlay" />

      {/* SVG Liquid Filter */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="liquid-filter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.012" 
              numOctaves="3" 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="120" 
            />
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes meshMove {
          0% { transform: scale(1) translate(0, 0) rotate(0deg); }
          50% { transform: scale(1.2) translate(-5%, -5%) rotate(2deg); }
          100% { transform: scale(1) translate(5%, 5%) rotate(-2deg); }
        }
        @keyframes float-line {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(200%) rotate(15deg); }
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
