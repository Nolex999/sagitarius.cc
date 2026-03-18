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
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030303]">
      {/* Top-Down Ambient Light (Main Pro Look) */}
      <div 
        className="absolute inset-x-0 top-0 h-[60vh] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(249, 115, 22, 0.25) 0%, transparent 80%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Subtle Side Glow */}
      <div 
        className="absolute bottom-0 right-0 w-[50vw] h-[50vh] opacity-10"
        style={{
          background: 'radial-gradient(circle at 100% 100%, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Interactive Cursor Light (Very Minimal/Pro) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(249, 115, 22, 0.04) 0%, transparent 20%)`,
        }}
      />

      {/* Professional Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 90%)',
        }}
      />

      {/* Ultra-Fine Micro Texture */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none noise-overlay" />

      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
