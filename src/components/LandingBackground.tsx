'use client';

import { useEffect, useRef } from 'react';

export default function LandingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let time = 0;
    const mouse = { x: 0, y: 0, active: false };

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const draw = () => {
      time += 0.005;
      ctx.fillStyle = '#050403';
      ctx.fillRect(0, 0, width, height);

      const rows = 40;
      const cols = 40;
      const xGap = width / cols;
      const yGap = height / rows;

      ctx.lineWidth = 1;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
            const bx = i * xGap;
            const by = j * yGap;

            // Distance from mouse
            const dx = bx - mouse.x;
            const dy = by - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Magnetic distortion
            const influence = Math.max(0, 1 - dist / 300);
            const angle = Math.atan2(dy, dx);
            
            const offset = Math.sin(time + (i * 0.2) + (j * 0.3)) * 10;
            const mx = bx + Math.cos(angle) * influence * 50 + offset;
            const my = by + Math.sin(angle) * influence * 50 + offset;

            // Subtle particles at intersections
            const opacity = 0.05 + influence * 0.3;
            ctx.fillStyle = `rgba(197, 160, 89, ${opacity})`;
            ctx.beginPath();
            ctx.arc(mx, my, 1 + influence * 2, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby intersections with very faint lines if near mouse
            if (influence > 0.4) {
                ctx.strokeStyle = `rgba(197, 160, 89, ${influence * 0.1})`;
                ctx.beginPath();
                ctx.moveTo(mx, my);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
      }

      // Draw light rays from mouse
      if (mouse.active) {
          const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 500);
          gradient.addColorStop(0, 'rgba(197, 160, 89, 0.05)');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    init();
    draw();

    return () => {
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050403]">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050403]/20 to-[#050403] pointer-events-none" />
    </div>
  );
}
