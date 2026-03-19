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
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, active: false };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            const force = (100 - dist) / 100;
            this.vx += (dx / dist) * force * 0.6;
            this.vy += (dy / dist) * force * 0.6;
          }
        }

        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;

        this.vx *= 0.96;
        this.vy *= 0.96;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -100) this.x = width + 100;
        if (this.x > width + 100) this.x = -100;
        if (this.y < -100) this.y = height + 100;
        if (this.y > height + 100) this.y = -100;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.4)'; // Archer Orange
        ctx.fill();
      }
    }

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      const count = Math.floor((width * height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const draw = () => {
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, width, height);

      // Calculate parallax offsets (very subtle depth)
      const parallaxX = mouse.active ? (mouse.x - width / 2) * 0.01 : 0;
      const parallaxY = mouse.active ? (mouse.y - height / 2) * 0.01 : 0;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        
        // Final render position with parallax
        const rx1 = p1.x + parallaxX;
        const ry1 = p1.y + parallaxY;

        // Draw particle
        ctx.beginPath();
        ctx.arc(rx1, ry1, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const rx2 = p2.x + parallaxX;
          const ry2 = p2.y + parallaxY;
          
          const dx = rx1 - rx2;
          const dy = ry1 - ry2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(rx1, ry1);
            ctx.lineTo(rx2, ry2);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const dx = rx1 - mouse.x;
          const dy = ry1 - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(rx1, ry1);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
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
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020202]">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      
      {/* Subtle Bottom Glow for context */}
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />
      
      {/* Absolute Black Overlay for Top Header Area to keep it clean */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#020202] to-transparent pointer-events-none" />
      
      {/* Fine Micro-Grain */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" id="noise-overlay" />

      <style jsx>{`
        #noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
