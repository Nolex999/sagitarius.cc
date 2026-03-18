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
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
      {/* Primary Floating Orb (Top Left) */}
      <div 
        className="absolute w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-20 transition-transform duration-1000 ease-linear"
        style={{
          background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
          animation: 'float1 30s ease-in-out infinite alternate',
        }}
      />

      {/* Secondary Floating Orb (Bottom Right) */}
      <div 
        className="absolute w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-[0.15] transition-transform duration-1000 ease-linear"
        style={{
          background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)',
          bottom: '-15%',
          right: '-15%',
          animation: 'float2 25s ease-in-out infinite alternate',
        }}
      />

      {/* Mouse Spotlight (High Intensity) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(249, 115, 22, 0.1) 0%, transparent 25%)`,
        }}
      />
      
      {/* Subtle Central Nebula */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vw] rounded-[100%] blur-[150px] opacity-10"
        style={{
          background: 'radial-gradient(circle, #ea580c 0%, transparent 80%)',
        }}
      />

      {/* Decorative Light Flecks (Minimal) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full blur-[4px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${4 + i}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(5%, 10%) rotate(5deg); }
          100% { transform: translate(-5%, 5%) rotate(-5deg); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-8%, -12%); }
          100% { transform: translate(2%, -5%); }
        }
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
