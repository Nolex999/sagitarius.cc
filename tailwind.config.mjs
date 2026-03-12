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
        accent: '#ffffff',
        'accent-dim': 'rgba(255,255,255,0.06)',
        'border-col': '#1f1f1f',
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
