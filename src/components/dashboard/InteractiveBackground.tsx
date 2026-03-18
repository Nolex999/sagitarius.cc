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
      {/* Mesh Gradient Base - Much Softer */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-screen overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, rgba(249, 115, 22, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 90% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.04) 0%, transparent 70%)
          `,
          filter: 'blur(120px)',
          animation: 'meshMove 25s ease-in-out infinite alternate',
        }}
      />

      {/* Interactive Aura Glow (follows mouse) - Subtler */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(249, 115, 22, 0.05) 0%, transparent 30%)`,
        }}
      />

      {/* Ultra-soft Noise Texture (Fixed the 'granite' effect) */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none noise-overlay" />

      {/* Very Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.01]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }}
      />

      <style jsx>{`
        @keyframes meshMove {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.15) translate(-3%, -3%); }
          100% { transform: scale(1) translate(3%, 3%); }
        }
        
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          filter: brightness(100%);
        }
      `}</style>
    </div>
  );
}
