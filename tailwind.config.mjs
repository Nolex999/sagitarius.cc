/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#080808',
        'bg-surface': '#111111',
        'bg-elevated': '#1a1a1a',
        'border-default': '#242424',
        'border-active': '#3d3d3d',
        'text-primary': '#f5f5f5',
        'text-secondary': '#888888',
        'text-muted': '#444444',
        accent: '#C5A059',
        'accent-dim': 'rgba(197, 160, 89, 0.06)',
        'accent-gold': '#D4AF37',
        'border-col': '#1a1814',
      },
      fontFamily: {
        mono: ['ui-monospace', 'monospace'],
        sans: ['system-ui', 'IBM Plex Sans', 'sans-serif'],
      },
      fontSize: {
        base: ['13px', { lineHeight: '1.6' }],
        'display-xs': ['11px', { letterSpacing: '0.3em' }],
      },
    },
  },
  plugins: [],
};
