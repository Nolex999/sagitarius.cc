'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let frame = 0;
    const mouse = { x: 0, y: 0, active: false };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, width, height);

      // We draw 3 layers of fluid waves
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const offset = layer * 300;
        const time = frame * 0.005;
        
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 10) {
          // Complex wave formula for a "liquid" look
          const y = (height * 0.7) + 
                    Math.sin(x * 0.002 + time + offset) * 50 +
                    Math.cos(x * 0.001 - time * 0.5) * 30 +
                    (mouse.active ? Math.exp(-Math.pow(x - mouse.x, 2) / 20000) * -40 : 0);
          
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        
        // Gradient for the wave "rim"
        const grad = ctx.createLinearGradient(0, height * 0.5, 0, height);
        const alpha = 0.05 + (layer * 0.02);
        grad.addColorStop(0, `rgba(249, 115, 22, ${alpha})`);
        grad.addColorStop(1, 'rgba(2, 2, 2, 0)');
        
        ctx.fillStyle = grad;
        ctx.fill();
        
        // Subtle outline for the "rim light"
        ctx.strokeStyle = `rgba(249, 115, 22, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Mouse Spotlight
      if (mouse.active) {
        const spotlight = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
        spotlight.addColorStop(0, 'rgba(249, 115, 22, 0.03)');
        spotlight.addColorStop(1, 'rgba(2, 2, 2, 0)');
        ctx.fillStyle = spotlight;
        ctx.fillRect(0, 0, width, height);
      }

      frame++;
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020202]">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      
      {/* Absolute Black Overlay for Top Header Area to keep it clean */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#020202] to-transparent pointer-events-none" />
      
      {/* Fine Micro-Grain */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none noise-overlay" />

      <style jsx>{`
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
