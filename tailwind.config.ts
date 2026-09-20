import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#06090e',
          900: '#0b101b',
          850: '#0f1726',
          800: '#141d30',
          700: '#1c2842',
          600: '#2b3b5e',
          500: '#475e8a',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-glow': 'rgba(20, 184, 166, 0.35)',
        },
        primary: {
          DEFAULT: '#0d9488', // Teal 600
          hover: '#0f766e',   // Teal 700
          light: '#ccfbf1',   // Teal 100
          glow: '#14b8a6',    // Teal 500
          neon: '#00f5d4',    // Pixlr Neon Cyan
        },
        secondary: {
          DEFAULT: '#2563eb', // Blue 600
          hover: '#1d4ed8',   // Blue 700
          light: '#dbeafe',   // Blue 100
          glow: '#38bdf8',    // Sky Glow
        },
        accent: {
          DEFAULT: '#7c3aed', // Purple 600
          hover: '#6d28d9',   // Purple 700
          light: '#ede9fe',   // Purple 100
          neon: '#a855f7',    // Neon Violet
        },
      },
      boxShadow: {
        'glow-teal': '0 0 25px -4px rgba(20, 184, 166, 0.4)',
        'glow-cyan': '0 0 35px -5px rgba(0, 245, 212, 0.35)',
        'glow-purple': '0 0 25px -4px rgba(168, 85, 247, 0.35)',
        'dark-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'dark-elevated': '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'studio-glow': 'radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.15), rgba(124, 58, 237, 0.08), transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
