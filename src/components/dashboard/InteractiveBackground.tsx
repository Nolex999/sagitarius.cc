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
      {/* Mesh Gradient Base */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.05) 0%, transparent 60%)
          `,
          filter: 'blur(80px)',
          animation: 'meshMove 20s ease-in-out infinite alternate',
        }}
      />

      {/* Interactive Aura Glow (follows mouse) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(249, 115, 22, 0.08) 0%, transparent 35%)`,
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-overlay" />

      {/* Subtle Grid / Pattern (Archer theme hint) */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <style jsx>{`
        @keyframes meshMove {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, -2%); }
          100% { transform: scale(1) translate(2%, 2%); }
        }
        
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          filter: contrast(150%) brightness(100%);
        }
      `}</style>
    </div>
  );
}
