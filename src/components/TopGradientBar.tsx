'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// Route-based gradient colors
const routeGradients: Record<string, string[]> = {
  '/dashboard': ['#a855f7', '#6366f1', '#8b5cf6'],
  '/auth': ['#ffffff', '#a1a1a1', '#ffffff'],
  '/bio': ['#22c55e', '#06b6d4', '#14b8a6'],
};

function getGradientForRoute(pathname: string): string[] {
  for (const [route, colors] of Object.entries(routeGradients)) {
    if (pathname.startsWith(route)) return colors;
  }
  return ['#a855f7', '#6366f1', '#8b5cf6']; // Default purple
}

export default function TopGradientBar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [colors, setColors] = useState(getGradientForRoute('/'));

  // Update gradient on route change
  useEffect(() => {
    setColors(getGradientForRoute(pathname));

    // Simulate loading animation on route change
    setIsLoading(true);
    setLoadProgress(0);

    const steps = [
      setTimeout(() => setLoadProgress(30), 50),
      setTimeout(() => setLoadProgress(60), 150),
      setTimeout(() => setLoadProgress(90), 300),
      setTimeout(() => {
        setLoadProgress(100);
        setTimeout(() => setIsLoading(false), 300);
      }, 500),
    ];

    return () => steps.forEach(clearTimeout);
  }, [pathname]);

  // Don't show on bio pages (clean public view)
  if (pathname?.startsWith('/bio/')) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 99998,
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* Ambient gradient bar (always visible) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${colors[0]}40, ${colors[1]}60, ${colors[2]}40)`,
          backgroundSize: '200% 100%',
          animation: 'topBarShimmer 4s ease infinite',
        }}
      />

      {/* Loading progress overlay */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${loadProgress}%`,
            background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
            boxShadow: `0 0 10px ${colors[1]}, 0 0 5px ${colors[0]}`,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '0 1px 1px 0',
          }}
        />
      )}
    </div>
  );
}
